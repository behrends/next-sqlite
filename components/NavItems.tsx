'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function NavItems({
  routes,
}: {
  routes: {
    href: string;
    label: string;
  }[]; // TODO: use Route type from Nav.tsx
}) {
  const pathname = usePathname();
  return (
    <>
      {routes.map((route) => {
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'transition-colors hover:text-foreground px-2 py-1 hover:bg-blue-50 hover:no-underline',
              {
                'border-b-2 border-blue-500': route.href === pathname,
              }
            )}
          >
            {route.label}
          </Link>
        );
      })}
    </>
  );
}
