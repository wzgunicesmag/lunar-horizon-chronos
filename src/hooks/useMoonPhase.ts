import { useState, useEffect, useCallback } from 'react';
import { fetchMoonPhaseWithCache } from '@/services/nasaApi';
import { getUserLocation, getDefaultLocation } from '@/services/geolocation';
import type { MoonPhaseData, LocationData } from '@/types/moon';

// Cache para evitar recálculos innecesarios
const phaseCache = new Map<string, MoonPhaseData>();

// Función de cálculo local mejorada como FALLBACK
function calculateMoonPhaseLocal(date: Date): MoonPhaseData {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Cálculo Julian Day más preciso
  let a = Math.floor((14 - month) / 12);
  let y = year - a;
  let m = month + 12 * a - 3;
  
  let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  // Época lunar conocida (Luna Nueva del 6 de enero de 2000)
  const knownNewMoon = 2451549.5;
  const synodicMonth = 29.53058867;
  
  // Días desde la época
  const daysSinceKnown = jd - knownNewMoon;
  
  // Fase lunar normalizada
  let phase = (daysSinceKnown / synodicMonth) % 1;
  if (phase < 0) phase += 1;

  // Calcular iluminación con mayor precisión
  const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100;

  // Determinar fase name con los MISMOS rangos que la API
  let phaseName: string;
  if (phase < 0.0625 || phase >= 0.9375) {
    phaseName = "Luna Nueva";
  } else if (phase < 0.1875) {
    phaseName = "Creciente Iluminante";
  } else if (phase < 0.3125) {
    phaseName = "Cuarto Creciente";
  } else if (phase < 0.4375) {
    phaseName = "Creciente Gibosa";
  } else if (phase < 0.5625) {
    phaseName = "Luna Llena";
  } else if (phase < 0.6875) {
    phaseName = "Menguante Gibosa";
  } else if (phase < 0.8125) {
    phaseName = "Cuarto Menguante";
  } else {
    phaseName = "Menguante Iluminante";
  }

  return {
    phase,
    phaseName,
    phasePercentage: illumination,
    illumination,
    source: 'local'
  };
}

export function useMoonPhase(selectedDate: Date) {
  const [moonData, setMoonData] = useState<MoonPhaseData>(() => {
    const cacheKey = selectedDate.toDateString();
    return phaseCache.get(cacheKey) || calculateMoonPhaseLocal(selectedDate);
  });
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false); // Cambiar a false inicialmente

  // Función para obtener datos de la luna con cache
  const fetchMoonData = useCallback(async (date: Date, loc: LocationData | null) => {
    const cacheKey = date.toDateString();
    
    // Verificar cache primero
    if (phaseCache.has(cacheKey)) {
      return phaseCache.get(cacheKey)!;
    }

    try {
      // Intentar obtener datos de la API
      const nasaData = await fetchMoonPhaseWithCache(date, loc);
      
      const moonPhaseData: MoonPhaseData = {
        phase: nasaData.phase,
        phaseName: nasaData.phaseName,
        phasePercentage: nasaData.illumination,
        illumination: nasaData.illumination,
        distance: nasaData.distance,
        angularDiameter: nasaData.angularDiameter,
        location: loc?.city,
        source: 'nasa'
      };

      // Guardar en cache
      phaseCache.set(cacheKey, moonPhaseData);
      return moonPhaseData;
      
    } catch (error) {
      // Fallback al cálculo local
      console.warn('Usando cálculo local como fallback:', error);
      
      const localData = calculateMoonPhaseLocal(date);
      phaseCache.set(cacheKey, localData);
      return localData;
    }
  }, []);

  // Obtener ubicación del usuario al montar el componente
  useEffect(() => {
    let isMounted = true;
    
    getUserLocation().then((loc) => {
      if (isMounted) {
        setLocation(loc || getDefaultLocation());
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Calcular fase lunar cuando cambia la fecha o ubicación
  useEffect(() => {
    let isMounted = true;
    
    async function updateMoonData() {
      // Solo mostrar loading para solicitudes que realmente van a la API
      const cacheKey = selectedDate.toDateString();
      const isInCache = phaseCache.has(cacheKey);
      
      if (!isInCache) {
        setLoading(true);
      }
      
      try {
        const data = await fetchMoonData(selectedDate, location);
        if (isMounted) {
          setMoonData(data);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    // Usar ubicación disponible o default
    updateMoonData();

    return () => {
      isMounted = false;
    };
  }, [selectedDate, location, fetchMoonData]);

  return { ...moonData, loading, userLocation: location?.city };
}
