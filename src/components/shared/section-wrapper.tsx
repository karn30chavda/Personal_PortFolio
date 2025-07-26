
"use client";

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import React from 'react';

interface SectionWrapperProps {
  id: string;
  title?: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  animationDelay?: number; 
}

export function SectionWrapper({
  id,
  title,
  children,
  className,
  titleClassName,
  contentClassName,
  animationDelay = 0,
}: SectionWrapperProps) {

  return (
    <section
      id={id}
      className={cn(
        'w-full max-w-5xl py-12 md:py-20 px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      {title && (
        <h2 className={cn('text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center text-primary font-headline', titleClassName)}>
          {title}
        </h2>
      )}
      <div className={cn(contentClassName)}>
        {children}
      </div>
    </section>
  );
}
