import Link from 'next/link';

import { redirect } from 'next/navigation';
import { signup } from '@/actions/auth.js';
import { validateRequest } from '@/lib/lucia';
import { Button } from '@/components/ui/button';
import Form from '@/components/Form';

export default async function Page() {
  const { user } = await validateRequest();
  if (user) return redirect('/');

  return (
    <>
      <h1 className="mb-2">Registrieren</h1>
      <Form action={signup}>
        <label htmlFor="username">Benutzername</label>
        <input name="username" id="username" className="block" />
        <label htmlFor="password">Passwort</label>
        <input
          type="password"
          name="password"
          id="password"
          className="block"
        />
        <label htmlFor="password">Passwort bestätigen</label>
        <input
          type="password"
          name="confirm_password"
          id="confirm_password"
          className="block"
        />
        <Button className="mt-2">Account erstellen</Button>
      </Form>
      <Link href="/login" className="self-end">
        Anmelden
      </Link>
    </>
  );
}
