import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { clearSession, getSession, User } from '../services/auth';
import { configForRole } from '../services/roles';
import Icon from './Icon';

export default function Topbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    setUser(getSession().user);
  }, []);

  const config = configForRole(user?.role);

  function handleLogout() {
    clearSession();
    router.push('/login');
  }

  return (
    <header className="sticky top-0 z-40 bg-ink-900/90 backdrop-blur border-b border-edge">
      <div className="h-16 px-5 flex items-center gap-6">
        {/* Logo */}
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <Icon name="bolt" size={17} filled strokeWidth={0} className="text-white" />
          </span>
          <span className="text-[17px] font-extrabold tracking-tight text-white hidden sm:block">EventHub</span>
        </button>

        {/* Navegação horizontal (por papel) */}
        <nav className="flex items-center gap-1 overflow-x-auto flex-1">
          {config.nav.map((item) => {
            const active = router.pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  active ? 'bg-surface-3 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon name={item.icon} size={16} strokeWidth={active ? 2.25 : 2} />
                <span className="hidden md:block">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Conta */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMenu((v) => !v)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-full hover:bg-white/5 transition"
          >
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-sm font-bold text-white">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </span>
            <span className="hidden sm:block text-left leading-tight">
              <span className="block text-sm font-semibold text-white max-w-[120px] truncate">{user?.name ?? 'Usuário'}</span>
              <span className="block text-[11px] text-gray-400">{config.label}</span>
            </span>
          </button>

          {menu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenu(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-edge rounded-xl shadow-card-hover py-1 z-50">
                <div className="px-3 py-2 border-b border-edge-soft">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-[11px] text-gray-400">{config.label} · {config.tagline}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                >
                  <Icon name="logout" size={15} /> Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
