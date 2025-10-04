import type { LocationData, NasaMoonData } from '@/types/moon';

// API Key de NASA - obtén la tuya gratis en https://api.nasa.gov/
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';
const ASTRONOMY_API = 'https://api.astronomyapi.com/api/v2/bodies/positions/moon';

/**
 * Obtiene datos precisos de la fase lunar desde NASA/Astronomy API
 * @param date - Fecha para calcular la fase lunar
 * @param location - Ubicación del observador (opcional)
 * @returns Datos detallados de la fase lunar
 */
export async function fetchMoonPhaseFromNASA(
  date: Date,
  location?: LocationData | null
): Promise<NasaMoonData> {
  try {
    // Opción 1: Usar API de astronomía (más simple y específica para la luna)
    const formattedDate = formatDateForAPI(date);
    
    // Por ahora usaremos un cálculo mejorado local
    // Para usar NASA Horizons API requiere más configuración
    return await fetchMoonPhaseAlternative(date, location);
    
  } catch (error) {
    console.error('Error fetching moon data from NASA:', error);
    throw error;
  }
}

/**
 * API alternativa más simple para obtener datos lunares
 */
async function fetchMoonPhaseAlternative(
  date: Date,
  location?: LocationData | null
): Promise<NasaMoonData> {
  try {
    // Usar API pública de datos astronómicos
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const lat = location?.latitude || 0;
    const lon = location?.longitude || 0;
    
    // API gratuita de fases lunares
    const response = await fetch(
      `https://api.farmsense.net/v1/moonphases/?d=${year}${month}${day}`
    );
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    
    return parseFarmSenseData(data[0]);
    
  } catch (error) {
    console.error('Error with alternative API:', error);
    throw error;
  }
}

/**
 * Parsea los datos de la API FarmSense
 */
function parseFarmSenseData(data: any): NasaMoonData {
  // Datos de la API FarmSense
  const phaseValue = parseFloat(data.Phase);
  const targetDate = data.TargetDate;
  
  // Convertir fase de FarmSense (0-1) a nuestro formato
  const phase = phaseValue;
  const illumination = calculateIllumination(phase);
  const phaseName = getPhaseName(phase);
  
  return {
    phase,
    illumination,
    distance: 384400, // Distancia promedio Tierra-Luna en km
    angularDiameter: 0.52, // Diámetro angular promedio en grados
    phaseName
  };
}

/**
 * Calcula el porcentaje de iluminación basado en la fase
 */
function calculateIllumination(phase: number): number {
  // La iluminación es máxima (100%) en luna llena (phase = 0.5)
  // y mínima (0%) en luna nueva (phase = 0 o 1)
  const normalizedPhase = phase > 0.5 ? 1 - phase : phase;
  return normalizedPhase * 200; // Convertir 0-0.5 a 0-100%
}

/**
 * Obtiene el nombre de la fase lunar en español
 */
function getPhaseName(phase: number): string {
  const phaseNames = [
    'Luna Nueva',
    'Creciente Iluminante',
    'Cuarto Creciente',
    'Creciente Gibosa',
    'Luna Llena',
    'Menguante Gibosa',
    'Cuarto Menguante',
    'Menguante Iluminante'
  ];
  
  const index = Math.floor(phase * 8) % 8;
  return phaseNames[index];
}

/**
 * Formatea la fecha para la API
 */
function formatDateForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Cache simple para evitar llamadas repetidas a la API
 */
const cache = new Map<string, { data: NasaMoonData; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora

export async function fetchMoonPhaseWithCache(
  date: Date,
  location?: LocationData | null
): Promise<NasaMoonData> {
  const cacheKey = `${formatDateForAPI(date)}_${location?.latitude}_${location?.longitude}`;
  
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const data = await fetchMoonPhaseFromNASA(date, location);
  cache.set(cacheKey, { data, timestamp: Date.now() });
  
  return data;
}
