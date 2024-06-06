import { LogOut } from 'lucide-react';
import { logout } from '@/actions/auth';
import { validateRequest } from '@/lib/lucia';
import { Button } from '@/components/ui/button';
import NavItems from '@/components/NavItems';

const authRoutes = [
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

const appRoutes = [
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
    <header className="sticky top-0 flex items-center h-16 border-b bg-background px-6">
      <nav className="flex items-center gap-2 text-sm font-medium">
        <NavItems routes={routes} />
        {user && (
          <form action={logout}>
            <Button variant="outline">
              {' '}
              Abmelden
              <LogOut className="ml-2 h-4 w-4" />
            </Button>
          </form>
        )}
      </nav>
    </header>
  );
}
