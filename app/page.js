import Users from '@/components/Users';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl">Next.js with SQLite</h1>    
      <Users />
    </main>
  );
}
