import { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { NASADisclaimer } from "@/components/NASADisclaimer";
import { RadialNavMenu } from "@/components/RadialNavMenu";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { CalendarioSection } from "@/components/sections/CalendarioSection";
import { AnalisisSection } from "@/components/sections/AnalisisSection";
import { EventosSection } from "@/components/sections/EventosSection";
import { PerfilSection } from "@/components/sections/PerfilSection";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useMoonPhase } from "@/hooks/useMoonPhase";
import logoMuna from "@/images/logo_w.png";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { loading, userLocation, source, ...moonData } = useMoonPhase(selectedDate);
  const { currentSection } = useAppNavigation();
  const [showWelcome, setShowWelcome] = useState(true);
  const [appReady, setAppReady] = useState(false);

  // Marcar la app como lista cuando los datos principales se hayan cargado
  useEffect(() => {
    if (!loading && moonData.phase !== undefined) {
      setAppReady(true);
    }
  }, [loading, moonData.phase]);

  return (
    <>
      {/* Pantalla de bienvenida - se muestra encima de todo */}
      {showWelcome && <WelcomeScreen onSkip={() => setShowWelcome(false)} />}

      {/* Contenido principal - se carga en segundo plano */}
      <div className="min-h-screen w-full overflow-hidden relative">
        {/* Animated stars background with smooth transitions */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full animate-glow-pulse transition-all duration-1000 ease-in-out"
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
            
            {userLocation && (
              <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{userLocation}</span>
                {loading && <Loader2 className="w-3 h-3 animate-spin ml-1" />}
              </div>
            )}
          </header>

          {/* Secciones con animación de transición suave */}
          <div className="relative">
            <div className={`transition-opacity duration-700 ease-in-out ${currentSection === 'calendario' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
              {currentSection === 'calendario' && (
                <CalendarioSection
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  moonData={moonData}
                  loading={loading}
                />
              )}
            </div>

            <div className={`transition-opacity duration-700 ease-in-out ${currentSection === 'analisis' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
              {currentSection === 'analisis' && (
                <AnalisisSection
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  moonData={moonData}
                />
              )}
            </div>

            <div className={`transition-opacity duration-700 ease-in-out ${currentSection === 'eventos' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
              {currentSection === 'eventos' && (
                <EventosSection
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              )}
            </div>

            <div className={`transition-opacity duration-700 ease-in-out ${currentSection === 'perfil' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
              {currentSection === 'perfil' && (
                <PerfilSection />
              )}
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
    </>
  );
};

export default Index;