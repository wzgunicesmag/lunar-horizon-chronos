import { useState } from 'react';
import { Home, Calendar, Image, BookOpen } from 'lucide-react';
import symbolMuna from '@/images/symbol_muna.png';
import { cn } from '@/lib/utils';
import { useAppNavigation } from '@/hooks/useAppNavigation'; // ⬅️ AGREGAR ESTA LÍNEA

// 🎨 CONFIGURACIÓN INDIVIDUAL DEL TEXTO
interface NavButton {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  textConfig?: {
    rotation?: number;
    offsetX?: number;
    offsetY?: number;
    distance?: number;
    fontSize?: string;
  };
}

// 🎛️ CONFIGURACIÓN DEL MENÚ RADIAL
const CONFIG = {
  globalScale: 1.2,

  distanceFromCenter: 90,
  buttonSpacing: 1,
  buttonSize: 40,
  iconSize: 78,

  animations: {
    pressScale: 0.85,
    releaseScale: 1.05,
    pressDuration: 150,
    releaseDuration: 250,
    hoverScale: 1.08,
    rotationOnOpen: 75,
    rotationOnPress: 5,
  },

  mainButton: {
    normalGlow: 'drop-shadow(0 0 20px hsla(208, 91%, 57%, 0.6)) drop-shadow(0 0 40px hsla(208, 91%, 57%, 0.3))',
    pressedGlow: 'drop-shadow(0 0 30px hsla(208, 91%, 57%, 0.9)) drop-shadow(0 0 60px hsla(208, 91%, 57%, 0.6))',
    hoverGlow: 'drop-shadow(0 0 25px hsla(208, 91%, 57%, 0.7)) drop-shadow(0 0 50px hsla(208, 91%, 57%, 0.4))',
  },

  text: {
    defaultDistance: 50,
    fontSize: '14px',
    fontWeight: '600',
    animationDelay: 300,
    animationDuration: 400,
    closeAnimationDelay: 0,
  },
};

