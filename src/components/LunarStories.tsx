import { Card } from "@/components/ui/card";
import { ExternalLink, Moon, Telescope, Zap } from "lucide-react";

interface Story {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
  category: string;
}

const lunarStories: Story[] = [
  {
    title: "Exploración Lunar Artemis",
    description: "Descubre el programa Artemis de NASA que llevará humanos de vuelta a la Luna",
    link: "https://www.nasa.gov/specials/artemis/",
    icon: <Moon className="w-5 h-5" />,
    category: "Misiones"
  },
  {
    title: "Observatorio Lunar",
    description: "Cómo la Luna ayuda a los científicos a estudiar el sistema Tierra-Luna",
    link: "https://moon.nasa.gov/",
    icon: <Telescope className="w-5 h-5" />,
    category: "Ciencia"
  },
  {
    title: "Fases Lunares y su Ciencia",
    description: "Entiende la ciencia detrás de las fases lunares y su impacto en la Tierra",
    link: "https://science.nasa.gov/moon/",
    icon: <Zap className="w-5 h-5" />,
    category: "Educación"
  },
  {
    title: "NASA Earth Observatory",
    description: "Historias sobre cómo observamos la Luna desde la Tierra",
    link: "https://earthobservatory.nasa.gov/topic/astronomy",
    icon: <Moon className="w-5 h-5" />,
    category: "Observación"
  }
];

export function LunarStories() {
  return (
    <Card className="card-glass p-6">
      <h3 className="text-xl font-semibold mb-4">Recursos Educativos NASA</h3>
      <div className="space-y-3">
        {lunarStories.map((story, index) => (
          <a
            key={index}
            href={story.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all hover:scale-[1.02] group"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/20 text-primary group-hover:bg-primary/30 transition-colors">
                {story.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium group-hover:text-primary transition-colors">
                    {story.title}
                  </h4>
                  <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {story.description}
                </p>
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                  {story.category}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground text-center">
          Contenido educativo proporcionado por{" "}
          <a
            href="https://www.nasa.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            NASA
          </a>
        </p>
      </div>
    </Card>
  );
}