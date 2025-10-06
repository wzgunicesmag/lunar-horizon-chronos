import { Card } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface MoonHorizonProps {
  date: Date;
  phase: number;
}

export default function MoonHorizon({ date, phase }: MoonHorizonProps) {
  // Calcular posiciones de la luna durante 24 horas
  const calculateMoonPath = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    // Simulación simplificada de altitud lunar
    const altitudes = hours.map(hour => {
      const angle = ((hour - 6) / 12) * Math.PI;
      return Math.max(0, Math.sin(angle) * 90);
    });

    return { hours, altitudes };
  };

  const { hours, altitudes } = calculateMoonPath();
  const currentHour = new Date().getHours();

  const data = {
    labels: hours.map(h => `${h}:00`),
    datasets: [
      {
        label: 'Altitud Lunar',
        data: altitudes,
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsla(var(--primary), 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: hours.map((h) => h === currentHour ? 8 : 2),
        pointBackgroundColor: hours.map((h) => 
          h === currentHour ? 'hsl(var(--primary))' : 'transparent'
        ),
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `Altitud: ${context.parsed.y.toFixed(1)}°`
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 90,
        ticks: {
          stepSize: 30,
          callback: (value: any) => `${value}°`
        },
        grid: {
          color: 'hsla(var(--border), 0.3)'
        }
      },
      x: {
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <Card className="card-glass p-6">
      <h3 className="text-xl font-semibold mb-4">Trayectoria Lunar</h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <p className="text-muted-foreground">Salida</p>
          <p className="font-semibold">6:23 AM</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground">Altitud Máx.</p>
          <p className="font-semibold">87.5°</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground">Puesta</p>
          <p className="font-semibold">6:45 PM</p>
        </div>
      </div>
    </Card>
  );
}