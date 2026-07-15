import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Stars from '../components/Stars';
import { getSession, User } from '../services/auth';
import { seedOnce, getStats, getPedidos, Pedido } from '../services/store';
import { providers, categoryById, formatBRL } from '../services/catalog';

const statusStyle: Record<string, string> = {
  pendente:   'bg-amber-100 text-amber-700',
  confirmado: 'bg-emerald-100 text-emerald-700',
  concluido:  'bg-blue-100 text-blue-700',
  cancelado:  'bg-gray-100 text-gray-500',
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ eventos: 0, fornecedores: 0, pedidosPendentes: 0, receita: 0 });
  const [recent, setRecent] = useState<Pedido[]>([]);

  useEffect(() => {
    seedOnce();
    setUser(getSession().user);
    setStats(getStats());
    setRecent(getPedidos().slice(0, 4));
  }, []);

  const featured = providers.filter((p) => p.featured).slice(0, 3);

  const cards = [
    { label: 'Eventos Ativos',    value: String(stats.eventos),        icon: '🎯', color: 'bg-blue-50 text-blue-700' },
    { label: 'Fornecedores',      value: String(stats.fornecedores),   icon: '🏢', color: 'bg-violet-50 text-violet-700' },
    { label: 'Pedidos Pendentes', value: String(stats.pedidosPendentes),icon: '📋', color: 'bg-amber-50 text-amber-700' },
    { label: 'Receita Contratada',value: formatBRL(stats.receita),     icon: '💰', color: 'bg-emerald-50 text-emerald-700' },
  ];

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Olá, {user?.name?.split(' ')[0] ?? ''} 👋
          </h1>
          <p className="text-gray-500 mt-1">Aqui está o resumo da sua operação de eventos.</p>
        </div>

        {/* Hero CTA — ação principal (estilo Uber) */}
        <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-white text-lg font-bold">Precisa de um serviço para seu evento?</h2>
            <p className="text-primary-100 text-sm mt-1">Compare fornecedores e receba orçamentos em minutos.</p>
          </div>
          <button
            onClick={() => router.push('/fornecedores')}
            className="bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition whitespace-nowrap"
          >
            + Solicitar serviço
          </button>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {cards.map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-xl ${s.color} mb-3`}>
                {s.icon}
              </div>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pedidos recentes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Pedidos recentes</h2>
              <button onClick={() => router.push('/pedidos')} className="text-sm text-primary-600 hover:underline">
                Ver todos
              </button>
            </div>
            {recent.length > 0 ? (
              <div className="space-y-3">
                {recent.map((p) => {
                  const cat = categoryById(p.categoryId);
                  return (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cat?.color ?? 'bg-gray-100'}`}>
                        {cat?.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{p.providerName}</p>
                        <p className="text-xs text-gray-400 truncate">{p.eventName}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusStyle[p.status]}`}>
                        {p.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">Nenhum pedido ainda.</div>
            )}
          </div>

          {/* Fornecedores em destaque */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Fornecedores em destaque</h2>
              <button onClick={() => router.push('/fornecedores')} className="text-sm text-primary-600 hover:underline">
                Explorar
              </button>
            </div>
            <div className="space-y-3">
              {featured.map((p) => {
                const cat = categoryById(p.categoryId);
                return (
                  <div
                    key={p.id}
                    onClick={() => router.push('/fornecedores')}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cat?.color ?? 'bg-gray-100'}`}>
                      {cat?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <Stars rating={p.rating} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{formatBRL(p.priceFrom)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
