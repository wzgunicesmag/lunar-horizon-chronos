import { User } from "lucide-react";

export function PerfilSection() {
  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Perfil de Usuario
          </h2>
        </div>
        
        <div className="card-glass p-8 rounded-2xl">
          <p className="text-muted-foreground">Sección en desarrollo...</p>
        </div>
      </div>
    </div>
  );
}