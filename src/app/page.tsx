
import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { ExperienceSection } from '@/components/sections/experience-section';
import { SkillsSection } from '@/components/sections/skills-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { ContactSection } from '@/components/sections/contact-section';
import { Separator } from '@/components/ui/separator';
import { CertificatesSection } from '@/components/sections/certificates-section';

export default function HomePage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative flex flex-col items-center">
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
      <CertificatesSection />
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
