import { useState, Suspense } from "react";
import { Moon, MapPin, Loader2, Satellite, Calendar } from "lucide-react";
import MoonViewer3D from "@/components/MoonViewer3D";
import LunarCalendar from "@/components/LunarCalendar";
import LunarInfo from "@/components/LunarInfo";
import { LunarImagery } from "@/components/LunarImagery";
import { LunarStories } from "@/components/LunarStories";
import { NASADisclaimer } from "@/components/NASADisclaimer";
import { RadialNavMenu } from "@/components/RadialNavMenu";
import { useMoonPhase } from "@/hooks/useMoonPhase";
import logoMuna from "@/images/logo_w.png";
import MoonHorizon from "@/components/MoonHorizon";
import MoonStats from "@/components/MoonStats";
import MoonInfluences from "@/components/MoonInfluences";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { loading, userLocation, source, ...moonData } = useMoonPhase(selectedDate);

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/60 rounded-full animate-glow-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-4 mt-8">
            <img src={logoMuna} alt="MUNA Logo" className="h-16 object-contain animate-float" />
          </div>
          <p className="text-muted-foreground text-lg">
            Explora el ciclo lunar y sus influencias
          </p>
          
          {/* Location and data source indicator */}
          {userLocation && (
            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{userLocation}</span>
              {loading && <Loader2 className="w-3 h-3 animate-spin ml-1" />}
            </div>
          )}
        </header>

        {/* Sección: Visualización Lunar */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Visualización Lunar
            </h2>
          </div>
          
          {/* Descripción de la sección */}
          <div className="mb-6 p-4 rounded-lg bg-muted/30 border-2 border-primary">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Tu guía lunar completa.</span> Explora el calendario lunar interactivo para visualizar 
              las fases de la luna en cualquier fecha. El modelo 3D te permite observar la iluminación lunar en tiempo real, mientras que las 
              recomendaciones tradicionales te ayudan a planificar actividades según el ciclo lunar, desde el corte de cabello hasta la siembra 
              y cosecha en el huerto.
            </p>
          </div>

          {/* Main Grid - Expandido */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Calendar */}
            <div className="space-y-6">
              {/* Calendar */}
              <LunarCalendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>

            {/* Right Column - 3D Moon and Info */}
            <div className="space-y-6">
              <div className="card-glass rounded-2xl p-8 h-[500px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Moon className="w-16 h-16 mx-auto mb-4 text-primary animate-glow-pulse" />
                        <p className="text-muted-foreground">Cargando luna...</p>
                      </div>
                    </div>
                  }
                >
                  <MoonViewer3D phase={moonData.phase} />
                </Suspense>
              </div>

              <LunarInfo
                phaseName={moonData.phaseName}
                phasePercentage={moonData.phasePercentage}
              />
            </div>
          </div>
        </div>

        {/* Nueva sección: Datos Extendidos */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Moon className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Análisis Lunar Detallado
            </h2>
          </div>
          
          {/* Descripción de la sección */}
          <div className="mb-6 p-4 rounded-lg bg-muted/30 border-2 border-primary">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">¿Por qué es importante?</span> Este análisis combina datos astronómicos precisos con observaciones tradicionales 
              sobre la influencia lunar. La trayectoria de la luna afecta las mareas, ciclos biológicos y actividades agrícolas. 
              Comprender estos patrones te ayuda a sincronizar tus actividades con los ritmos naturales del cosmos.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <MoonHorizon date={selectedDate} phase={moonData.phase} />
            
            <MoonStats 
              distance={moonData.distance || 384400}
              angularDiameter={moonData.angularDiameter || 0.52}
              phase={moonData.phase}
              phaseName={moonData.phaseName}
            />
          </div>

          <div className="mt-6">
            <MoonInfluences 
              phase={moonData.phase}
              phaseName={moonData.phaseName}
            />
          </div>
        </div>

        {/* Sección: Recursos NASA */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Satellite className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Recursos NASA
            </h2>
          </div>
          
          {/* Descripción de la sección */}
          <div className="mb-6 p-4 rounded-lg bg-muted/30 border-2 border-primary">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Explorando el cosmos.</span> La NASA proporciona imágenes en tiempo real 
              y contenido educativo sobre nuestro satélite natural. Estas herramientas permiten observar la superficie lunar, 
              descubrir misiones espaciales y mantenerse actualizado con los últimos hallazgos científicos sobre la Luna.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <LunarImagery date={selectedDate} />
            <LunarStories />
          </div>
        </div>

        {/* Disclaimer NASA */}
        <NASADisclaimer />

        {/* Footer */}
        <footer className="text-center mt-8 text-muted-foreground text-sm animate-fade-in">
          <p>
            Datos {source === 'nasa' ? 'obtenidos de API astronómica' : 'calculados localmente'} 
            {' • '} 
            Sincronizado con el ciclo lunar
          </p>
          {source === 'nasa' && (
            <p className="text-xs mt-2 text-muted-foreground/70">
              Datos precisos según tu ubicación geográfica
            </p>
          )}
          <p className="text-xs mt-3 opacity-70">
            Powered by{" "}
            <a 
              href="https://api.nasa.gov" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              NASA Open APIs
            </a>
            {" • "}
            <a 
              href="https://earthdata.nasa.gov" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Earthdata
            </a>
          </p>
        </footer>
      </div>

      {/* Menú de navegación radial */}
      <RadialNavMenu />
    </div>
  );
};

export default Index;
