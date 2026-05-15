import React from 'react';
import Image from 'next/image';

interface TexturedBackgroundProps {
  children: React.ReactNode;
  texture: 'research' | 'results' | 'architecture';
  intensityLevel?: 'subtle' | 'medium' | 'strong';
  className?: string;
}

const textureMap = {
  research: '/textures/research-hyperfocus.jpg',
  results: '/textures/system-architecture.jpg', // Map results to architecture for now
  architecture: '/textures/system-architecture.jpg',
};

const intensityMap = {
  subtle: 'opacity-10',
  medium: 'opacity-20',
  strong: 'opacity-40',
};

export const TexturedBackground: React.FC<TexturedBackgroundProps> = ({
  children,
  texture,
  intensityLevel = 'subtle',
  className = '',
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Texture Layer */}
      <div className={`absolute inset-0 z-0 ${intensityMap[intensityLevel]} mix-blend-screen`}>
        <Image
          src={textureMap[texture]}
          alt="Background Texture"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Noir Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#000000] via-transparent to-[#000000]" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#000000] via-transparent to-[#000000]/30" />

      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};
