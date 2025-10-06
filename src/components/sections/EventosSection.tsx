import { Satellite } from "lucide-react";
import LunarCalendar from "@/components/LunarCalendar";
import { LunarImagery } from "@/components/LunarImagery";
import { LunarStories } from "@/components/LunarStories";

interface EventosSectionProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function EventosSection({ selectedDate, onDateSelect }: EventosSectionProps) {
  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Satellite className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Recursos NASA
          </h2>
        </div>
        
        <div className="mb-6 p-4 rounded-lg bg-muted/30 border-2 border-primary">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Explorando el cosmos.</span> La NASA proporciona imágenes en tiempo real 
            y contenido educativo sobre nuestro satélite natural.
          </p>
        </div>

        <div className="mb-6">
          <LunarCalendar
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <LunarImagery date={selectedDate} />
          <LunarStories />
        </div>
      </div>
    </div>
  );
}