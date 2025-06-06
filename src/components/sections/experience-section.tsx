import { SectionWrapper } from '@/components/shared/section-wrapper';
import { Sparkles } from 'lucide-react';

export function ExperienceSection() {
  return (
    <SectionWrapper id="experience" title="My Journey" animationDelay={2}>
      <div className="text-center space-y-6 py-8 bg-card rounded-lg shadow-lg border border-border p-6 md:p-8">
        <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-foreground">Building My Path</h3>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          I am a passionate and self-motivated learner, currently focused on developing my skills in web development through hands-on projects and continuous learning.
        </p>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          While I am at the beginning of my professional journey and do not have formal work experience yet, my dedication is showcased in the projects I've undertaken. I am eager to apply my growing expertise to real-world challenges and contribute to innovative solutions.
        </p>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Please explore my <a href="#projects" className="text-primary hover:underline font-medium">projects section</a> to see what I've been working on!
        </p>
      </div>
    </SectionWrapper>
  );
}
