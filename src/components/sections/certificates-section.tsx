
'use client';

import { SectionWrapper } from '@/components/shared/section-wrapper';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSiteData } from '@/lib/actions';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/dialog';

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
    <SectionWrapper id="certificates" title="My Certificates">
      {certificates.length === 0 ? (
         <div className="text-center py-8 bg-card rounded-lg shadow-md border border-border p-6">
           <p className="text-lg text-muted-foreground mb-4">
             My certificates will be showcased here soon! Add them from the dashboard.
           </p>
         </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {certificates.map((cert, index) => (
            <Card key={index} className="transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/20 overflow-hidden flex flex-col group">
              {cert.imageUrl && (
                <CardHeader className="p-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="relative w-full h-48 overflow-hidden cursor-pointer group-hover:opacity-90 transition-opacity">
                        <Image src={cert.imageUrl} alt={cert.title} fill className="object-cover transform transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    </DialogTrigger>
                    <DialogContent
                      hideCloseButton={true}
                      className="p-4 sm:p-6 max-w-[90vw] sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl max-h-[90vh] bg-background flex flex-col items-center justify-center shadow-xl rounded-lg border-border"
                    >
                      <DialogTitle className="sr-only">{`Preview of ${cert.title}`}</DialogTitle>
                      <div className="relative flex-grow w-full flex items-center justify-center my-auto overflow-hidden py-2">
                        <Image
                          src={cert.imageUrl}
                          alt={`Preview of ${cert.title}`}
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
