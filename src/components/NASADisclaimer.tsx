import { Info } from "lucide-react";

export function NASADisclaimer() {
  return (
    <div className="max-w-7xl mx-auto mt-8 mb-4">
      <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-2">
            <p>
              <strong>Aviso Legal:</strong> NASA no respalda ninguna entidad no gubernamental de EE.UU. 
              y no es responsable de la información contenida en sitios web no gubernamentales.
            </p>
            <p>
              Este proyecto utiliza datos abiertos de NASA con fines educativos y de investigación. 
              Todos los datos e imágenes son propiedad de NASA y se utilizan bajo sus políticas de uso abierto.
            </p>
            <p className="flex flex-wrap gap-2 mt-2">
              <a
                href="https://www.nasa.gov/about/highlights/HP_Privacy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Política de Privacidad NASA
              </a>
              <span>•</span>
              <a
                href="https://api.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                NASA Open APIs
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}