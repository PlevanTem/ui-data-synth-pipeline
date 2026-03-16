import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stage, OrbitControls, useGLTF } from '@react-three/drei';
import { Product } from '../store/useStore';

interface ProductViewer3DProps {
  product?: Product;
}

const PlaceholderModel = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 100, 16]} />
      <meshPhysicalMaterial 
        color="#3B82F6" 
        roughness={0.2} 
        metalness={0.8} 
        clearcoat={1} 
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
};

export const ProductViewer3D: React.FC<ProductViewer3DProps> = ({ product }) => {
  return (
    <div className="w-full h-full min-h-[400px] relative">
      <Canvas dpr={[1, 2]} camera={{ fov: 50 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5}>
            {product?.modelUrl ? (
              // <primitive object={useGLTF(product.modelUrl).scene} />
              <PlaceholderModel /> 
            ) : (
              <PlaceholderModel />
            )}
          </Stage>
        </Suspense>
        <OrbitControls autoRotate autoRotateSpeed={4} enableZoom={false} />
      </Canvas>
      
      {/* Loading Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="animate-spin-slow w-32 h-32 border-t-2 border-primary rounded-full opacity-20" />
      </div>
    </div>
  );
};
