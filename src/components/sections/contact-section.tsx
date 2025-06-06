
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { ContactForm } from '@/components/contact-form';
import { Button } from '@/components/ui/button';
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';

export function ContactSection() {
  return (
    <SectionWrapper id="contact" title="Get In Touch" animationDelay={5}>
      <div className="max-w-xl mx-auto">
        <p className="text-center text-lg text-muted-foreground mb-8">
          Have a project in mind, a question, or just want to say hi? Feel free to reach out!
        </p>
        <ContactForm />
        <div className="mt-12 text-center">
          <p className="text-md text-muted-foreground mb-4">
            Or connect with me on:
          </p>
          <div className="flex justify-center space-x-4">
            <a href="https://github.com/karn30chavda" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
              <Button variant="outline" size="icon" className="hover:bg-accent/50">
                <Github className="h-5 w-5" />
              </Button>
            </a>
            <a href="https://twitter.com/KDC309" target="_blank" rel="noopener noreferrer" aria-label="Twitter Profile">
              <Button variant="outline" size="icon" className="hover:bg-accent/50">
                <Twitter className="h-5 w-5" />
              </Button>
            </a>
            <a href="https://linkedin.com/in/karanchavda300902" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
              <Button variant="outline" size="icon" className="hover:bg-accent/50">
                <Linkedin className="h-5 w-5" />
              </Button>
            </a>
            <a href="https://instagram.com/k_a_r_n_30" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile">
              <Button variant="outline" size="icon" className="hover:bg-accent/50">
                <Instagram className="h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
