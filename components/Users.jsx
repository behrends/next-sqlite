import { prisma } from '@/lib/prisma';

export default async function Users() {
  const users = await prisma.user.findMany();
  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
}
