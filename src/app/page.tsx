
import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { ExperienceSection } from '@/components/sections/experience-section';
import { SkillsSection } from '@/components/sections/skills-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { ContactSection } from '@/components/sections/contact-section';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative flex flex-col items-center">
      <div className="absolute top-0 left-0 -z-10 h-full w-full">
        <div className="absolute top-1/2 left-1/4 h-[50vw] w-[50vw] -translate-x-1/2 -translate-y-1/2 animate-float-bubble-1 rounded-full border-2 border-primary/60 bg-primary/30 blur-3xl dark:border-primary/50 dark:bg-primary/25 sm:h-[40vw] sm:w-[40vw]"></div>
        <div className="absolute top-1/4 right-1/4 h-[45vw] w-[45vw] translate-x-1/4 -translate-y-1/4 animate-float-bubble-2 rounded-full border-2 border-accent/60 bg-accent/30 blur-3xl dark:border-accent/50 dark:bg-accent/25 sm:h-[35vw] sm:w-[35vw]"></div>
      </div>
      <HeroSection />
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
          <p>&copy; {currentYear} Karan Chavda. All rights reserved.</p>
          <p>Built with Next.js, Tailwind CSS, and Shadcn/UI.</p>
        </div>
      </footer>
    </div>
  );
}
