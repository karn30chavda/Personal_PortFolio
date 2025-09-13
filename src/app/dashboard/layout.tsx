
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Info, LogOut, ExternalLink, Menu } from 'lucide-react';
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
];

function MobileNav() {
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
                    <DropdownMenuItem key={item.label} asChild>
                        <Link href={item.href}>
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/" target="_blank">
                        <ExternalLink />
                        <span>Go to Site</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <form action={logout} className="w-full">
                        <button type="submit" className="w-full flex items-center text-red-500">
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
  const isMobile = useIsMobile();

  if (isMobile === null) {
    return <div className="h-screen w-full bg-background" />; // or a loading spinner
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        {!isMobile && (
          <Sidebar>
            <SidebarHeader>
              <Link href="/" className="text-xl font-bold text-primary font-headline group-data-[collapsible=icon]:hidden">
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
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <div className="flex flex-col gap-2">
                  <Link href="/" target="_blank" legacyBehavior passHref>
                      <Button variant="outline" className="w-full justify-start">
                          <ExternalLink />
                          <span className="group-data-[collapsible=icon]:hidden">Go to Site</span>
                      </Button>
                  </Link>
                  <form action={logout}>
                      <Button variant="ghost" className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-500">
                          <LogOut />
                          <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                      </Button>
                  </form>
              </div>
            </SidebarFooter>
          </Sidebar>
        )}
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
            <div className='flex items-center gap-2'>
              {isMobile ? (
                  <Link href="/" className="text-xl font-bold text-primary font-headline">
                      Karan Chavda
                  </Link>
              ) : (
                  <SidebarTrigger />
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <ThemeToggleButton />
              {isMobile && <MobileNav />}
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
