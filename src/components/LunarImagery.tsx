import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Loader2, ExternalLink, AlertCircle, ImageOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LunarImageryProps {
  date: Date;
}

interface APODData {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
  date: string;
  copyright?: string;
}

// Usar la API key del archivo .env, con fallback a DEMO_KEY
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';

export function LunarImagery({ date }: LunarImageryProps) {
  const [apodData, setApodData] = useState<APODData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAPOD = async () => {
      // Resetear estados
      setLoading(true);
      setError(null);
      setApodData(null);
      
      try {
        // Verificar que la fecha no sea futura
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);
        
        if (selectedDate > today) {
          setError('Las imágenes solo están disponibles hasta el día de hoy');
          setLoading(false);
          return;
        }

        // Verificar que la fecha no sea antes del inicio de APOD
        const apodStartDate = new Date('1995-06-16');
        if (selectedDate < apodStartDate) {
          setError('APOD comenzó el 16 de junio de 1995');
          setLoading(false);
          return;
        }

        // Formatear fecha
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${formattedDate}`;
        
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('No hay imagen disponible para esta fecha');
          } else if (response.status === 429) {
            setError('Límite de solicitudes excedido. Intenta más tarde');
          } else {
            setError(`Error ${response.status}: No se pudo cargar la imagen`);
          }
          setLoading(false);
          return;
        }
        
        const data: APODData = await response.json();
        
        if (!data.url) {
          setError('Datos incompletos recibidos');
          setLoading(false);
          return;
        }
        
        setApodData(data);
      } catch (err) {
        console.error('Error fetching APOD:', err);
        setError('Error de conexión. Verifica tu internet');
      } finally {
        setLoading(false);
      }
    };

    // Debounce para evitar llamadas muy rápidas
    const timeoutId = setTimeout(fetchAPOD, 500);
    
    return () => clearTimeout(timeoutId);
  }, [date]);

  // Estado de carga
  if (loading) {
    return (
      <Card className="card-glass p-6">
        <h3 className="text-xl font-semibold mb-4">Imagen Astronómica del Día</h3>
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Cargando imagen de NASA...</p>
        </div>
      </Card>
    );
  }

  // Estado de error
  if (error) {
    return (
      <Card className="card-glass p-6">
        <h3 className="text-xl font-semibold mb-6">Imagen Astronómica del Día</h3>
        
        {/* Contenido central con icono */}
        <div className="flex flex-col items-center justify-center py-12 space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
            <ImageOff className="relative w-20 h-20 text-primary/70" />
          </div>
          
          <div className="text-center space-y-3 max-w-md">
            <h4 className="text-lg font-semibold">
              📅 Prueba con otra fecha
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Utiliza el calendario para seleccionar un día diferente y descubrir 
              imágenes astronómicas fascinantes capturadas por la NASA
            </p>
          </div>

          {/* Información adicional */}
          <div className="text-center space-y-2 pt-4">
            <p className="text-xs text-muted-foreground/70">
              💡 <strong>Consejo:</strong> Las fechas recientes suelen tener contenido disponible
            </p>
            <p className="text-xs text-muted-foreground/60">
              Archivo disponible desde el 16 de junio de 1995
            </p>
          </div>

          {/* Enlace al archivo */}
          <a
            href="https://apod.nasa.gov/apod/archivepix.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
          >
            Ver archivo completo de APOD <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </Card>
    );
  }

  // Estado sin datos
  if (!apodData) {
    return (
      <Card className="card-glass p-6">
        <h3 className="text-xl font-semibold mb-4">Imagen Astronómica del Día</h3>
        <div className="flex flex-col items-center justify-center h-96">
          <ImageOff className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-center">
            Selecciona una fecha en el calendario
          </p>
        </div>
      </Card>
    );
  }

  // Estado exitoso con datos
  return (
    <Card className="card-glass p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold mb-1">Imagen Astronómica del Día</h3>
            <p className="text-xs text-muted-foreground">{apodData.date}</p>
          </div>
        </div>
        
        {/* Imagen o Video */}
        <div className="relative rounded-lg overflow-hidden bg-black/20">
          {apodData.media_type === 'image' ? (
            <img
              src={apodData.url}
              alt={apodData.title}
              className="w-full h-96 object-cover"
              onError={() => {
                setError('Error al cargar la imagen');
                setApodData(null);
              }}
              loading="lazy"
            />
          ) : apodData.media_type === 'video' ? (
            <div className="aspect-video">
              <iframe
                src={apodData.url}
                className="w-full h-full"
                title={apodData.title}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 bg-muted/20">
              <div className="text-center">
                <ImageOff className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Tipo de contenido no soportado</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Título y Descripción */}
        <div className="space-y-2">
          <h4 className="font-semibold text-lg">{apodData.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-4">
            {apodData.explanation}
          </p>
          {apodData.copyright && (
            <p className="text-xs text-muted-foreground/60">
              © {apodData.copyright}
            </p>
          )}
        </div>

        {/* Enlaces */}
        <div className="flex flex-wrap gap-3 pt-2 border-t border-border/50">
          {apodData.hdurl && apodData.media_type === 'image' && (
            <a
              href={apodData.hdurl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Ver en HD <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <a
            href={`https://apod.nasa.gov/apod/ap${apodData.date.slice(2).replace(/-/g, '')}.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            Ver en APOD oficial <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </Card>
  );
}