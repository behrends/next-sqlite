import Link from 'next/link';

import { prisma } from '@/lib/prisma';
import { Argon2id } from 'oslo/password';
import { cookies } from 'next/headers';
import { lucia, validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Form } from '@/components/form';

export default async function Page() {
  const { user } = await validateRequest();
  if (user) {
    return redirect('/');
  }
  return (
    <div className="m-4">
      <h1 className="text-2xl font-bold mb-4">Anmelden</h1>
      <Form action={login}>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Benutzername
        </label>
        <input
          name="username"
          id="username"
          className="mt-1 block w-300 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <br />
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Passwort
        </label>
        <input
          type="password"
          name="password"
          id="password"
          className="mt-1 block w-300 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <br />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Weiter
        </button>
      </Form>
      <Link href="/signup" className="text-blue-500 hover:underline">
        Registrieren
      </Link>
    </div>
  );
}

async function login(_, formData) {
  'use server';
  const username = formData.get('username');
  if (
    typeof username !== 'string' ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: 'Ungültiger Benutzername',
    };
  }
  const password = formData.get('password');
  if (
    typeof password !== 'string' ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: 'Ungültiges Passwort',
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });
  if (!existingUser) {
    return {
      error: 'Falscher Benutzername oder Passwort',
    };
  }

  const validPassword = await new Argon2id().verify(
    existingUser.password_hash,
    password
  );
  if (!validPassword) {
    return {
      error: 'Falscher Benutzername oder Passwort',
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect('/');
}
