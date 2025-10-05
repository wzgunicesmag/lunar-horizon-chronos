import { useState } from 'react';
import { Home, Calendar, Image, BookOpen } from 'lucide-react';
import symbolMuna from '@/images/symbol_muna.png';
import { cn } from '@/lib/utils';

interface NavButton {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  // 🎨 CONFIGURACIÓN INDIVIDUAL DEL TEXTO
  textConfig?: {
    rotation?: number;      // Rotación del texto en grados
    offsetX?: number;       // Desplazamiento horizontal del centro del texto
    offsetY?: number;       // Desplazamiento vertical del centro del texto
    distance?: number;      // Distancia desde el botón hasta el texto
    fontSize?: string;      // Tamaño de fuente individual
  };
}

// 🎛️ CONFIGURACIÓN DEL MENÚ RADIAL
const CONFIG = {
  // 🔧 ESCALA GLOBAL - Controla el tamaño de TODO el menú
  globalScale: 1.2,
  
  distanceFromCenter: 90,
  buttonSpacing: 1,
  buttonSize: 40,
  iconSize: 78,

  // ⚙️ ANIMACIONES DEL BOTÓN PRINCIPAL
  animations: {
    pressScale: 0.85,
    pressDuration: 150,
    hoverScale: 1.1,
    rotationOnOpen: 45,
  },

  // 📝 CONFIGURACIÓN DE TEXTOS
  text: {
    defaultDistance: 50,        // Distancia por defecto desde el botón hasta el texto
    fontSize: '14px',           // Tamaño de fuente por defecto
    fontWeight: '600',          // Peso de fuente
    animationDelay: 300,        // Delay adicional después de que aparezcan los botones (ms)
    animationDuration: 400,     // Duración de la animación del texto (ms)
    closeAnimationDelay: 0,     // Delay al cerrar (los textos se meten primero)
  },
};

