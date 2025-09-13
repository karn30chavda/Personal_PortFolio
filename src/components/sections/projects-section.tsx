
'use client';

import { SectionWrapper } from '@/components/shared/section-wrapper';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Github, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { getSiteData } from '@/lib/actions';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

type Project = {
  title: string;
  description: string;
  imageUrl: string;
  tags: string;
  liveUrl?: string;
  repoUrl?: string;
  aiHint?: string; // Kept for potential future use
};

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      const siteData = await getSiteData();
      setProjects(siteData.projects);
    }
    fetchData();
  }, []);

  if (!projects) {
    return (
      <SectionWrapper id="projects" title="Featured Projects">
        <div className="grid md:grid-cols-2 gap-8">
          {[...Array(2)].map((_, index) => (
            <Card key={index} className="flex flex-col">
              <Skeleton className="h-56 w-full" />
              <CardContent className="flex-grow p-6 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex flex-wrap gap-2 pt-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Skeleton className="h-9 w-28" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="projects" title="Featured Projects" animationDelay={4}>
      {projects.length === 0 ? (
         <div className="text-center py-8 bg-card rounded-lg shadow-md border border-border p-6">
           <p className="text-lg text-muted-foreground mb-4">
             My projects will be showcased here soon! Add them from the dashboard.
           </p>
         </div>
      ) : null}
      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project, index) => {
          const projectTags = project.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
          return (
            <Card key={index} className="flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/20">
              <CardHeader className="p-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative w-full h-56 overflow-hidden cursor-pointer group-hover:opacity-90 transition-opacity">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover object-top transform transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent
                    hideCloseButton={true}
                    className="p-4 sm:p-6 max-w-[90vw] sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl max-h-[90vh] bg-background flex flex-col items-center justify-center shadow-xl rounded-lg border-border"
                  >
                    <DialogTitle className="sr-only">{`Preview of ${project.title}`}</DialogTitle>
                    <div className="relative flex-grow w-full flex items-center justify-center my-auto overflow-hidden py-2">
                      <Image
                        src={project.imageUrl}
                        alt={`Preview of ${project.title}`}
                        width={1200}
                        height={800}
                        className="object-contain w-auto h-auto max-w-full max-h-[calc(85vh-4rem)] rounded-md"
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
                  {projectTags.map(tag => (
                    <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-start space-x-2">
                {project.liveUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1.5 h-4 w-4" /> Live Demo
                    </a>
                  </Button>
                )}
                {project.repoUrl && (
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
