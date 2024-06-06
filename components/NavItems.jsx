'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// TODO: use cn after including shadcn/ui
// import { cn } from '@/lib/utils';

export default function NavItems({ routes }) {
  const pathname = usePathname();
  return (
    <>
      {routes.map((route) => {
        // TODO: use cn (see above)
        let styles =
          'transition-colors hover:text-foreground px-2 py-1 hover:bg-blue-50 hover:no-underline';
        if (route.href === pathname) {
          styles =
            'transition-colors hover:text-foreground px-2 py-1 hover:bg-blue-50 hover:no-underline border-b-2 border-blue-500';
        }
        return (
          <Link key={route.href} href={route.href} className={styles}>
            {route.label}
          </Link>
        );
      })}
    </>
  );
}
