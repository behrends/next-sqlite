import Link from 'next/link';

import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { login } from '@/actions/auth.js';

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
        <label htmlFor="username">Benutzername</label>
        <input name="username" id="username" className="block" />
        <label htmlFor="password">Passwort</label>
        <input
          type="password"
          name="password"
          id="password"
          className="block"
        />
        <button className="mt-2">Weiter</button>
      </Form>
      <Link href="/signup" className="self-end">
        Registrieren
      </Link>
    </>
  );
}
