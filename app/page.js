import { lucia, validateRequest } from '@/lib/auth';
import { Form } from '@/components/form';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

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

async function logout() {
  'use server';
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: 'Unauthorized',
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect('/login');
}
