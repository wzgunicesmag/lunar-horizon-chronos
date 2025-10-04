import { useState, useEffect } from 'react';
import { fetchMoonPhaseWithCache } from '@/services/nasaApi';
import { getUserLocation, getDefaultLocation } from '@/services/geolocation';
import type { MoonPhaseData, LocationData } from '@/types/moon';

// Calculate moon phase based on date (FALLBACK LOCAL)
function calculateMoonPhaseLocal(date: Date): MoonPhaseData {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Julian date calculation
  let jd = 367 * year - Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4) +
    Math.floor(275 * month / 9) + day + 1721013.5;

  // Days since known new moon (January 6, 2000)
  const daysSinceNew = jd - 2451549.5;
  
  // Moon phase (synodic month ≈ 29.53 days)
  const newMoons = daysSinceNew / 29.53;
  let phase = newMoons - Math.floor(newMoons);
  
  if (phase < 0) phase += 1;

  // Calculate illumination percentage
  const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100;

  // Determine phase name
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
  const [moonData, setMoonData] = useState<MoonPhaseData>(() => 
    calculateMoonPhaseLocal(selectedDate)
  );
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);

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
    
    async function fetchMoonData() {
      setLoading(true);
      
      try {
        // Intentar obtener datos de la API (NASA/Astronomy)
        const nasaData = await fetchMoonPhaseWithCache(selectedDate, location);
        
        if (isMounted) {
          setMoonData({
            phase: nasaData.phase,
            phaseName: nasaData.phaseName,
            phasePercentage: nasaData.illumination,
            illumination: nasaData.illumination,
            distance: nasaData.distance,
            angularDiameter: nasaData.angularDiameter,
            location: location?.city,
            source: 'nasa'
          });
        }
      } catch (error) {
        // Fallback al cálculo local si la API falla
        console.warn('Usando cálculo local como fallback:', error);
        
        if (isMounted) {
          const localData = calculateMoonPhaseLocal(selectedDate);
          setMoonData({
            ...localData,
            location: location?.city
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    // Esperar a tener ubicación antes de hacer el cálculo
    if (location) {
      fetchMoonData();
    } else {
      // Si no hay ubicación, usar cálculo local
      setMoonData({
        ...calculateMoonPhaseLocal(selectedDate),
        location: undefined
      });
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [selectedDate, location]);

  return { ...moonData, loading, userLocation: location?.city };
}
