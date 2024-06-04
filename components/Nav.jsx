import Link from 'next/link';

const appRoutes = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
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

export default function Nav() {
  return (
    <header className="sticky top-0 flex items-center h-16 border-b bg-background px-6">
      <nav className="flex items-center gap-6 text-sm font-medium">
        {appRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {route.label}
          </Link>
        ))}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Abmelden
        </button>
      </nav>
    </header>
  );
}