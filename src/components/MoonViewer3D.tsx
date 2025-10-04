import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

interface MoonViewer3DProps {
  phase: number; // 0-1, where 0 = new moon, 0.5 = full moon
}

function Moon({ phase }: { phase: number }) {
  const moonRef = useRef<THREE.Mesh>(null);

  return (
    <group>
      <Sphere ref={moonRef} args={[2, 64, 64]} scale={1}>
        <meshStandardMaterial
          color="#e8e8e8"
          roughness={0.9}
          metalness={0.1}
          emissive="#666666"
          emissiveIntensity={0.2}
        />
      </Sphere>
      
      {/* Shadow overlay for moon phase */}
      <Sphere args={[2.01, 64, 64]} rotation={[0, (phase * Math.PI * 2), 0]}>
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.85}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Ambient glow */}
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#a78bfa" distance={8} />
    </group>
  );
}

export default function MoonViewer3D({ phase }: MoonViewer3DProps) {
  return (
    <div className="w-full h-full animate-fade-in">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />
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
