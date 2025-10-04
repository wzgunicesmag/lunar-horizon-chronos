import { useState, Suspense } from "react";
import { Moon } from "lucide-react";
import MoonViewer3D from "@/components/MoonViewer3D";
import LunarCalendar from "@/components/LunarCalendar";
import LunarInfo from "@/components/LunarInfo";
import { useMoonPhase } from "@/hooks/useMoonPhase";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const moonData = useMoonPhase(selectedDate);

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
          <div className="flex items-center justify-center gap-3 mb-4">
            <Moon className="w-10 h-10 text-primary moon-glow animate-float" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Fases Lunares
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Explora el ciclo lunar y sus influencias
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - 3D Moon */}
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

            {/* Calendar */}
            <LunarCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>

          {/* Right Column - Lunar Info */}
          <div>
            <LunarInfo
              phaseName={moonData.phaseName}
              phasePercentage={moonData.phasePercentage}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-muted-foreground text-sm animate-fade-in">
          <p>Datos calculados astronómicamente • Sincronizado con el ciclo lunar</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
