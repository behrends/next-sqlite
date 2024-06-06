import Link from 'next/link';
import { logout } from '@/actions/auth';
import { validateRequest } from '@/lib/lucia';

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
      <nav className="flex items-center gap-6 text-sm font-medium">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {route.label}
          </Link>
        ))}
        {user && (
          <form action={logout}>
            <button>Abmelden</button>
          </form>
        )}
      </nav>
    </header>
  );
}
