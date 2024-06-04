import Link from 'next/link';

import { prisma } from '@/lib/prisma';
import { Argon2id } from 'oslo/password';
import { cookies } from 'next/headers';
import { lucia, validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Form from '@/components/Form';
import { generateId } from 'lucia';

export default async function Page() {
  const { user } = await validateRequest();
  if (user) {
    return redirect('/');
  }
  return (
    <>
      <h1 className="mb-2">Registrieren</h1>
      <Form action={signup}>
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
        <button className="mt-2">Account erstellen</button>
      </Form>
      <Link href="/login" className="self-end">
        Anmelden
      </Link>
    </>
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
