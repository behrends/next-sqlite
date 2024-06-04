'use client';

import { useFormState } from 'react-dom';

export default function Form({ children, action }) {
  const [state, formAction] = useFormState(action, {
    error: null,
  });
  return (
    <form action={formAction}>
      {children}
      <p>{state.error}</p>
    </form>
  );
}
