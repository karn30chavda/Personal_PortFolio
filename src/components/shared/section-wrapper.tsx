
"use client";

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import React, { useState, useEffect, useRef } from 'react';

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
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );

    const currentSectionRef = sectionRef.current;
    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }

    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
    };
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={cn(
        'w-full max-w-5xl py-12 md:py-20 px-4 sm:px-6 lg:px-8',
        'opacity-0', // Start with opacity 0
        isVisible && 'fade-in-load', // Apply animation when visible
        isVisible && animationDelay > 0 && `fade-in-delay-${animationDelay}`,
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
