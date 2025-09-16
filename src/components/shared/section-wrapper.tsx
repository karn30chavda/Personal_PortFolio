
"use client";

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import React from 'react';
import { motion } from 'framer-motion';

interface SectionWrapperProps {
  id: string;
  title?: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

export function SectionWrapper({
  id,
  title,
  children,
  className,
  titleClassName,
  contentClassName,
}: SectionWrapperProps) {

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <motion.section
      id={id}
      className={cn(
        'w-full max-w-5xl py-12 md:py-20 px-4 sm:px-6 lg:px-8',
        className
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants}
    >
      {title && (
        <h2 className={cn('text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center text-primary font-headline', titleClassName)}>
          {title}
        </h2>
      )}
      <div className={cn('mx-auto', contentClassName)}>
        {children}
      </div>
    </motion.section>
  );
}
