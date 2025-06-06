
"use client";

import { useEffect, useState } from 'react';
import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { ExperienceSection } from '@/components/sections/experience-section';
import { SkillsSection } from '@/components/sections/skills-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { ContactSection } from '@/components/sections/contact-section';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [currentIndianDate, setCurrentIndianDate] = useState<string | null>(null);
  const [currentIndianTime, setCurrentIndianTime] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    setCurrentYear(now.getFullYear());

    const updateIndianTime = () => {
      const now = new Date();
      setCurrentIndianDate("India " + now.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Kolkata',
      }));
      setCurrentIndianTime(now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      }));
    };

    updateIndianTime(); 
    const intervalId = setInterval(updateIndianTime, 1000); 

    return () => clearInterval(intervalId); 
  }, []);

  return (
    <div className="flex flex-col items-center overflow-x-hidden">
      <HeroSection currentIndianDate={currentIndianDate} currentIndianTime={currentIndianTime} />
      <div className="w-full max-w-5xl px-4">
        <Separator className="my-8 md:my-12 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent dark:via-primary/40" />
      </div>
      <AboutSection />
      <div className="w-full max-w-5xl px-4">
        <Separator className="my-8 md:my-12 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent dark:via-primary/40" />
      </div>
      <ExperienceSection />
      <div className="w-full max-w-5xl px-4">
        <Separator className="my-8 md:my-12 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent dark:via-primary/40" />
      </div>
      <SkillsSection />
      <div className="w-full max-w-5xl px-4">
        <Separator className="my-8 md:my-12 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent dark:via-primary/40" />
      </div>
      <ProjectsSection />
      <div className="w-full max-w-5xl px-4">
        <Separator className="my-8 md:my-12 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent dark:via-primary/40" />
      </div>
      <ContactSection />
       <footer className="w-full py-8 mt-0 border-t border-border/40">
        <div className="container text-center text-sm text-muted-foreground space-y-1">
          <p>&copy; {currentYear ? currentYear : '...'} Karan Chavda. All rights reserved.</p>
          <p>Built with Next.js, Tailwind CSS, and Shadcn/UI.</p>
        </div>
      </footer>
    </div>
  );
}
