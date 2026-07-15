import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { clearSession, getSession, User } from '../services/auth';
import { configForRole } from '../services/roles';

export default function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getSession().user);
  }, []);

  const config = configForRole(user?.role);

  function handleLogout() {
    clearSession();
    router.push('/login');
  }

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen border-r border-slate-800">
      <div className="px-6 py-6 border-b border-slate-800">
        <h1 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
          <span className="text-primary-400">⚡</span> EventHub
        </h1>
        <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider">
          {config.label} · {config.tagline}
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {config.nav.map((item) => {
          const active = router.pathname === item.href;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-sm font-bold">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name ?? 'Usuário'}</p>
            <p className="text-xs text-slate-400 capitalize">{config.label}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left text-xs text-slate-400 hover:text-white transition-colors px-1"
        >
          Sair →
        </button>
      </div>
    </aside>
  );
}
