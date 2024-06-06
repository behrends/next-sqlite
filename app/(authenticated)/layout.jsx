import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/lucia';

export default async function AuthenticatedLayout({ children }) {
  const { user } = await validateRequest();
  if (!user) return redirect('/login');
  return <>{children}</>;
}
