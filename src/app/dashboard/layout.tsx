"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { User, Info, LogOut, Menu, Wrench, FolderKanban, Award, Mail } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggleButton } from '@/components/theme-toggle-button';

const navItems = [
  { href: '/dashboard', label: 'Profile', icon: <User /> },
  { href: '/dashboard/about', label: 'About Section', icon: <Info /> },
  { href: '/dashboard/skills', label: 'Skills Section', icon: <Wrench /> },
  { href: '/dashboard/projects', label: 'Projects Section', icon: <FolderKanban /> },
  { href: '/dashboard/certificates', label: 'Certificates', icon: <Award /> },
  { href: '/dashboard/messages', label: 'Messages', icon: <Mail /> },
];

function MobileNav() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open Menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                {navItems.map((item) => (
                    <DropdownMenuItem key={item.label} asChild onClick={() => setOpen(false)}>
                        <Link href={item.href} className={`flex items-center w-full ${pathname === item.href ? 'font-semibold text-primary' : ''}`}>
                            {React.cloneElement(item.icon as React.ReactElement, { className: "mr-2 h-4 w-4" })}
                            <span>{item.label}</span>
                        </Link>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                     <form action={logout} className="w-full">
                        <button type="submit" className="w-full flex items-center text-red-500 hover:text-red-500/90 gap-2">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                        </button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex min-h-screen bg-background">
        {/* Placeholder for sidebar to prevent layout shift */}
        <div className="w-[16rem] hidden md:block" /> 
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6 shrink-0" />
          <main className="flex-1" />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        {!isMobile && (
          <Sidebar>
            <SidebarHeader>
              <Link href="/" className="text-xl font-bold text-primary font-headline group-data-[state=collapsed]:hidden">
                Karan Chavda
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                     <Link href={item.href} legacyBehavior passHref>
                      <SidebarMenuButton
                        isActive={pathname === item.href}
                        tooltip={item.label}
                      >
                        {item.icon}
                        <span className="group-data-[state=collapsed]:hidden">{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <div className="flex flex-col gap-2">
                  <form action={logout}>
                      <Button variant="ghost" className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-500">
                          <LogOut />
                          <span className="group-data-[state=collapsed]:hidden">Logout</span>
                      </Button>
                  </form>
              </div>
            </SidebarFooter>
          </Sidebar>
        )}
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6 shrink-0">
            <div className='flex items-center gap-2'>
              {!isMobile && <SidebarTrigger />}
              {isMobile && (
                  <Link href="/" className="text-xl font-bold text-primary font-headline">
                      Karan Chavda
                  </Link>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <ThemeToggleButton />
              {isMobile && <MobileNav />}
            </div>
          </header>
          <main className="flex-1">
            <React.Suspense fallback={<DashboardLoading />}>
                {children}
            </React.Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function DashboardLoading() {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-pulse">
            <div className="text-center lg:text-left space-y-2">
                <div className="h-10 bg-muted rounded w-1/2 mx-auto lg:mx-0"></div>
                <div className="h-5 bg-muted rounded w-3/4 mx-auto lg:mx-0"></div>
            </div>

            <div className="p-0 md:p-6 bg-muted/50 rounded-2xl border border-border space-y-8">
                <div className="h-10 bg-muted rounded w-1/4"></div>
                <div className="space-y-4">
                    <div className="h-8 bg-muted rounded w-full"></div>
                    <div className="h-8 bg-muted rounded w-full"></div>
                    <div className="h-20 bg-muted rounded w-full"></div>
                </div>
                <div className="flex justify-end">
                    <div className="h-10 bg-muted rounded w-24"></div>
                </div>
            </div>
        </div>
    );
}