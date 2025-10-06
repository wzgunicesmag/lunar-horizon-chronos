import { Card } from "@/components/ui/card";
import { 
  Waves, 
  Wind, 
  Droplets,
  Activity,
  Moon,
  Zap
} from "lucide-react";

interface MoonInfluencesProps {
  phase: number;
  phaseName: string;
}

export default function MoonInfluences({ phase, phaseName }: MoonInfluencesProps) {
  const getInfluences = () => {
    const influences = {
      "Luna Nueva": [
        { icon: Waves, title: "Mareas", level: "Bajas", color: "text-blue-500" },
        { icon: Wind, title: "Energía", level: "Inicio", color: "text-green-500" },
        { icon: Droplets, title: "Humedad", level: "Media", color: "text-cyan-500" },
        { icon: Activity, title: "Actividad", level: "Introspección", color: "text-purple-500" },
      ],
      "Luna Llena": [
        { icon: Waves, title: "Mareas", level: "Altas", color: "text-blue-500" },
        { icon: Zap, title: "Energía", level: "Máxima", color: "text-yellow-500" },
        { icon: Droplets, title: "Humedad", level: "Alta", color: "text-cyan-500" },
        { icon: Moon, title: "Iluminación", level: "100%", color: "text-orange-500" },
      ],
      "Cuarto Creciente": [
        { icon: Waves, title: "Mareas", level: "Moderadas", color: "text-blue-500" },
        { icon: Wind, title: "Energía", level: "Creciente", color: "text-green-500" },
        { icon: Activity, title: "Actividad", level: "Acción", color: "text-purple-500" },
      ],
      "Cuarto Menguante": [
        { icon: Waves, title: "Mareas", level: "Moderadas", color: "text-blue-500" },
        { icon: Wind, title: "Energía", level: "Decreciente", color: "text-orange-500" },
        { icon: Activity, title: "Actividad", level: "Reflexión", color: "text-purple-500" },
      ],
    };

    return influences[phaseName as keyof typeof influences] || influences["Luna Nueva"];
  };

  const influences = getInfluences();

  return (
    <Card className="card-glass p-6">
      <h3 className="text-xl font-semibold mb-4">Influencias Lunares</h3>
      <div className="space-y-3">
        {influences.map((influence, index) => {
          const Icon = influence.icon;
          return (
            <div 
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
            >
              <Icon className={`w-5 h-5 ${influence.color}`} />
              <div className="flex-1">
                <p className="font-medium">{influence.title}</p>
                <p className="text-sm text-muted-foreground">{influence.level}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}