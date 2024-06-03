import Link from 'next/link';

import { prisma } from '@/lib/prisma';
import { Argon2id } from 'oslo/password';
import { cookies } from 'next/headers';
import { lucia, validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Form } from '@/components/form';
import { generateId } from 'lucia';

export default async function Page() {
  const { user } = await validateRequest();
  if (user) {
    return redirect('/');
  }
  return (
    <div className="m-4">
      <h1 className="text-2xl font-bold mb-4">Registrieren</h1>
      <Form action={signup}>
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
          Account erstellen
        </button>
      </Form>
      <Link href="/login" className="text-blue-500 hover:underline">
        Anmelden
      </Link>
    </div>
  );
}

async function signup(_, formData) {
  'use server';
  const username = formData.get('username');
  // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
  // keep in mind some database (e.g. mysql) are case insensitive
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

  const hashedPassword = await new Argon2id().hash(password);
  const userId = generateId(15);

  try {
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        username,
        password_hash: hashedPassword,
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (e) {
    console.log(e);
    if (e.code === 'P2002') {
      return {
        error: 'Benutzername bereits vergeben',
      };
    }
    return {
      error: 'Ein Fehler ist aufgetreten',
    };
  }
  return redirect('/');
}
