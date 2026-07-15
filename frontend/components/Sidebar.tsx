import { useRouter } from 'next/router';
import { clearSession, getSession } from '../services/auth';

const navItems = [
  { label: 'Dashboard',   href: '/dashboard',  icon: '📊' },
  { label: 'Eventos',     href: '/eventos',     icon: '🎯' },
  { label: 'Fornecedores',href: '/fornecedores',icon: '🏢' },
  { label: 'Pedidos',     href: '/pedidos',     icon: '📋' },
  { label: 'Pagamentos',  href: '/pagamentos',  icon: '💳' },
];

export default function Sidebar() {
  const router = useRouter();
  const { user } = typeof window !== 'undefined' ? getSession() : { user: null };

  function handleLogout() {
    clearSession();
    router.push('/login');
  }

  return (
    <aside className="w-64 bg-primary-900 text-white flex flex-col min-h-screen">
      <div className="px-6 py-6 border-b border-primary-700">
        <h1 className="text-xl font-bold tracking-tight">⚡ EventHub</h1>
        <p className="text-xs text-blue-300 mt-1">Plataforma corporativa</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = router.pathname === item.href;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary-600 text-white'
                  : 'text-blue-200 hover:bg-primary-700 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-primary-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-sm font-bold">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <p className="text-sm font-medium truncate">{user?.name ?? 'Usuário'}</p>
            <p className="text-xs text-blue-300 capitalize">{user?.role ?? ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left text-xs text-blue-300 hover:text-white transition-colors px-1"
        >
          Sair →
        </button>
      </div>
    </aside>
  );
}
