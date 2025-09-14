
"use client";

import Link from 'next/link';
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
  isActive,
  isNavigating,
  onClick,
  isMobile = false,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  isNavigating: boolean;
  onClick: () => void;
  isMobile?: boolean;
}) {
  const isTarget = isNavigating && isActive;

  if (isMobile) {
    return (
      <Link href={href} onClick={onClick} className={cn("flex items-center gap-2 w-full", (isNavigating && !isTarget) && "opacity-50 pointer-events-none")}>
        {isTarget ? <Loader2 className="animate-spin" /> : icon}
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
        disabled={isNavigating && !isTarget}
        className={cn((isNavigating && !isTarget) && "opacity-50 pointer-events-none")}
      >
        {isTarget ? <Loader2 className="animate-spin" /> : icon}
        <span className="group-data-[state=collapsed]:hidden">{label}</span>
      </SidebarMenuButton>
    </Link>
  );
}

function MobileNav({ isNavigating, targetPath, handleLinkClick }: { isNavigating: boolean; targetPath: string; handleLinkClick: (href: string) => void; }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open Menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {navItems.map((item) => (
                    <DropdownMenuItem key={item.label} asChild disabled={isNavigating}>
                         <NavButtonLink
                            href={item.href}
                            label={item.label}
                            icon={item.icon}
                            isActive={targetPath === item.href}
                            isNavigating={isNavigating}
                            onClick={() => handleLinkClick(item.href)}
                            isMobile={true}
                        />
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <form action={logout} className="w-full">
                        <button type="submit" className="w-full flex items-center text-red-500 gap-2">
                            <LogOut />
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
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetPath, setTargetPath] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

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
                      isActive={targetPath === item.href || pathname === item.href}
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
              {isMobile && <MobileNav isNavigating={isNavigating} targetPath={targetPath} handleLinkClick={handleLinkClick} />}
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
