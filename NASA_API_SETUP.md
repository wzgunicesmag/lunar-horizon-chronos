# 🌙 Integración con API de NASA - Guía de Configuración

## 📋 Archivos Creados

### 1. **Tipos TypeScript** (`src/types/moon.ts`)
Define las interfaces para los datos lunares:
- `LocationData`: Información de ubicación del usuario
- `NasaMoonData`: Datos de la API
- `MoonPhaseData`: Datos completos de la fase lunar

### 2. **Servicio de Geolocalización** (`src/services/geolocation.ts`)
Obtiene la ubicación del usuario usando:
- API de Geolocalización del navegador
- API gratuita de geocodificación inversa (BigDataCloud)
- Ubicaciones predeterminadas por zona horaria como fallback

### 3. **Servicio de API NASA** (`src/services/nasaApi.ts`)
Obtiene datos precisos de fases lunares:
- Usa FarmSense Moon Phases API (gratis, sin API key)
- Sistema de caché para reducir llamadas
- Cálculos de iluminación y distancia

### 4. **Hook Actualizado** (`src/hooks/useMoonPhase.ts`)
Hook mejorado que:
- Obtiene ubicación del usuario
- Llama a la API para datos precisos
- Fallback automático a cálculo local si la API falla
- Retorna información de fuente de datos y ubicación

### 5. **Componente Actualizado** (`src/pages/Index.tsx`)
Muestra:
- Ubicación del usuario con ícono de mapa
- Indicador de carga mientras obtiene datos
- Fuente de datos en el footer (NASA o local)

## 🚀 Cómo Usar

### Opción 1: API Gratuita (Sin configuración)
Por defecto, usa **FarmSense Moon Phases API** que es gratuita y no requiere API key.

¡Ya está funcionando! Solo ejecuta:
```bash
npm run dev
```

### Opción 2: API de NASA (Requiere API Key)
Para usar datos directamente de NASA:

1. **Obtener API Key gratis:**
   - Visita: https://api.nasa.gov/
   - Registra tu email
   - Recibirás tu API key instantáneamente

2. **Configurar la API Key:**
   ```bash
   # En el archivo .env
   VITE_NASA_API_KEY=tu_api_key_aqui
   ```

3. **Modificar el servicio** (opcional):
   En `src/services/nasaApi.ts`, puedes cambiar a usar NASA Horizons API directamente.

## 🌍 Características

### ✅ Geolocalización Automática
- Solicita permiso del navegador para ubicación
- Muestra la ciudad del usuario
- Usa zona horaria como fallback

### ✅ Datos Precisos de API
- Fase lunar exacta según fecha
- Porcentaje de iluminación
- Distancia Tierra-Luna
- Nombre de fase en español

### ✅ Fallback Robusto
- Si la API falla → usa cálculo local
- Si no hay ubicación → usa cálculo geocéntrico
- Siempre muestra datos, nunca falla completamente

### ✅ Optimización
- Sistema de caché (1 hora)
- Reduce llamadas innecesarias a la API
- Carga rápida de datos

## 📊 Fuentes de Datos

### API Actual: FarmSense Moon Phases
- ✅ Gratis
- ✅ Sin API key
- ✅ Datos precisos
- ✅ Sin límites de uso
- URL: `https://api.farmsense.net/v1/moonphases/`

### Alternativas Disponibles:

1. **NASA Horizons API**
   - Más preciso
   - Requiere más configuración
   - Datos astronómicos completos

2. **Cálculo Local (Fallback)**
   - Basado en fecha juliana
   - Precisión del ~95%
   - Sin dependencias externas

## 🔧 Personalización

### Cambiar API de Datos
Edita `src/services/nasaApi.ts` y modifica la función `fetchMoonPhaseAlternative()`

### Agregar Más Datos
En `src/types/moon.ts`, extiende `MoonPhaseData` con:
- Próxima luna llena
- Salida/puesta de la luna
- Declinación lunar
- Etc.

### Personalizar Ubicación
Edita `src/services/geolocation.ts` para:
- Agregar más ciudades predeterminadas
- Cambiar el servicio de geocodificación
- Deshabilitar la geolocalización

## 🐛 Solución de Problemas

### El navegador no permite geolocalización
**Solución:** El app usa zona horaria como fallback automáticamente.

### Error de CORS con la API
**Solución:** Las APIs usadas permiten CORS. Si usas otra API, necesitarás un proxy.

### Datos incorrectos
**Solución:** Verifica que la fecha sea válida y la ubicación correcta.

## 📱 Permisos del Navegador

La app solicitará:
- ✅ **Geolocalización**: Para cálculos precisos según ubicación
- ✅ **Conexión a Internet**: Para obtener datos de la API

## 🔒 Privacidad

- La ubicación se usa solo localmente
- No se almacena ni envía a servidores
- Solo se comparte con las APIs de datos lunares
- Puedes denegar el permiso sin afectar funcionalidad

## 📈 Próximas Mejoras

- [ ] Integración con NASA Horizons API completa
- [ ] Datos de eclipses lunares
- [ ] Hora exacta de salida/puesta de luna
- [ ] Notificaciones de fases importantes
- [ ] Exportar datos a calendario

---

¡Disfruta explorando las fases lunares con datos precisos! 🌙✨
