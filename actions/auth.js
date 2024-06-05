'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Argon2id } from 'oslo/password';
import { generateId } from 'lucia';
import { lucia, validateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function login(_, formData) {
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

export async function logout() {
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

export async function signup(_, formData) {
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
