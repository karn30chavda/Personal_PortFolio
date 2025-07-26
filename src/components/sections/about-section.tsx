
import { SectionWrapper } from '@/components/shared/section-wrapper';
import Image from 'next/image';

export function AboutSection() {
  return (
    <SectionWrapper id="about" title="About Me" animationDelay={1}>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-xl group" data-scroll-animate="slide-in-left">
           <Image
            src="https://images.unsplash.com/photo-1515041219749-89347f83291a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxtaW5pb258ZW58MHx8fHwxNzQ5MjExMDAxfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="About me visual - Minion character"
            fill
            className="transform transition-transform duration-500 group-hover:scale-105 object-cover"
            data-ai-hint="minion character"
          />
        </div>
        <div className="space-y-4 text-lg text-foreground/80 text-center md:text-left" data-scroll-animate="slide-in-right">
          <p>
            Hello! I'm a dedicated and results-oriented web developer with a knack for crafting elegant solutions to complex problems. With numbers of years of experience in the projects building, I've had the pleasure of working on a variety of projects, from small business websites to large-scale web applications.
          </p>
          <p>
            My passion lies in the intersection of design and technology. I believe that a great user experience is paramount, and I strive to create interfaces that are not only visually appealing but also intuitive and accessible to all users.
          </p>
          <p>
            When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or enjoying a good cup of coffee while planning my next adventure.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
