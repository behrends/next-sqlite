import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';

// TODO: show other data
import Users from '@/components/Users';

export default async function Home() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect('/login');
  }
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="mb-4">Hi, {user.username}!</h1>
      <p>Die User ID ist {user.id}.</p>
    </main>
  );
}
