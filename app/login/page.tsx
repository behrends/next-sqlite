import Link from 'next/link';
import { validateRequest } from '@/lib/lucia';
import { redirect } from 'next/navigation';
import { login } from '@/actions/auth.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Form from '@/components/Form';

export default async function Page() {
  const { user } = await validateRequest();
  if (user) return redirect('/');

  return (
    <>
      <h1 className="mb-2">Anmelden</h1>
      <Form action={login}>
        <Label htmlFor="username">Benutzername</Label>
        <Input name="username" id="username" />
        <Label htmlFor="password">Passwort</Label>
        <Input type="password" name="password" id="password" />
        <Button className="mt-2">Weiter</Button>
      </Form>
      <Link href="/signup" className="self-end">
        Registrieren
      </Link>
    </>
  );
}
