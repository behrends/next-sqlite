import { LogOut } from 'lucide-react';
import { logout } from '@/actions/auth';
import { validateRequest } from '@/lib/lucia';
import { Route } from '@/lib/types';
import { Button } from '@/components/ui/button';
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
      <nav className="flex items-center gap-2 text-sm font-medium">
        <NavItems routes={routes} />
      </nav>
      <div className="flex flex-row gap-2">
        {user && (
          <form action={logout}>
            <Button variant="outline">
              Abmelden
              <LogOut className="ml-2 h-4 w-4" />
            </Button>
          </form>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
}
