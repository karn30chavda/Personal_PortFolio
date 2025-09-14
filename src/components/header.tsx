
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Info, Briefcase, Wrench, FolderKanban, Mail, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { href: '#about', label: 'About', icon: <Info className="mr-2 h-4 w-4" /> },
  { href: '#experience', label: 'Experience', icon: <Briefcase className="mr-2 h-4 w-4" /> },
  { href: '#skills', label: 'Skills', icon: <Wrench className="mr-2 h-4 w-4" /> },
  { href: '#certificates', label: 'Certificates', icon: <Award className="mr-2 h-4 w-4" /> },
  { href: '#projects', label: 'Projects', icon: <FolderKanban className="mr-2 h-4 w-4" /> },
  { href: '#contact', label: 'Contact', icon: <Mail className="mr-2 h-4 w-4" /> },
];

export function Header() {
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId) {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }, []);

  if (!isMounted) {
    // Render a placeholder with the same height to prevent layout shift, or null
    return <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16" />;
  }

  const DesktopNavLinks = () => (
    navLinks.map((link) => (
      <Button
        key={link.label}
        variant="ghost"
        asChild
        className="font-medium text-sm"
      >
        <Link href={link.href}>{link.label}</Link>
      </Button>
    ))
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary font-headline">
          Karan Chavda
        </Link>
        
        {isMobile ? (
          <div className="flex items-center gap-2">
            <ThemeToggleButton />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {navLinks.map((link) => (
                  <DropdownMenuItem key={link.label} asChild>
                    <Link href={link.href} className="flex items-center">
                      {link.icon}
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <nav className="flex items-center space-x-2">
            <DesktopNavLinks />
            <ThemeToggleButton />
          </nav>
        )}
      </div>
    </header>
  );
}
