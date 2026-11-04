'use client';

import Image from 'next/image';
import { useState } from 'react';
import { HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Shared logo tile with a safe icon fallback if the public asset cannot load. */
export default function BrandMark({ size = 40, className, priority = false }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <span
      className={cn('relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-ivory', className)}
      style={{ width: size, height: size }}
    >
      {imageFailed ? (
        <HeartPulse className="h-1/2 w-1/2 text-forest" aria-hidden="true" />
      ) : (
        <Image
          src="/images/doctors%20logo.png"
          alt="Doctor Tracker logo"
          fill
          sizes={`${size}px`}
          priority={priority}
          className="object-contain p-1"
          onError={() => setImageFailed(true)}
        />
      )}
    </span>
  );
}
