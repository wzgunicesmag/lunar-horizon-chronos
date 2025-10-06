import { Card } from "@/components/ui/card";
import { 
  Clock, 
  Gauge, 
  Mountain, 
  Sunrise, 
  Sunset,
  Calendar as CalendarIcon 
} from "lucide-react";

interface MoonStatsProps {
  distance: number;
  angularDiameter: number;
  phase: number;
  phaseName: string;
}

export default function MoonStats({ 
  distance, 
  angularDiameter, 
  phase, 
  phaseName 
}: MoonStatsProps) {
  // Calcular próxima fase importante
  const getNextPhase = () => {
    const phases = [
      { name: 'Luna Nueva', phase: 0 },
      { name: 'Cuarto Creciente', phase: 0.25 },
      { name: 'Luna Llena', phase: 0.5 },
      { name: 'Cuarto Menguante', phase: 0.75 },
    ];

    const next = phases.find(p => p.phase > phase) || phases[0];
    const daysUntil = Math.abs(phase - next.phase) * 29.53;

    return {
      name: next.name,
      days: Math.round(daysUntil)
    };
  };

  const nextPhase = getNextPhase();

  const stats = [
    {
      icon: Gauge,
      label: 'Distancia',
      value: `${(distance / 1000).toFixed(0)} km`,
      subtitle: distance > 380000 ? 'Lejos' : 'Cerca'
    },
    {
      icon: Mountain,
      label: 'Diámetro Angular',
      value: `${(angularDiameter * 60).toFixed(2)}'`,
      subtitle: 'Arcominutos'
    },
    {
      icon: Sunrise,
      label: 'Salida de Luna',
      value: '6:23 AM',
      subtitle: 'Hora local'
    },
    {
      icon: Sunset,
      label: 'Puesta de Luna',
      value: '6:45 PM',
      subtitle: 'Hora local'
    },
    {
      icon: CalendarIcon,
      label: 'Próxima Fase',
      value: nextPhase.name,
      subtitle: `En ${nextPhase.days} días`
    },
    {
      icon: Clock,
      label: 'Duración Noche',
      value: '12h 22min',
      subtitle: 'Visible'
    }
  ];

  return (
    <Card className="card-glass p-6">
      <h3 className="text-xl font-semibold mb-4">Estadísticas Lunares</h3>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/20">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="font-semibold truncate">{stat.value}</p>
                <p className="text-xs text-muted-foreground/70">{stat.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}