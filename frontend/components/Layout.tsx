import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Topbar from './Topbar';
import { getSession } from '../services/auth';

interface LayoutProps {
  children: React.ReactNode;
  /** Marketplace usa largura total (grid + mapa); páginas normais ficam contidas. */
  full?: boolean;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const { token } = getSession();
    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-ground">
      <Topbar />
      <main className="flex-1 min-h-0">{children}</main>
    </div>
  );
}
