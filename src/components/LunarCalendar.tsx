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
function MoonPhaseIcon({ phase }: { phase: number }) {
  const size = 52;
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
  // The terminator (day/night line) is an ellipse that varies with phase
  // Using the same formula as the 3D viewer and API
  
  const isWaxing = phase < 0.5;
  
  // Calculate the x-radius of the terminator ellipse
  // This creates the crescent/gibbous shape
  // cos(0) = 1 (new moon, terminator at right edge)
  // cos(π/2) = 0 (quarter moon, terminator at center)
  // cos(π) = -1 (full moon, terminator at left edge)
  const angle = phase * Math.PI * 2;
  const terminatorRadius = Math.abs(Math.cos(angle)) * radius;
  
  let path: string;
  
  if (isWaxing) {
    // Waxing: 0 to 0.5 - light from RIGHT side
    // The lit portion grows from a thin crescent to full
    if (phase < 0.25) {
      // Waxing crescent: thin crescent on the right
      path = `
        M ${center},${center - radius}
        A ${terminatorRadius},${radius} 0 0,0 ${center},${center + radius}
        A ${radius},${radius} 0 0,0 ${center},${center - radius}
      `;
    } else {
      // Waxing gibbous: more than half lit on the right
      path = `
        M ${center},${center - radius}
        A ${terminatorRadius},${radius} 0 0,1 ${center},${center + radius}
        A ${radius},${radius} 0 0,0 ${center},${center - radius}
      `;
    }
  } else {
    // Waning: 0.5 to 1 - light from LEFT side
    // The lit portion shrinks from full to a thin crescent
    if (phase < 0.75) {
      // Waning gibbous: more than half lit on the left
      path = `
        M ${center},${center - radius}
        A ${radius},${radius} 0 0,1 ${center},${center + radius}
        A ${terminatorRadius},${radius} 0 0,1 ${center},${center - radius}
      `;
    } else {
      // Waning crescent: thin crescent on the left
      path = `
        M ${center},${center - radius}
        A ${radius},${radius} 0 0,1 ${center},${center + radius}
        A ${terminatorRadius},${radius} 0 0,0 ${center},${center - radius}
      `;
    }
  }
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Dark side of moon (base) */}
      <circle cx={center} cy={center} r={radius} fill="hsl(var(--muted))" />
      
      {/* Illuminated portion */}
      <path d={path} fill="hsl(var(--primary))" />
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
          head_cell: "text-muted-foreground rounded-md w-24 font-medium text-sm",
          row: "flex w-full justify-around mt-1",
          cell: "relative p-1",
          day: cn(
            "h-28 w-24 p-2 font-normal flex flex-col items-center justify-center gap-2 rounded-md hover:bg-accent transition-colors cursor-pointer",
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
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium">{dayNumber}</span>
                <MoonPhaseIcon phase={phase} />
              </div>
            );
          },
        }}
      />
    </Card>
  );
}