export function RadialNavMenu() {
  const { setSection } = useAppNavigation(); // ⬅️ AGREGAR ESTA LÍNEA
  const [isOpen, setIsOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);

  const navButtons: NavButton[] = [
    {
      icon: <Home className={`w-[${CONFIG.iconSize}px] h-[${CONFIG.iconSize}px]`} />,
      label: 'CALENDARIO',
      onClick: () => {
        setSection('calendario'); // ⬅️ CAMBIAR ESTA LÍNEA
        setIsOpen(false); // ⬅️ AGREGAR ESTA LÍNEA
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
      label: 'ANALISIS',
      onClick: () => {
        setSection('analisis'); // ⬅️ CAMBIAR ESTA LÍNEA
        setIsOpen(false); // ⬅️ AGREGAR ESTA LÍNEA
      },
      textConfig: {
        rotation: 20,
        offsetX: -2,
        offsetY: -8,
        distance: 50,
        fontSize: '24px',
      },
    },
    {
      icon: <Image className={`w-[${CONFIG.iconSize}px] h-[${CONFIG.iconSize}px]`} />,
      label: 'EVENTOS',
      onClick: () => {
        setSection('eventos'); // ⬅️ CAMBIAR ESTA LÍNEA
        setIsOpen(false); // ⬅️ AGREGAR ESTA LÍNEA
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
      label: 'PERFIL',
      onClick: () => {
        setSection('perfil'); // ⬅️ CAMBIAR ESTA LÍNEA
        setIsOpen(false); // ⬅️ AGREGAR ESTA LÍNEA
      },
      textConfig: {
        rotation: 70,
        offsetX: -4,
        offsetY: -25,
        distance: 50,
        fontSize: '24px',
      },
    },
  ];

  const handleMainButtonPress = () => {
    setIsPressed(true);
    setIsReleasing(false);
  };

  const handleMainButtonRelease = () => {
    setIsPressed(false);
    setIsReleasing(true);

    setTimeout(() => {
      setIsReleasing(false);
      setIsOpen(!isOpen);
    }, CONFIG.animations.releaseDuration);
  };

  const getButtonPosition = (index: number, total: number) => {
    const radius = CONFIG.distanceFromCenter;

    const minAngle = 0;
    const maxAngle = 90;

    const usableRange = (maxAngle - minAngle) * CONFIG.buttonSpacing;
    const startOffset = (maxAngle - minAngle - usableRange) / 2;

    const angleStep = total > 1 ? usableRange / (total - 1) : 0;
    const angle = (minAngle + startOffset + index * angleStep) * (Math.PI / 180);

    const x = -Math.cos(angle) * radius;
    const y = -Math.sin(angle) * radius;

    return { x, y };
  };

  const getTextPosition = (buttonX: number, buttonY: number, textConfig?: NavButton['textConfig']) => {
    const distance = textConfig?.distance ?? CONFIG.text.defaultDistance;
    const offsetX = textConfig?.offsetX ?? 0;
    const offsetY = textConfig?.offsetY ?? 0;

    const buttonAngle = Math.atan2(-buttonY, -buttonX);

    const textX = buttonX + (-Math.cos(buttonAngle) * distance) + offsetX;
    const textY = buttonY + (-Math.sin(buttonAngle) * distance) + offsetY;

    return { x: textX, y: textY };
  };

  const getImageScale = () => {
    if (isPressed) {
      return CONFIG.animations.pressScale;
    }
    if (isReleasing) {
      return CONFIG.animations.releaseScale;
    }
    if (isHovered) {
      return CONFIG.animations.hoverScale;
    }
    return 1;
  };

  const getImageRotation = () => {
    const baseRotation = isOpen ? CONFIG.animations.rotationOnOpen : 0;
    const pressRotation = isPressed ? CONFIG.animations.rotationOnPress : 0;
    return baseRotation + pressRotation;
  };

  const getMainButtonGlow = () => {
    if (isPressed) {
      return CONFIG.mainButton.pressedGlow;
    }
    if (isHovered) {
      return CONFIG.mainButton.hoverGlow;
    }
    return CONFIG.mainButton.normalGlow;
  };

  const getTransitionDuration = () => {
    if (isPressed) {
      return CONFIG.animations.pressDuration;
    }
    if (isReleasing) {
      return CONFIG.animations.releaseDuration;
    }
    return 200;
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div
        className="relative transition-transform duration-300"
        style={{
          transform: `scale(${CONFIG.globalScale})`,
          transformOrigin: 'bottom right',
        }}
      >
        {navButtons.map((button, index) => {
          const { x, y } = getButtonPosition(index, navButtons.length);
          const textPos = getTextPosition(x, y, button.textConfig);
          const textRotation = button.textConfig?.rotation ?? 0;
          const textFontSize = button.textConfig?.fontSize ?? CONFIG.text.fontSize;

          const totalButtons = navButtons.length;
          const reverseIndex = totalButtons - 1 - index;

          const buttonOpenDelay = index * 50;
          const textOpenDelay = buttonOpenDelay + CONFIG.text.animationDelay;

          const textCloseDelay = reverseIndex * 50 + CONFIG.text.closeAnimationDelay;
          const buttonCloseDelay = textCloseDelay + 200;

          return (
            <div key={index}>
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
                  boxShadow: isOpen
                    ? '0 4px 20px hsla(208, 91%, 57%, 0.5), 0 0 40px hsla(208, 91%, 57%, 0.3)'
                    : 'none',
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

              <div
                className={cn(
                  "absolute bottom-0 right-0 whitespace-nowrap text-white",
                  "transition-all ease-out",
                  "opacity-0 pointer-events-none",
                  isOpen && "opacity-100"
                )}
                style={{
                  transform: isOpen
                    ? `translate(${textPos.x}px, ${textPos.y}px) rotate(${textRotation}deg) scale(1)`
                    : `translate(${x}px, ${y}px) rotate(${textRotation}deg) scale(0.3)`,

                  transitionDelay: isOpen ? `${textOpenDelay}ms` : `${textCloseDelay}ms`,
                  transitionDuration: `${CONFIG.text.animationDuration}ms`,

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

        <button
          onMouseDown={handleMainButtonPress}
          onMouseUp={handleMainButtonRelease}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsPressed(false);
            setIsHovered(false);
            setIsReleasing(false);
          }}
          onTouchStart={handleMainButtonPress}
          onTouchEnd={handleMainButtonRelease}
          className={cn(
            "relative w-16 h-16 rounded-full",
            "flex items-center justify-center",
            !isPressed && !isReleasing && "animate-pulse-scale",
            "focus:outline-none",
            "cursor-pointer",
            "select-none"
          )}
          style={{
            filter: getMainButtonGlow(),
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <img
            src={symbolMuna}
            alt="MUNA"
            className="w-14 h-14 object-contain pointer-events-none"
            style={{
              transform: `rotate(${getImageRotation()}deg) scale(${getImageScale()})`,
              transition: `transform ${getTransitionDuration()}ms ${
                isReleasing
                  ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' // Rebote elástico
                  : 'cubic-bezier(0.4, 0, 0.2, 1)' // Suave
              }`,
              filter: isPressed ? 'brightness(1.25)' : 'brightness(1)',
            }}
          />

          {isPressed && (
            <>
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: 'hsla(208, 91%, 57%, 0.3)',
                  animation: 'ripple 0.8s cubic-bezier(0, 0, 0.2, 1)',
                }}
              />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: 'hsla(208, 91%, 57%, 0.2)',
                  animation: 'ripple 1s cubic-bezier(0, 0, 0.2, 1) 0.1s',
                }}
              />
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}