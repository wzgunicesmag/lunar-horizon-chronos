import { Moon } from "lucide-react";
import LunarCalendar from "@/components/LunarCalendar";
import MoonHorizon from "@/components/MoonHorizon";
import MoonStats from "@/components/MoonStats";
import MoonInfluences from "@/components/MoonInfluences";
import type { MoonPhaseData } from "@/types/moon";

interface AnalisisSectionProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  moonData: MoonPhaseData;
}

export function AnalisisSection({ 
  selectedDate, 
  onDateSelect, 
  moonData 
}: AnalisisSectionProps) {
  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Moon className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Análisis Lunar Detallado
          </h2>
        </div>
        
        <div className="mb-6 p-4 rounded-lg bg-muted/30 border-2 border-primary">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">¿Por qué es importante?</span> Este análisis combina datos astronómicos precisos con observaciones tradicionales 
            sobre la influencia lunar. La trayectoria de la luna afecta las mareas, ciclos biológicos y actividades agrícolas.
          </p>
        </div>

        <div className="mb-6">
          <LunarCalendar
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
          />
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
    </div>
  );
}