'use client';

import Image from 'next/image';

interface BrandLogoProps {
  size: number;
  priority?: boolean;
}

export function BrandLogo({ size, priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/truvalens.png"
      alt="TruvaLens Logo"
      width={size}
      height={size}
      priority={priority}
    />
  );
}
