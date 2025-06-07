
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Github, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/dialog';

const projects = [
  {
    title: 'PWA Calculator',
    description: 'Progressive Web App with theme toggle and calculation history. Features offline functionality, splash screen, keyboard support, dark/light themes, and a lightweight design.',
    imageUrl: '/images/calculator.jpg',
    imageVersion: 2,
    tags: ['PWA', 'JavaScript', 'HTML', 'CSS', 'Offline Support'],
    liveUrl: 'https://calcmate-calculate.netlify.app',
    repoUrl: 'https://github.com/karn30chavda/CALCULATOR-PROJECT',
    aiHint: 'calculator app'
  },
  {
    title: 'Designated Driver Service (DDS) Website',
    description: 'Full-Stack Web App for booking professional drivers on-demand. Includes user/driver registration, role-based authentication, real-time booking, admin panel, driver background checks, responsive design, Firebase Hosting, and encrypted data storage.',
    imageUrl: '/images/dds.jpg',
    imageVersion: 2,
    tags: ['Full-Stack', 'Firebase', 'JavaScript', 'Authentication', 'Real-time'],
    liveUrl: 'https://designated-driver-service.netlify.app',
    repoUrl: 'https://github.com/karn30chavda/DRIVER-BOOKING-WEBSITE',
    aiHint: 'booking service'
  },
  {
    title: 'Sticky Notes PWA',
    description: 'Secure Note-Taking App with rich text editing and PWA capabilities. Features PIN-protected notes, dark/light themes, real-time sync, profile picture upload, search/filter functionality, and responsive UI.',
    imageUrl: '/images/stickynotes.jpg',
    tags: ['Full-Stack', 'PWA', 'Security', 'Real-time Sync', 'JavaScript', 'Responsive UI'],
    liveUrl: 'https://stickynotesproject.netlify.app',
    repoUrl: 'https://github.com/karn30chavda/STICKY-NOTE-PROJECT',
    aiHint: 'notes app'
  },
  {
    title: 'Tic Tac Win Game',
    description: 'Offline-Ready Game with AI and multiplayer modes. Features a hand-drawn UI, responsive design, animated splash screen, PWA installation, and smooth animations.',
    imageUrl: '/images/tictactoe.jpg',
    tags: ['PWA', 'Game', 'AI', 'Multiplayer', 'JavaScript'],
    liveUrl: 'https://tictactoewinner.netlify.app',
    repoUrl: 'https://github.com/karn30chavda/Tic-Tac-Toe-Game',
    aiHint: 'game interface'
  },
];

export function ProjectsSection() {
  return (
    <SectionWrapper id="projects" title="Featured Projects" animationDelay={4}>
      {projects.length === 0 ? (
         <div className="text-center py-8 bg-card rounded-lg shadow-md border border-border p-6">
           <p className="text-lg text-muted-foreground mb-4">
             My projects will be showcased here soon! Please provide the details for your projects.
           </p>
         </div>
      ) : null}
      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project, index) => {
          const versionedImageUrl = `${project.imageUrl}?v=${project.imageVersion || 1}`;
          return (
            <Card key={index} className="flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/20">
              <CardHeader className="p-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative w-full h-56 overflow-hidden cursor-pointer group-hover:opacity-90 transition-opacity">
                      <Image
                        src={versionedImageUrl}
                        alt={project.title}
                        fill
                        className="object-cover object-top transform transition-transform duration-500 group-hover:scale-105"
                        data-ai-hint={project.aiHint}
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent
                    hideCloseButton={true}
                    className="p-4 sm:p-6 max-w-[90vw] sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl max-h-[90vh] bg-background/75 backdrop-blur-md flex flex-col items-center justify-center shadow-xl rounded-lg border-border"
                  >
                    <DialogTitle className="sr-only">{`Preview of ${project.title}`}</DialogTitle>
                    <div className="relative flex-grow w-full flex items-center justify-center my-auto overflow-hidden py-2">
                      <Image
                        src={versionedImageUrl}
                        alt={`Preview of ${project.title}`}
                        width={1200}
                        height={800}
                        className="object-contain w-auto h-auto max-w-full max-h-[calc(85vh-4rem)] rounded-md"
                        data-ai-hint={`${project.aiHint} preview`}
                        priority
                      />
                    </div>
                    <DialogFooter className="pt-4 sm:justify-center w-full">
                      <DialogClose asChild>
                        <Button type="button" variant="outline" size="sm">
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="flex-grow p-6 space-y-3">
                <CardTitle className="text-xl font-semibold text-foreground">{project.title}</CardTitle>
                <CardDescription className="text-foreground/80 text-sm">{project.description}</CardDescription>
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-start space-x-2">
                {project.liveUrl && project.liveUrl !== '#' && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1.5 h-4 w-4" /> Live Demo
                    </a>
                  </Button>
                )}
                {project.repoUrl && project.repoUrl !== '#' && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-1.5 h-4 w-4" /> Source Code
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
