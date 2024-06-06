import Link from 'next/link';
import { redirect } from 'next/navigation';
import { signup } from '@/actions/auth.js';
import { validateRequest } from '@/lib/lucia';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Form from '@/components/Form';

export default async function Page() {
  const { user } = await validateRequest();
  if (user) return redirect('/');

  return (
    <>
      <h1 className="mb-2">Registrieren</h1>
      <Form action={signup}>
        <Label htmlFor="username">Benutzername</Label>
        <Input name="username" id="username" />
        <Label htmlFor="password">Passwort</Label>
        <Input type="password" name="password" id="password" />

        <Label htmlFor="password">Passwort bestätigen</Label>
        <Input
          type="password"
          name="confirm_password"
          id="confirm_password"
        />
        <Button className="mt-2">Account erstellen</Button>
      </Form>
      <Link href="/login" className="self-end">
        Anmelden
      </Link>
    </>
  );
}
