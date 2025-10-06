import { Suspense } from "react";
import { Moon, Calendar as CalendarIcon } from "lucide-react";
import MoonViewer3D from "@/components/MoonViewer3D";
import LunarCalendar from "@/components/LunarCalendar";
import LunarInfo from "@/components/LunarInfo";
import type { MoonPhaseData } from "@/types/moon";

interface CalendarioSectionProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  moonData: MoonPhaseData;
  loading: boolean;
}

export function CalendarioSection({ 
  selectedDate, 
  onDateSelect, 
  moonData, 
  loading 
}: CalendarioSectionProps) {
  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-6">
          <CalendarIcon className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Visualización Lunar
          </h2>
        </div>
        
        <div className="mb-6 p-4 rounded-lg bg-muted/30 border-2 border-primary">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Tu guía lunar completa.</span> Explora el calendario lunar interactivo para visualizar 
            las fases de la luna en cualquier fecha. El modelo 3D te permite observar la iluminación lunar en tiempo real, mientras que las 
            recomendaciones tradicionales te ayudan a planificar actividades según el ciclo lunar.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LunarCalendar
              selectedDate={selectedDate}
              onDateSelect={onDateSelect}
            />
          </div>

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
    </div>
  );
}