import Link from 'next/link';

import { prisma } from '@/lib/prisma';
import { Argon2id } from 'oslo/password';
import { cookies } from 'next/headers';
import { lucia, validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Form from '@/components/Form';

export default async function Page() {
  const { user } = await validateRequest();
  if (user) {
    return redirect('/');
  }
  return (
    <>
      <h1 className="mb-2">Anmelden</h1>
      <Form action={login}>
        <label htmlFor="username" className="block">
          Benutzername
        </label>
        <input name="username" id="username" />
        <br />
        <label htmlFor="password" className="block">
          Passwort
        </label>
        <input type="password" name="password" id="password" />
        <br />
        <button className="mt-2">Weiter</button>
      </Form>
      <Link href="/signup" className="self-end">
        Registrieren
      </Link>
    </>
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
