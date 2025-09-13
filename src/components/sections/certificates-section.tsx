
'use client';

import { SectionWrapper } from '@/components/shared/section-wrapper';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSiteData } from '@/lib/actions';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { Award, ExternalLink } from 'lucide-react';
import Image from 'next/image';

type Certificate = {
  title: string;
  issuer: string;
  date: string;
  imageUrl?: string;
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
        <div className="grid md:grid-cols-2 gap-8">
          {[...Array(2)].map((_, index) => (
            <Card key={index} className="flex flex-col">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 flex-grow">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className='p-4 pt-0'>
                <Skeleton className="h-9 w-24" />
              </div>
            </Card>
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
        <div className="grid md:grid-cols-2 gap-8">
          {certificates.map((cert, index) => (
            <Card key={index} className="transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/20 overflow-hidden flex flex-col">
              {cert.imageUrl && (
                <div className="relative w-full h-48">
                  <Image src={cert.imageUrl} alt={cert.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-4 flex-grow">
                <CardTitle className="text-lg font-semibold text-foreground">{cert.title}</CardTitle>
                <CardDescription className="text-sm text-foreground/80 mt-1">{cert.issuer} - {cert.date}</CardDescription>
              </div>
              {cert.credentialUrl && (
                  <CardFooter className='p-4 pt-0'>
                    <Button variant="outline" size="sm" asChild className="shrink-0">
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        View Credential
                      </a>
                    </Button>
                  </CardFooter>
                )}
            </Card>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
