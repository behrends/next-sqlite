import { LogOut, Menu } from 'lucide-react';
import { logout } from '@/actions/auth';
import { validateRequest } from '@/lib/lucia';
import { Route } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import DarkModeToggle from '@/components/DarkModeToggle';
import NavItems from '@/components/NavItems';

const authRoutes: Route[] = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/login',
    label: 'Anmelden',
  },
  {
    href: '/signup',
    label: 'Registrieren',
  },
];

const appRoutes: Route[] = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
  },
];

export default async function Nav() {
  const { user } = await validateRequest();
  const routes = user ? appRoutes : authRoutes;
  return (
    <header className="sticky top-0 flex justify-between items-center h-16 border-b bg-background px-6">
      <nav className="hidden flex-col sm:flex sm:flex-row sm:items-center gap-2 text-sm font-medium">
        <NavItems routes={routes} />
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 sm:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">
              Navigationsmenü ein-/ausblenden
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 font-medium">
            <NavItems routes={routes} />
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex flex-1 flex-row  justify-end gap-2">
        {user && (
          <form action={logout}>
            <Button variant="outline">
              <span className="hidden sm:block">Abmelden</span>
              <LogOut className="sm:ml-2 h-[1.2rem] w-[1.2rem]" />
            </Button>
          </form>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
}