export function RadialNavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const navButtons: NavButton[] = [
    {
      icon: <Home className={`w-[${CONFIG.iconSize}px] h-[${CONFIG.iconSize}px]`} />,
      label: 'INICIO',
      onClick: () => {
        console.log('Navegar a Inicio');
      },
      textConfig: {
        rotation: -0,
        offsetX: 0,
        offsetY: -0,
        distance: 50,
        fontSize: '24px',
      },
    },
    {
      icon: <Calendar className={`w-[${CONFIG.iconSize}px] h-[${CONFIG.iconSize}px]`} />,
      label: 'CALENDARIO',
      onClick: () => {
        console.log('Navegar a Calendario');
      },
      textConfig: {
        rotation: 20,
        offsetX: 0,
        offsetY: -8,
        distance: 50,
        fontSize: '24px',
      },
    },
    {
      icon: <Image className={`w-[${CONFIG.iconSize}px] h-[${CONFIG.iconSize}px]`} />,
      label: 'IMAGENES',
      onClick: () => {
        console.log('Navegar a Imágenes');
      },
      textConfig: {
        rotation: 40,
        offsetX: -0,
        offsetY: -20,
        distance: 50,
        fontSize: '24px',
      },
    },
    {
      icon: <BookOpen className={`w-[${CONFIG.iconSize}px] h-[${CONFIG.iconSize}px]`} />,
      label: 'RECURSOS',
      onClick: () => {
        console.log('Navegar a Recursos');
      },
      textConfig: {
        rotation: 70,
        offsetX: 15,
        offsetY: -35,
        distance: 50,
        fontSize: '24px',
      },
    },
  ];

  const handleMainButtonPress = () => {
    setIsPressed(true);
  };

  const handleMainButtonRelease = () => {
    setIsPressed(false);
    setIsOpen(!isOpen);
  };

  // Calcular posición de cada botón dentro de 90° (cuarto de círculo)
  const getButtonPosition = (index: number, total: number) => {
    const radius = CONFIG.distanceFromCenter;
    
    const minAngle = 0;
    const maxAngle = 90;
    
    const usableRange = (maxAngle - minAngle) * CONFIG.buttonSpacing;
    const startOffset = (maxAngle - minAngle - usableRange) / 2;
    
    const angleStep = total > 1 ? usableRange / (total - 1) : 0;
    const angle = (minAngle + startOffset + (index * angleStep)) * (Math.PI / 180);
    
    const x = -Math.cos(angle) * radius;
    const y = -Math.sin(angle) * radius;
    
    return { x, y };
  };

  // 📝 Calcular posición del texto
  const getTextPosition = (buttonX: number, buttonY: number, textConfig?: NavButton['textConfig']) => {
    const distance = textConfig?.distance ?? CONFIG.text.defaultDistance;
    const offsetX = textConfig?.offsetX ?? 0;
    const offsetY = textConfig?.offsetY ?? 0;
    
    // Calcular ángulo del botón respecto al centro
    const buttonAngle = Math.atan2(-buttonY, -buttonX);
    
    // Posicionar el texto en la misma dirección que el botón, pero más alejado
    const textX = buttonX + (-Math.cos(buttonAngle) * distance) + offsetX;
    const textY = buttonY + (-Math.sin(buttonAngle) * distance) + offsetY;
    
    return { x: textX, y: textY };
  };

  const getMainButtonTransform = () => {
    const rotation = isOpen ? CONFIG.animations.rotationOnOpen : 0;
    const scale = isPressed ? CONFIG.animations.pressScale : 1;
    return `rotate(${rotation}deg) scale(${scale})`;
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* 🎯 CONTENEDOR CON ESCALA GLOBAL */}
      <div 
        className="relative transition-transform duration-300"
        style={{
          transform: `scale(${CONFIG.globalScale})`,
          transformOrigin: 'bottom right',
        }}
      >
        {/* Botones secundarios con etiquetas */}
        {navButtons.map((button, index) => {
          const { x, y } = getButtonPosition(index, navButtons.length);
          const textPos = getTextPosition(x, y, button.textConfig);
          const textRotation = button.textConfig?.rotation ?? 0;
          const textFontSize = button.textConfig?.fontSize ?? CONFIG.text.fontSize;
          
          // 🎬 Calcular delays de animación
          const totalButtons = navButtons.length;
          const reverseIndex = totalButtons - 1 - index;
          
          // Al ABRIR: Los botones aparecen primero, luego los textos
          const buttonOpenDelay = index * 50;
          const textOpenDelay = buttonOpenDelay + CONFIG.text.animationDelay;
          
          // Al CERRAR: Los textos se meten primero (inverso), luego los botones
          const textCloseDelay = reverseIndex * 50 + CONFIG.text.closeAnimationDelay;
          const buttonCloseDelay = textCloseDelay + 200; // Los botones esperan a que los textos se metan
          
          return (
            <div key={index}>
              {/* Botón */}
              <button
                onClick={button.onClick}
                className={cn(
                  "absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground",
                  "flex items-center justify-center shadow-lg",
                  "transition-all duration-500 ease-out",
                  "hover:scale-110 hover:bg-primary/90",
                  "opacity-0 pointer-events-none",
                  isOpen && "opacity-100 pointer-events-auto"
                )}
                style={{
                  width: `${CONFIG.buttonSize}px`,
                  height: `${CONFIG.buttonSize}px`,
                  transform: isOpen 
                    ? `translate(${x}px, ${y}px) scale(1)` 
                    : 'translate(0, 0) scale(0.3)',
                  transitionDelay: isOpen ? `${buttonOpenDelay}ms` : `${buttonCloseDelay}ms`,
                }}
                title={button.label}
              >
                <div style={{ 
                  width: `${CONFIG.iconSize}px`, 
                  height: `${CONFIG.iconSize}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {button.icon}
                </div>
              </button>

              {/* 📝 Etiqueta de texto - Sale y se mete del botón */}
              <div
                className={cn(
                  "absolute bottom-0 right-0 whitespace-nowrap text-white",
                  "transition-all ease-out",
                  "opacity-0 pointer-events-none",
                  isOpen && "opacity-100"
                )}
                style={{
                  // 🎬 Animación: 
                  // ABIERTO: Sale desde el botón hacia afuera
                  // CERRADO: Se mete desde afuera hacia el botón
                  transform: isOpen 
                    ? `translate(${textPos.x}px, ${textPos.y}px) rotate(${textRotation}deg) scale(1)` 
                    : `translate(${x}px, ${y}px) rotate(${textRotation}deg) scale(0.3)`,
                  
                  transitionDelay: isOpen ? `${textOpenDelay}ms` : `${textCloseDelay}ms`,
                  transitionDuration: `${CONFIG.text.animationDuration}ms`,
                  
                  // 🎨 Estilos del texto
                  fontSize: textFontSize,
                  fontWeight: CONFIG.text.fontWeight,
                  transformOrigin: 'center',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                }}
              >
                {button.label}
              </div>
            </div>
          );
        })}

        {/* Botón principal */}
        <button
          onMouseDown={handleMainButtonPress}
          onMouseUp={handleMainButtonRelease}
          onMouseLeave={() => setIsPressed(false)}
          onTouchStart={handleMainButtonPress}
          onTouchEnd={handleMainButtonRelease}
          className={cn(
            "relative w-16 h-16 rounded-full",
            "flex items-center justify-center",
            "animate-pulse-scale",
            "focus:outline-none",
            "transition-transform",
            "active:scale-90"
          )}
          style={{
            filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.6)) drop-shadow(0 0 40px rgba(168, 85, 247, 0.3))',
            WebkitTapHighlightColor: 'transparent',
            transform: getMainButtonTransform(),
            transitionDuration: `${CONFIG.animations.pressDuration}ms`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <img 
            src={symbolMuna} 
            alt="MUNA" 
            className="w-14 h-14 object-contain animate-bell-swing pointer-events-none"
          />
        </button>
      </div>
    </div>
  );
}