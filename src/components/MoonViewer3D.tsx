import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

interface MoonViewer3DProps {
  phase: number; // 0-1, where 0 = new moon, 0.5 = full moon
}

function Moon({ phase }: { phase: number }) {
  const moonRef = useRef<THREE.Mesh>(null);
  
  // Calculate light position based on moon phase
  // phase 0 = new moon (light from behind)
  // phase 0.25 = first quarter (light from right)
  // phase 0.5 = full moon (light from front)
  // phase 0.75 = last quarter (light from left)
  const angle = phase * Math.PI * 2;
  const lightX = Math.sin(angle) * 5;
  const lightZ = Math.cos(angle) * 5;

  return (
    <group>
      {/* Main directional light that creates the phase effect */}
      <directionalLight 
        position={[lightX, 0, lightZ]} 
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
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} shadows>
        {/* Very low ambient light to see the dark side */}
        <ambientLight intensity={0.15} />
        <Moon phase={phase} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
