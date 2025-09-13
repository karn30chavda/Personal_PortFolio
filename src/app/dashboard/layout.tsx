
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Info, LogOut, ExternalLink } from 'lucide-react';
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
import { logout } from '@/lib/actions';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Profile', icon: <User /> },
  { href: '/dashboard/about', label: 'About Section', icon: <Info /> },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar collapsible="icon">
          <SidebarHeader className="p-4">
            <Link href="/" className="text-xl font-bold text-primary font-headline group-data-[collapsible=icon]:hidden">
              Karan Chavda
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-2">
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
          <SidebarFooter className="p-4 border-t border-border/20">
            <div className="flex flex-col gap-2">
                <Link href="/" target="_blank" legacyBehavior passHref>
                    <Button variant="outline" className="w-full justify-start gap-2">
                        <ExternalLink />
                        <span className="group-data-[collapsible=icon]:hidden">Go to Site</span>
                    </Button>
                </Link>
                <form action={logout}>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 hover:bg-red-500/10 hover:text-red-500">
                        <LogOut />
                        <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                    </Button>
                </form>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background/80 px-4 backdrop-blur-sm">
            <SidebarTrigger />
            {/* You can add user menu or other header items here for desktop */}
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
