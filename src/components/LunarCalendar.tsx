import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { fetchMoonPhaseWithCache } from "@/services/nasaApi";
import type { MoonPhaseData } from "@/types/moon";

interface LunarCalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

// Cache centralizado compartido
const moonDataCache = new Map<string, MoonPhaseData>();

// Hook para obtener datos de un mes completo
function useMonthMoonData(currentMonth: Date) {
  const [monthData, setMonthData] = useState<Map<string, MoonPhaseData>>(new Map());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchMonthData() {
      setLoading(true);
      const newData = new Map<string, MoonPhaseData>();
      
      // Obtener primer y último día del mes visible
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      // También incluir días del mes anterior y siguiente que se muestran
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - 7); // 7 días antes
      
      const endDate = new Date(lastDay);
      endDate.setDate(endDate.getDate() + 7); // 7 días después

      // Fetch all dates in parallel
      const promises: Promise<void>[] = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateKey = currentDate.toDateString();
        const dateCopy = new Date(currentDate);

        // Check cache first
        if (moonDataCache.has(dateKey)) {
          newData.set(dateKey, moonDataCache.get(dateKey)!);
        } else {
          // Fetch from API
          promises.push(
            fetchMoonPhaseWithCache(dateCopy, null)
              .then((apiData) => {
                const moonPhaseData: MoonPhaseData = {
                  phase: apiData.phase,
                  phaseName: apiData.phaseName,
                  phasePercentage: apiData.illumination,
                  illumination: apiData.illumination,
                  source: 'nasa'
                };
                moonDataCache.set(dateKey, moonPhaseData);
                newData.set(dateKey, moonPhaseData);
              })
              .catch((error) => {
                console.error(`Error fetching moon data for ${dateKey}:`, error);
              })
          );
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Wait for all fetches to complete
      await Promise.all(promises);

      if (isMounted) {
        setMonthData(newData);
        setLoading(false);
      }
    }

    fetchMonthData();

    return () => {
      isMounted = false;
    };
  }, [currentMonth.getMonth(), currentMonth.getFullYear()]);

  return { monthData, loading };
}

// Componente de ícono de fase lunar - SINCRONIZADO CON LA LÓGICA 3D
function MoonPhaseIcon({ 
  date, 
  isSelected,
  moonData 
}: { 
  date: Date; 
  isSelected: boolean;
  moonData?: MoonPhaseData;
}) {
  const size = 32;
  const center = size / 2;
  const radius = size / 2 - 1.5;

  if (!moonData) {
    return (
      <div className="w-8 h-8 rounded-full bg-muted-foreground/10 animate-pulse" />
    );
  }

  const phase = moonData.phase;
  
  // MISMA LÓGICA que MoonViewer3D: angle calcula la posición de la luz
  const angle = phase * Math.PI * 2;
  const lightX = Math.sin(angle);
  
  // La iluminación se calcula desde la posición de la luz
  // lightX va de -1 (nueva) a +1 (llena) pasando por 0
  const illuminationFactor = (lightX + 1) / 2; // 0 a 1

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={`0 0 ${size} ${size}`} 
      className={cn(
        "transition-all duration-200",
        isSelected && "scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
      )}
    >
      <defs>
        <clipPath id={`moon-clip-${date.getTime()}`}>
          <circle cx={center} cy={center} r={radius} />
        </clipPath>
      </defs>
      
      <g clipPath={`url(#moon-clip-${date.getTime()})`}>
        {/* Fondo oscuro - lado no iluminado */}
        <circle cx={center} cy={center} r={radius} fill="#1a1a2e" />
        
        {/* Renderizar la fase basada en illuminationFactor */}
        {renderMoonPhase(center, radius, phase, illuminationFactor, date.getTime())}
      </g>
      
      {/* Borde exterior */}
      <circle 
        cx={center} 
        cy={center} 
        r={radius} 
        fill="none"
        stroke="#2d2d44"
        strokeWidth={0.5}
      />
    </svg>
  );
}

