import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/lucia';

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();
  if (!user) return redirect('/login');
  return <>{children}</>;
}
