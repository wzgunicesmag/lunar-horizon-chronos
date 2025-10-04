import { Card } from "@/components/ui/card";
import { Scissors, Sprout, Heart, Brain, Dumbbell } from "lucide-react";

interface LunarInfoProps {
  phaseName: string;
  phasePercentage: number;
}

const getLunarAdvice = (phaseName: string) => {
  const adviceMap: Record<string, { icon: any; title: string; description: string }[]> = {
    "Luna Nueva": [
      { icon: Scissors, title: "Corte de Cabello", description: "Ideal para cortar el cabello y promover crecimiento rápido" },
      { icon: Sprout, title: "Siembra", description: "Excelente momento para plantar semillas de crecimiento rápido" },
      { icon: Brain, title: "Nuevos Proyectos", description: "Perfecto para iniciar nuevos proyectos y establecer intenciones" },
      { icon: Heart, title: "Autocuidado", description: "Momento de introspección y autocuidado personal" },
      { icon: Dumbbell, title: "Iniciar Rutinas", description: "Buen período para comenzar nuevas rutinas de ejercicio" },
    ],
    "Cuarto Creciente": [
      { icon: Scissors, title: "Corte de Cabello", description: "Buen momento para fortalecer el cabello" },
      { icon: Sprout, title: "Siembra", description: "Plantar vegetales de hoja para mejor desarrollo" },
      { icon: Brain, title: "Tomar Acción", description: "Tiempo de actuar sobre los planes iniciados" },
      { icon: Heart, title: "Relaciones", description: "Fortalecer vínculos y conexiones sociales" },
      { icon: Dumbbell, title: "Aumentar Intensidad", description: "Incrementar la intensidad del ejercicio" },
    ],
    "Luna Llena": [
      { icon: Scissors, title: "Corte de Cabello", description: "Evitar cortes, el cabello está en su máxima fortaleza" },
      { icon: Sprout, title: "Cosecha", description: "Momento ideal para cosechar frutos y plantas medicinales" },
      { icon: Brain, title: "Culminación", description: "Completar proyectos y celebrar logros" },
      { icon: Heart, title: "Energía Plena", description: "Momento de alta energía y vitalidad" },
      { icon: Dumbbell, title: "Ejercicio Moderado", description: "Cuidado con lesiones, moderar la intensidad" },
    ],
    "Cuarto Menguante": [
      { icon: Scissors, title: "Corte de Cabello", description: "Momento óptimo para cortar y ralentizar el crecimiento" },
      { icon: Sprout, title: "Poda", description: "Ideal para podar plantas y eliminar plagas" },
      { icon: Brain, title: "Reflexión", description: "Tiempo para reflexionar y soltar lo que no sirve" },
      { icon: Heart, title: "Descanso", description: "Priorizar el descanso y la recuperación" },
      { icon: Dumbbell, title: "Recuperación", description: "Enfocarse en recuperación y flexibilidad" },
    ],
  };

  return adviceMap[phaseName] || adviceMap["Luna Nueva"];
};

export default function LunarInfo({ phaseName, phasePercentage }: LunarInfoProps) {
  const advice = getLunarAdvice(phaseName);

  return (
    <Card className="card-glass p-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {phaseName}
        </h2>
        <p className="text-muted-foreground">
          Iluminación: {phasePercentage.toFixed(1)}%
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground/90">
          Recomendaciones según la fase lunar:
        </h3>
        {advice.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/20 moon-glow">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
