
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SiteFooter() {
  const [clickCount, setClickCount] = useState(0);
  const router = useRouter();

  const handleCopyrightClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 7) {
      router.push('/login');
    }
  };

  return (
    <footer className="w-full py-8 mt-0 border-t border-border/40">
      <div className="container text-center text-sm text-muted-foreground space-y-1">
        <p onClick={handleCopyrightClick} className="cursor-pointer select-none">
          &copy; {new Date().getFullYear()} Karan Chavda. All rights reserved.
        </p>
        <p>Built with Next.js, Tailwind CSS, and Shadcn/UI.</p>
      </div>
    </footer>
  );
}
