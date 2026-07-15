import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession } from '../services/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const { token } = getSession();
    router.replace(token ? '/dashboard' : '/login');
  }, [router]);

  return null;
}
