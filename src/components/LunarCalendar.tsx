import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface LunarCalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

// Calculate moon phase for any date
function getMoonPhase(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let jd = 367 * year - Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4) +
    Math.floor(275 * month / 9) + day + 1721013.5;

  const daysSinceNew = jd - 2451549.5;
  const newMoons = daysSinceNew / 29.53;
  let phase = newMoons - Math.floor(newMoons);
  
  if (phase < 0) phase += 1;
  return phase;
}

// Component to render moon phase icon
function MoonPhaseIcon({ phase }: { phase: number }) {
  const size = 32;
  const center = size / 2;
  const radius = size / 2 - 2;

  // Calculate illumination
  const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2;
  
  // Determine which side is illuminated (right for waxing, left for waning)
  const isWaxing = phase < 0.5;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Moon circle */}
      <circle cx={center} cy={center} r={radius} fill="hsl(var(--muted))" />
      
      {/* Illuminated portion */}
      {phase > 0.03 && phase < 0.97 && (
        <ellipse
          cx={center}
          cy={center}
          rx={radius * Math.abs(Math.cos(phase * Math.PI))}
          ry={radius}
          fill={isWaxing ? "hsl(var(--primary))" : "hsl(var(--muted))"}
          transform={isWaxing ? "" : `translate(${size}, 0) scale(-1, 1)`}
        />
      )}
      
      {/* Full moon */}
      {phase >= 0.47 && phase <= 0.53 && (
        <circle cx={center} cy={center} r={radius} fill="hsl(var(--primary))" />
      )}
      
      {/* New moon */}
      {(phase < 0.03 || phase > 0.97) && (
        <circle cx={center} cy={center} r={radius} fill="hsl(var(--muted))" />
      )}
    </svg>
  );
}

export default function LunarCalendar({ onDateSelect, selectedDate }: LunarCalendarProps) {
  return (
    <Card className="card-glass p-8 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Calendario Lunar
      </h2>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateSelect(date)}
        showOutsideDays={true}
        className={cn("p-3 pointer-events-auto")}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4 w-full",
          caption: "flex justify-center pt-1 relative items-center mb-4",
          caption_label: "text-lg font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100",
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse",
          head_row: "flex w-full justify-around mb-2",
          head_cell: "text-muted-foreground rounded-md w-16 font-medium text-sm",
          row: "flex w-full justify-around mt-1",
          cell: "relative p-1",
          day: cn(
            "h-20 w-16 p-1 font-normal flex flex-col items-center justify-center gap-1 rounded-md hover:bg-accent transition-colors cursor-pointer",
            "aria-selected:bg-primary/20 aria-selected:ring-2 aria-selected:ring-primary"
          ),
          day_selected: "bg-primary/20 ring-2 ring-primary text-primary-foreground",
          day_today: "bg-accent/50 font-semibold",
          day_outside: "text-muted-foreground/40 opacity-50",
          day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
        }}
        components={{
          IconLeft: () => <ChevronLeft className="h-5 w-5" />,
          IconRight: () => <ChevronRight className="h-5 w-5" />,
          DayContent: ({ date }) => {
            const phase = getMoonPhase(date);
            const dayNumber = date.getDate();
            
            return (
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-medium">{dayNumber}</span>
                <MoonPhaseIcon phase={phase} />
              </div>
            );
          },
        }}
      />
    </Card>
  );
}
