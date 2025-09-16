
"use client";

import { SectionWrapper } from '@/components/shared/section-wrapper';
import Image from 'next/image';
import { getProfileData } from '@/lib/actions';
import { useEffect, useState } from 'react';

type AboutData = {
  content: string;
  imageUrl: string;
}

export function AboutSection() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);

  useEffect(() => {
    async function fetchData() {
      const profileData = await getProfileData();
      setAboutData(profileData.about);
    }
    fetchData();
  }, []);

  const paragraphs = aboutData?.content.split('\n').filter(p => p.trim() !== '') || [];

  if (!aboutData) {
    return (
      <SectionWrapper id="about" title="About Me">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-xl bg-muted animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded w-full animate-pulse"></div>
            <div className="h-6 bg-muted rounded w-5/6 animate-pulse"></div>
            <div className="h-6 bg-muted rounded w-full animate-pulse"></div>
            <div className="h-6 bg-muted rounded w-4/6 animate-pulse"></div>
          </div>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="about" title="About Me">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div
          className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-xl group"
        >
          <Image
            src={aboutData.imageUrl}
            alt="About me visual"
            fill
            className="transform transition-transform duration-500 group-hover:scale-105 object-cover"
            data-ai-hint="minion character"
          />
        </div>
        <div
          className="space-y-4 text-lg text-foreground/80 text-center md:text-left"
        >
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
