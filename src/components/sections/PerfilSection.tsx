import { User, Mail, MapPin, Calendar, Moon, Github, Globe, Trophy, Rocket, Sparkles } from "lucide-react";

export function PerfilSection() {
  // Datos simulados del usuario
  const userData = {
    name: "Usuario 1",
    email: "Usuario1@muna.space",
    location: "Lima, Perú",
    memberSince: "Octubre 2024",
    lunarSign: "Luna Creciente",
    favoritePhase: "Luna Llena",
    totalViews: 127,
    savedDates: 23,
  };

  // Datos del equipo
  const teamMembers = [
    {
      name: "WILMER ZAMBRANO GUERRERO",
      email: "wilzamguerrero@udenar.edu.co",
      website: "https://wilzamguerrero.vercel.app/",
      github: "https://github.com/wilzamguerrero",
    },
    {
      name: "NICOLAS ALBERTO TORRES BUSTILLO",
      email: "Natorresb@unadvirtual.edu.co",
      website: "https://github.com/nicolas0798t/pruba",
      github: "https://github.com/nicolas0798t",
    },
    {
      name: "OCTAVIO ECHEVERRY GIL",
      email: "octavio153@hotmail.com",
      website: "octavio153@hotmail.com",
      github: "octavio153@hotmail.com",
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto mb-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <User className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Perfil de Usuario
          </h2>
        </div>

        {/* Perfil del Usuario */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Tarjeta principal del usuario */}
          <div className="md:col-span-1">
            <div className="card-glass p-8 rounded-2xl h-full">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{userData.name}</h3>
                  <p className="text-sm text-muted-foreground">{userData.lunarSign}</p>
                </div>
                <div className="w-full pt-4 border-t border-border/50 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground truncate">{userData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">{userData.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Desde {userData.memberSince}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="md:col-span-2">
            <div className="card-glass p-8 rounded-2xl h-full">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Moon className="w-5 h-5 text-primary" />
                Actividad Lunar
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-primary">{userData.totalViews}</p>
                  <p className="text-sm text-muted-foreground">Días explorados</p>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-secondary">{userData.savedDates}</p>
                  <p className="text-sm text-muted-foreground">Fechas guardadas</p>
                </div>
                <div className="space-y-2 col-span-2">
                  <p className="text-sm font-semibold text-foreground">Fase Lunar Favorita</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Moon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{userData.favoritePhase}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preferencias */}
        <div className="card-glass p-8 rounded-2xl">
          <h3 className="text-lg font-semibold mb-6">Preferencias de Notificación</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Fases Lunares</p>
                    <p className="text-xs text-muted-foreground">Notificar cambios de fase</p>
                  </div>
                </div>
                <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Recordatorios</p>
                    <p className="text-xs text-muted-foreground">Fechas importantes</p>
                  </div>
                </div>
                <div className="w-10 h-6 bg-muted rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Rocket className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Eventos NASA</p>
                    <p className="text-xs text-muted-foreground">Noticias espaciales</p>
                  </div>
                </div>
                <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Newsletter</p>
                    <p className="text-xs text-muted-foreground">Boletín mensual</p>
                  </div>
                </div>
                <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección del Equipo */}
        <div className="card-glass p-8 rounded-2xl border-2 border-primary">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary animate-glow-pulse" />
              <h3 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                MUNA
              </h3>
              <Sparkles className="w-6 h-6 text-primary animate-glow-pulse" />
            </div>
            <p className="text-lg text-muted-foreground italic mb-4">
              "El cosmos en nuestras raíces"
            </p>
            
            {/* Descripción del Proyecto */}
            <div className="max-w-3xl mx-auto mb-6 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary">
              <p className="text-sm text-muted-foreground leading-relaxed">
                [AQUÍ VA LA DESCRIPCIÓN DEL PROYECTO - Reemplaza este texto con la descripción completa de MUNA y su propósito en la hackathon 2025]
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-muted-foreground">
                NASA Space Apps Challenge 2025
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 p-6 hover:from-primary/10 hover:to-secondary/10 transition-all duration-300 border border-border/50 hover:border-primary/50"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>
                
                <div className="relative space-y-4">
                  {/* Avatar y nombre centrados */}
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{member.name}</h4>
                    </div>
                  </div>

                  {/* Email centrado */}
                  <div className="flex justify-center">
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors group/link"
                    >
                      <Mail className="w-3 h-3 group-hover/link:scale-110 transition-transform flex-shrink-0" />
                      <span className="truncate max-w-[200px]">{member.email}</span>
                    </a>
                  </div>

                  {/* Iconos sociales centrados */}
                  <div className="flex gap-3 justify-center pt-2">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-muted/50 hover:bg-primary/20 transition-all group/icon shadow-sm"
                      title="GitHub"
                    >
                      <Github className="w-4 h-4 text-muted-foreground group-hover/icon:text-primary group-hover/icon:scale-110 transition-all" />
                    </a>
                    <a
                      href={member.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-muted/50 hover:bg-primary/20 transition-all group/icon shadow-sm"
                      title="Sitio Web"
                    >
                      <Globe className="w-4 h-4 text-muted-foreground group-hover/icon:text-primary group-hover/icon:scale-110 transition-all" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Proyecto desarrollado para el{" "}
              <a
                href="https://www.spaceappschallenge.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                NASA Space Apps Challenge 2025
              </a>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Conectando la astronomía moderna con la sabiduría ancestral
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}