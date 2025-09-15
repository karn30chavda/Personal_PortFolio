
'use client';

export function SiteFooter() {
  return (
    <footer className="w-full py-8 mt-0 border-t border-border/40">
      <div className="container text-center text-sm text-muted-foreground space-y-1">
        <p className="cursor-pointer select-none">
          &copy; {new Date().getFullYear()} Karan Chavda. All rights reserved.
        </p>
        <p>Built with Next.js, Tailwind CSS, and Shadcn/UI.</p>
      </div>
    </footer>
  );
}
