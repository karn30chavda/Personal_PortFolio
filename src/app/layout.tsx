
"use client"; // Add this since we'll use hooks here

import type { Metadata } from 'next';
import { useEffect, useState } from 'react'; // Import hooks
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ScrollToTopButton } from '@/components/scroll-to-top-button';

// Metadata should remain static if possible, or generated via generateMetadata
// For this example, we keep it as is, assuming title is static.
// export const metadata: Metadata = { // Commenting out for client component, can be re-added if layout becomes server again with separate client boundary
//   title: 'ResuMatic | Karan Chavda',
//   description: 'A modern, responsive resume website built with Next.js and Firebase Studio.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Date and time logic moved back to page.tsx

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* It's generally better practice to define static metadata outside client components or via generateMetadata */}
        <title>ResuMatic | Karan Chavda</title>
        <meta name="description" content="A modern, responsive resume website built with Next.js and Firebase Studio." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {/* FixedDateTimeDisplay removed from here */}
          <main>{children}</main>
          <Toaster />
          <ScrollToTopButton />
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
