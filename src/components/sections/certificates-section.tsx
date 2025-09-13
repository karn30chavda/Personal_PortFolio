
'use client';

import { SectionWrapper } from '@/components/shared/section-wrapper';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSiteData } from '@/lib/actions';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { Award, ExternalLink } from 'lucide-react';

type Certificate = {
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
};

export function CertificatesSection() {
  const [certificates, setCertificates] = useState<Certificate[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      const siteData = await getSiteData();
      setCertificates(siteData.certificates);
    }
    fetchData();
  }, []);

  if (!certificates) {
    return (
      <SectionWrapper id="certificates" title="My Certificates">
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="certificates" title="My Certificates" animationDelay={3.5}>
      {certificates.length === 0 ? (
         <div className="text-center py-8 bg-card rounded-lg shadow-md border border-border p-6">
           <p className="text-lg text-muted-foreground mb-4">
             My certificates will be showcased here soon! Add them from the dashboard.
           </p>
         </div>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {certificates.map((cert, index) => (
            <Card key={index} className="transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/20">
              <div className="flex items-center justify-between p-4 sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block bg-primary/10 p-3 rounded-full">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div className='flex-grow'>
                    <CardTitle className="text-base sm:text-lg font-semibold text-foreground">{cert.title}</CardTitle>
                    <CardDescription className="text-sm text-foreground/80 mt-1">{cert.issuer} - {cert.date}</CardDescription>
                  </div>
                </div>
                {cert.credentialUrl && (
                  <Button variant="outline" size="sm" asChild className="shrink-0 ml-2">
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                      <span className='hidden md:inline'>View</span>
                    </a>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
