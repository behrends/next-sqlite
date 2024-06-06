'use client';

import { useFormStatus } from 'react-dom';
import { Loader } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';

export default function SubmitButton({
  children,
  ...props
}: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? <Loader className="animate-spin" /> : children}
    </Button>
  );
}
