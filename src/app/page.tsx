
import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { ExperienceSection } from '@/components/sections/experience-section';
import { SkillsSection } from '@/components/sections/skills-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { ContactSection } from '@/components/sections/contact-section';
import { Separator } from '@/components/ui/separator';
import { CertificatesSection } from '@/components/sections/certificates-section';
import { SiteFooter } from '@/components/shared/site-footer';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      <HeroSection />
      <div className="w-full max-w-5xl px-4">
        <Separator className="my-8 md:my-12" />
      </div>
      <AboutSection />
      <div className="w-full max-w-5xl px-4">
        <Separator className="my-8 md:my-12" />
      </div>
      <ExperienceSection />
      <div className="w-full max-w-5xl px-4">
        <Separator className="my-8 md:my-12" />
      </div>
      <SkillsSection />
      <div className="w-full max-w-5xl px-4">
        <Separator className="my-8 md:my-12" />
      </div>
      <CertificatesSection />
      <div className="w-full max-w-5xl px-4">
        <Separator className="my-8 md:my-12" />
      </div>
      <ProjectsSection />
      <div className="w-full max-w-5xl px-4">
        <Separator className="my-8 md:my-12" />
      </div>
      <ContactSection />
      <SiteFooter />
    </div>
  );
}
