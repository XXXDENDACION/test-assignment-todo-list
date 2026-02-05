import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/shared/api/auth/auth-options';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/tasks');
  } else {
    redirect('/login');
  }
}
