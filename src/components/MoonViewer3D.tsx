import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface MoonViewer3DProps {
  phase: number; // 0-1, where 0 = new moon, 0.5 = full moon
}

function Moon({ phase }: { phase: number }) {
  const moonRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const currentPhaseRef = useRef(phase);
  const targetPhaseRef = useRef(phase);

  useEffect(() => {
    targetPhaseRef.current = phase;
  }, [phase]);
  
  // Animate moon rotation in a pendulum motion
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle swaying motion from -0.1 to 0.1 radians (about -6° to 6°)
      // Slower speed (0.3) and smaller amplitude (0.1) for smoother movement
      const swing = Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
      groupRef.current.rotation.y = swing;
    }

    const phaseDiff = targetPhaseRef.current - currentPhaseRef.current;
    if (Math.abs(phaseDiff) > 0.0005) {
      currentPhaseRef.current += phaseDiff * 0.08;
    } else {
      currentPhaseRef.current = targetPhaseRef.current;
    }

    if (lightRef.current) {
      const angle = currentPhaseRef.current * Math.PI * 2;
      const lightX = Math.sin(angle) * 5;
      const lightZ = Math.cos(angle) * 5;
      lightRef.current.position.set(lightX, 0, lightZ);
      lightRef.current.target.position.set(0, 0, 0);
      lightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main directional light that creates the phase effect */}
      <directionalLight 
        ref={lightRef}
        position={[Math.sin(phase * Math.PI * 2) * 5, 0, Math.cos(phase * Math.PI * 2) * 5]} 
        intensity={2.5} 
        color="#ffffff"
        castShadow
      />
      
      {/* Moon sphere */}
      <Sphere ref={moonRef} args={[2, 64, 64]} receiveShadow>
        <meshStandardMaterial
          color="#e8e8e8"
          roughness={0.95}
          metalness={0.05}
          emissive="#1a1a1a"
          emissiveIntensity={0.1}
        />
      </Sphere>

      {/* Subtle ambient glow */}
      <pointLight position={[0, 0, 0]} intensity={0.3} color="#a78bfa" distance={8} />
    </group>
  );
}

export default function MoonViewer3D({ phase }: MoonViewer3DProps) {
  return (
    <div className="w-full h-full animate-fade-in">
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 50 }} 
        shadows
        gl={{ preserveDrawingBuffer: true }}
      >
        {/* Very low ambient light to see the dark side */}
        <ambientLight intensity={0.15} />
        <Moon phase={phase} />
        <OrbitControls
          makeDefault
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