// Renderiza la fase lunar con la MISMA lógica que el 3D
function renderMoonPhase(
  center: number,
  radius: number,
  phase: number,
  illuminationFactor: number,
  uniqueId: number
) {
  const moonLightColor = "#e8e8e8";
  const moonDarkColor = "#1a1a2e";
  const moonGlowColor = "#a78bfa";

  // Luna Nueva (casi sin iluminación)
  if (illuminationFactor < 0.05) {
    return (
      <circle 
        cx={center} 
        cy={center} 
        r={radius * 0.2} 
        fill={moonGlowColor} 
        opacity={0.6} 
      />
    );
  }

  // Luna Llena (casi completamente iluminada)
  if (illuminationFactor > 0.95) {
    return (
      <circle 
        cx={center} 
        cy={center} 
        r={radius} 
        fill={moonLightColor} 
      />
    );
  }

  // Determinar si está creciendo o menguando
  const isWaxing = phase < 0.5;
  
  // Calcular el ancho de la parte iluminada
  // illuminationFactor va de 0 (nueva) a 1 (llena)
  // Convertir a -1 (nueva) a +1 (llena) para el cálculo
  const illuminatedWidth = (illuminationFactor - 0.5) * 2; // -1 a +1
  const absWidth = Math.abs(illuminatedWidth);

  // Fase de creciente/menguante (menos de 50% iluminado)
  if (absWidth < 0.5) {
    // Creciente delgado
    const crescentWidth = radius * absWidth * 2;
    
    // Si está creciendo, la luz viene de la derecha
    // Si está menguando, la luz viene de la izquierda
    const crescentX = isWaxing 
      ? center + radius - crescentWidth 
      : center - radius + crescentWidth;
    
    return (
      <ellipse 
        cx={crescentX} 
        cy={center} 
        rx={crescentWidth} 
        ry={radius} 
        fill={moonGlowColor} 
      />
    );
  } 
  // Fase gibosa (más de 50% iluminado)
  else {
    // Mostrar la luna casi llena con una sombra
    const shadowWidth = radius * (1 - absWidth) * 2;
    
    // La sombra está en el lado opuesto a la luz
    const shadowX = isWaxing 
      ? center - radius + shadowWidth 
      : center + radius - shadowWidth;
    
    return (
      <g>
        {/* Luna iluminada */}
        <circle 
          cx={center} 
          cy={center} 
          r={radius} 
          fill={moonLightColor} 
        />
        {/* Sombra */}
        <ellipse 
          cx={shadowX} 
          cy={center} 
          rx={shadowWidth} 
          ry={radius} 
          fill={moonDarkColor} 
        />
      </g>
    );
  }
}

export default function LunarCalendar({ onDateSelect, selectedDate }: LunarCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const { monthData, loading } = useMonthMoonData(currentMonth);

  // Obtener datos de la luna para una fecha específica
  const getMoonDataForDate = (date: Date): MoonPhaseData | undefined => {
    return monthData.get(date.toDateString());
  };

  return (
    <Card className="card-glass p-8 animate-fade-in relative">
      {loading && (
        <div className="absolute top-4 right-4">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Calendario Lunar
      </h2>
      
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateSelect(date)}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        showOutsideDays={true}
        className="p-3"
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4 w-full",
          caption: "flex justify-center pt-1 relative items-center mb-4",
          caption_label: "text-lg font-medium text-foreground",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-9 w-9 bg-transparent p-0 opacity-70 hover:opacity-100 border-primary/30 hover:border-primary"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse",
          head_row: "flex w-full justify-around mb-3",
          head_cell: "text-muted-foreground rounded-md w-20 font-medium text-sm",
          row: "flex w-full justify-around mt-2",
          cell: "relative p-1",
          day: cn(
            "h-24 w-20 p-2 font-normal flex flex-col items-center justify-center gap-2 rounded-lg transition-all duration-200",
            "hover:bg-primary/10 hover:scale-105 cursor-pointer",
            "border border-transparent hover:border-primary/30"
          ),
          day_selected: cn(
            "bg-gradient-to-br from-primary/20 to-secondary/20",
            "ring-2 ring-primary shadow-lg scale-105",
            "border-primary/50"
          ),
          day_today: "bg-accent/30 font-semibold border-accent/50",
          day_outside: "text-muted-foreground/40 opacity-50",
          day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
        }}
        components={{
          IconLeft: () => <ChevronLeft className="h-5 w-5 text-primary" />,
          IconRight: () => <ChevronRight className="h-5 w-5 text-primary" />,
          DayContent: ({ date }) => {
            const dayNumber = date.getDate();
            const isSelected = selectedDate.toDateString() === date.toDateString();
            const isToday = new Date().toDateString() === date.toDateString();
            const moonData = getMoonDataForDate(date);
            
            return (
              <div className="flex flex-col items-center gap-1">
                <span className={cn(
                  "text-sm font-medium transition-colors",
                  isSelected && "text-primary font-bold",
                  isToday && "text-accent-foreground"
                )}>
                  {dayNumber}
                </span>
                <MoonPhaseIcon 
                  date={date} 
                  isSelected={isSelected}
                  moonData={moonData}
                />
              </div>
            );
          },
        }}
      />
    </Card>
  );
}