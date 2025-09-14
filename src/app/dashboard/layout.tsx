
"use client";

import Link from 'next/link';
import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { User, Info, LogOut, ExternalLink, Menu, Wrench, FolderKanban, Award, Mail, Loader2 } from 'lucide-react';
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
import { useEffect, useState, useTransition } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Profile', icon: <User /> },
  { href: '/dashboard/about', label: 'About Section', icon: <Info /> },
  { href: '/dashboard/skills', label: 'Skills Section', icon: <Wrench /> },
  { href: '/dashboard/projects', label: 'Projects Section', icon: <FolderKanban /> },
  { href: '/dashboard/certificates', label: 'Certificates', icon: <Award /> },
  { href: '/dashboard/messages', label: 'Messages', icon: <Mail /> },
];

function NavButtonLink({
  href,
  label,
  icon,
  currentPath,
  targetPath,
  isNavigating,
  onClick,
  isMobile = false,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  currentPath: string;
  targetPath: string;
  isNavigating: boolean;
  onClick: () => void;
  isMobile?: boolean;
}) {
  const isActive = currentPath === href;
  const isTarget = isNavigating && targetPath === href;
  const isDisabled = isNavigating && !isTarget;

  if (isMobile) {
    return (
      <Link href={href} onClick={onClick} className={cn("flex items-center w-full", isDisabled && "opacity-50 pointer-events-none")}>
        {isTarget ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : React.cloneElement(icon as React.ReactElement, { className: "mr-2 h-4 w-4" })}
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <Link href={href} legacyBehavior passHref>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={label}
        onClick={onClick}
        disabled={isDisabled}
        className={cn(isDisabled && "opacity-50 pointer-events-none")}
      >
        {isTarget ? <Loader2 className="animate-spin" /> : icon}
        <span className="group-data-[state=collapsed]:hidden">{label}</span>
      </SidebarMenuButton>
    </Link>
  );
}

function MobileNav({ 
    currentPath, 
    targetPath, 
    isNavigating, 
    handleLinkClick 
}: { 
    currentPath: string;
    targetPath: string; 
    isNavigating: boolean; 
    handleLinkClick: (href: string) => void; 
}) {
    const [open, setOpen] = useState(false);

    const onLinkClick = (href: string) => {
        handleLinkClick(href);
        setOpen(false);
    }
    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open Menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {navItems.map((item) => (
                    <DropdownMenuItem key={item.label} disabled={isNavigating && targetPath !== item.href} asChild>
                         <NavButtonLink
                            href={item.href}
                            label={item.label}
                            icon={item.icon}
                            currentPath={currentPath}
                            targetPath={targetPath}
                            isNavigating={isNavigating}
                            onClick={() => onLinkClick(item.href)}
                            isMobile={true}
                        />
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
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
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetPath, setTargetPath] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Reset navigation state when the new page loads
    if (pathname === targetPath) {
        setIsNavigating(false);
        setTargetPath("");
    }
  }, [pathname, targetPath]);

  const handleLinkClick = (href: string) => {
    if (pathname !== href) {
        setIsNavigating(true);
        setTargetPath(href);
    }
  };

  if (!isMounted) {
    return <div className="h-screen w-full bg-background" />; // or a loading spinner
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
                    <NavButtonLink
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      currentPath={pathname}
                      targetPath={targetPath}
                      isNavigating={isNavigating}
                      onClick={() => handleLinkClick(item.href)}
                    />
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
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
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
              {isMobile && <MobileNav currentPath={pathname} targetPath={targetPath} isNavigating={isNavigating} handleLinkClick={handleLinkClick} />}
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
