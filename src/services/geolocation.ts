import type { LocationData } from '@/types/moon';

/**
 * Obtiene la ubicación geográfica del usuario usando el navegador
 * @returns Datos de ubicación incluyendo coordenadas, ciudad y zona horaria
 */
export async function getUserLocation(): Promise<LocationData | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocalización no soportada por este navegador');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Obtener zona horaria y ciudad usando API de geocodificación inversa (gratis)
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es`
          );
          const data = await response.json();
          
          resolve({
            latitude,
            longitude,
            city: data.city || data.locality || data.countryName,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          });
        } catch (error) {
          console.warn('Error obteniendo información de la ciudad:', error);
          resolve({
            latitude,
            longitude,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          });
        }
      },
      (error) => {
        console.warn('Error obteniendo ubicación del usuario:', error);
        resolve(null);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000 // Cache por 5 minutos
      }
    );
  });
}

/**
 * Obtiene una ubicación predeterminada basada en la zona horaria del navegador
 * Útil como fallback cuando el usuario no permite geolocalización
 */
export function getDefaultLocation(): LocationData {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Ubicaciones predeterminadas por zona horaria
  const timezoneDefaults: Record<string, Partial<LocationData>> = {
    'America/Mexico_City': { latitude: 19.4326, longitude: -99.1332, city: 'Ciudad de México' },
    'America/Bogota': { latitude: 4.7110, longitude: -74.0721, city: 'Bogotá' },
    'America/Lima': { latitude: -12.0464, longitude: -77.0428, city: 'Lima' },
    'America/Buenos_Aires': { latitude: -34.6037, longitude: -58.3816, city: 'Buenos Aires' },
    'America/Santiago': { latitude: -33.4489, longitude: -70.6693, city: 'Santiago' },
    'Europe/Madrid': { latitude: 40.4168, longitude: -3.7038, city: 'Madrid' },
  };

  const defaults = timezoneDefaults[timezone] || { 
    latitude: 0, 
    longitude: 0, 
    city: 'Ubicación desconocida' 
  };

  return {
    latitude: defaults.latitude || 0,
    longitude: defaults.longitude || 0,
    city: defaults.city,
    timezone
  };
}
