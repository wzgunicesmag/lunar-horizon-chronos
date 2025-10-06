import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface LunarCalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

// Calculate moon phase for any date (same as useMoonPhase.ts)
function getMoonPhase(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Julian date calculation
  let jd = 367 * year - Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4) +
    Math.floor(275 * month / 9) + day + 1721013.5;

  // Days since known new moon (January 6, 2000)
  const daysSinceNew = jd - 2451549.5;
  
  // Moon phase (synodic month ≈ 29.53 days)
  const newMoons = daysSinceNew / 29.53;
  let phase = newMoons - Math.floor(newMoons);
  
  if (phase < 0) phase += 1;
  
  // 0 = luna nueva, 0.5 = luna llena (igual que useMoonPhase)
  return phase;
}

// Component to render moon phase icon (matches API calculation)
function MoonPhaseIcon({ phase, isMobile = false }: { phase: number; isMobile?: boolean }) {
  const size = isMobile ? 32 : 52;
  const center = size / 2;
  const radius = size / 2 - 2;

  // New moon - completely dark
  if (phase < 0.03 || phase > 0.97) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
        <circle cx={center} cy={center} r={radius} fill="hsl(var(--muted))" />
      </svg>
    );
  }
  
  // Full moon - completely illuminated
  if (phase >= 0.47 && phase <= 0.53) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
        <circle cx={center} cy={center} r={radius} fill="hsl(var(--primary))" />
      </svg>
    );
  }

  // Calculate the shape of the illuminated portion
  const isWaxing = phase < 0.5;
  const angle = phase * Math.PI * 2;
  const terminatorRadius = Math.abs(Math.cos(angle)) * radius;
  
  let path: string;
  
  if (isWaxing) {
    if (phase < 0.25) {
      path = `
        M ${center},${center - radius}
        A ${terminatorRadius},${radius} 0 0,0 ${center},${center + radius}
        A ${radius},${radius} 0 0,0 ${center},${center - radius}
      `;
    } else {
      path = `
        M ${center},${center - radius}
        A ${terminatorRadius},${radius} 0 0,1 ${center},${center + radius}
        A ${radius},${radius} 0 0,0 ${center},${center - radius}
      `;
    }
  } else {
    if (phase < 0.75) {
      path = `
        M ${center},${center - radius}
        A ${radius},${radius} 0 0,1 ${center},${center + radius}
        A ${terminatorRadius},${radius} 0 0,1 ${center},${center - radius}
      `;
    } else {
      path = `
        M ${center},${center - radius}
        A ${radius},${radius} 0 0,1 ${center},${center + radius}
        A ${terminatorRadius},${radius} 0 0,0 ${center},${center - radius}
      `;
    }
  }
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      <circle cx={center} cy={center} r={radius} fill="hsl(var(--muted))" />
      <path d={path} fill="hsl(var(--primary))" />
    </svg>
  );
}

export default function LunarCalendar({ onDateSelect, selectedDate }: LunarCalendarProps) {
  return (
    <Card className="card-glass p-4 md:p-8 animate-fade-in w-full overflow-x-auto">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Calendario Lunar
      </h2>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateSelect(date)}
        showOutsideDays={true}
        className={cn("p-0 md:p-3 pointer-events-auto w-full")}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
          month: "space-y-4 w-full",
          caption: "flex justify-center pt-1 relative items-center mb-2 md:mb-4",
          caption_label: "text-base md:text-lg font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 md:h-9 md:w-9 bg-transparent p-0 opacity-50 hover:opacity-100",
          ),
          nav_button_previous: "absolute left-0 md:left-1",
          nav_button_next: "absolute right-0 md:right-1",
          table: "w-full border-collapse",
          head_row: "flex w-full justify-between md:justify-around mb-2",
          head_cell: "text-muted-foreground rounded-md flex-1 min-w-0 md:w-24 font-medium text-xs md:text-sm text-center px-0.5",
          row: "flex w-full justify-between md:justify-around mt-1",
          cell: "relative p-0.5 md:p-1 flex-1 min-w-0",
          day: cn(
            "h-16 md:h-28 w-full p-1 md:p-2 font-normal flex flex-col items-center justify-center gap-1 md:gap-2 rounded-md hover:bg-accent transition-colors cursor-pointer",
            "aria-selected:bg-primary/20 aria-selected:ring-1 md:aria-selected:ring-2 aria-selected:ring-primary"
          ),
          day_selected: "bg-primary/20 ring-1 md:ring-2 ring-primary text-primary-foreground",
          day_today: "bg-accent/50 font-semibold",
          day_outside: "text-muted-foreground/40 opacity-50",
          day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
        }}
        components={{
          IconLeft: () => <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />,
          IconRight: () => <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />,
          DayContent: ({ date }) => {
            const phase = getMoonPhase(date);
            const dayNumber = date.getDate();
            
            // Detectar si es móvil basado en el ancho de la ventana
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            
            return (
              <div className="flex flex-col items-center gap-0.5 md:gap-2 w-full">
                <span className="text-xs md:text-sm font-medium">{dayNumber}</span>
                <MoonPhaseIcon phase={phase} isMobile={isMobile} />
              </div>
            );
          },
        }}
      />
    </Card>
  );
}
