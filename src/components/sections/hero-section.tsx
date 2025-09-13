
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FileText, Eye, ArrowDownToLine } from 'lucide-react';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export function HeroSection() {
  return (
    <SectionWrapper
      id="hero"
      className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center text-center !py-0"
      animationDelay={0}
    >
      <div className="relative z-10 space-y-6">
        <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-border opacity-0 fade-in-load fade-in-delay-0">
          <Image
            src="/images/karanprofile.jpg"
            alt="Karan Chavda"
            fill
            className="object-cover"
            data-ai-hint="profile picture"
            priority
          />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground font-headline opacity-0 fade-in-load fade-in-delay-1">
          Karan Chavda
        </h1>
        <p className="text-xl sm:text-2xl text-muted-foreground font-medium opacity-0 fade-in-load fade-in-delay-2">
          Creative Web Developer & UI/UX Enthusiast
        </p>
        <p className="max-w-xl mx-auto text-foreground/80 opacity-0 fade-in-load fade-in-delay-4">
          Passionate about building beautiful, functional, and user-friendly web experiences. Let's create something amazing together.
        </p>

        <div className="opacity-0 fade-in-load fade-in-delay-5">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <FileText className="mr-2 h-5 w-5" />
                Resume
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-sm rounded-lg" hideCloseButton={true}>
              <DialogHeader>
                <DialogTitle>Resume Options</DialogTitle>
                <DialogDescription>
                  You can preview or download Karan Chavda's resume.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Button asChild variant="outline">
                  <a href="/karanresume.pdf" target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Resume
                  </a>
                </Button>
                <Button asChild>
                  <a href="/karanresume.pdf" download="KaranChavda_Resume.pdf">
                    <ArrowDownToLine className="mr-2 h-4 w-4" />
                    Download Resume
                  </a>
                </Button>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" size="sm">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </SectionWrapper>
  );
}
