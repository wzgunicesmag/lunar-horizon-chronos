import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import logoBPng from '@/images/logo_nasa.png';
import logoWPng from '@/images/logo_w.png';

interface WelcomeScreenProps {
  onSkip: () => void;
}

export function WelcomeScreen({ onSkip }: WelcomeScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Hacer fade-in del contenido después de 1 segundo
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    setIsExiting(true);
    // Esperar a que termine la animación antes de llamar onSkip
    setTimeout(() => {
      onSkip();
    }, 800); // Duración del fade-out
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-800 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, hsl(222, 80%, 10%) 0%, hsl(216, 77%, 8%) 100%)',
      }}
    >
      {/* Contenido con fade-in después de 1 segundo */}
      <div
        className={`w-full h-full flex flex-col items-center justify-center transition-opacity duration-1000 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Contenido Principal */}
        <div className="max-w-4xl w-full px-6 space-y-8">
          {/* Logos */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <img
              src={logoBPng}
              alt="MUNA Logo Blue"
              className="h-20 md:h-24 object-contain"
            />
            <img
              src={logoWPng}
              alt="MUNA Logo White"
              className="h-20 md:h-24 object-contain"
            />
          </div>

          {/* Título de Bienvenida */}
          <div className="text-center space-y-3">

          </div>

          {/* Video de YouTube */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/TU_ID_DE_VIDEO?autoplay=1&mute=1&rel=0&modestbranding=1"
              title="MUNA - Presentación"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Botón Saltar - Debajo del reproductor a la derecha */}
          <div className="flex justify-end">
            <button
              onClick={handleSkip}
              className="flex items-center gap-3 px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg text-xl"
              style={{
                backgroundColor: 'hsl(208, 91%, 57%)',
                color: 'hsl(0, 0%, 0%)',
              }}
            >
              <span>SALTAR INTRODUCCIÓN</span>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mensaje adicional */}
          <div className="text-center">
          </div>
        </div>
      </div>

      {/* Patrón de fondo decorativo */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'url(/src/images/Patterns/Rosette3b.png)',
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}