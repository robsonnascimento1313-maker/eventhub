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

function StatCard({ value, label, icon, color }: { value: string; label: string; icon: string; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-5">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-xl ${color} mb-3`}>{icon}</div>
      <p className="text-2xl font-bold text-gray-900 tabular">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

// ---------------- Dashboard da EMPRESA ----------------
function EmpresaDashboard({ user }: { user: User | null }) {
  const router = useRouter();
  const [stats, setStats] = useState({ eventos: 0, fornecedores: 0, pedidosPendentes: 0, receita: 0 });
  const [recent, setRecent] = useState<Pedido[]>([]);

  useEffect(() => {
    setStats(getStats());
    setRecent(getPedidos().slice(0, 4));
  }, []);

  const featured = providers.filter((p) => p.featured).slice(0, 3);

  return (
    <>
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard value={String(stats.eventos)} label="Eventos Ativos" icon="📅" color="bg-blue-50 text-blue-700" />
        <StatCard value={String(stats.fornecedores)} label="Fornecedores" icon="🏢" color="bg-violet-50 text-violet-700" />
        <StatCard value={String(stats.pedidosPendentes)} label="Pedidos Pendentes" icon="📋" color="bg-amber-50 text-amber-700" />
        <StatCard value={formatBRL(stats.receita)} label="Receita Contratada" icon="💰" color="bg-emerald-50 text-emerald-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pedidos recentes</h2>
            <button onClick={() => router.push('/pedidos')} className="text-sm text-primary-600 hover:underline">Ver todos</button>
          </div>
          {recent.length > 0 ? (
            <div className="space-y-3">
              {recent.map((p) => {
                const cat = categoryById(p.categoryId);
                return (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cat?.color ?? 'bg-gray-100'}`}>{cat?.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.providerName}</p>
                      <p className="text-xs text-gray-400 truncate">{p.eventName}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusStyle[p.status]}`}>{p.status}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">Nenhum pedido ainda.</div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Fornecedores em destaque</h2>
            <button onClick={() => router.push('/fornecedores')} className="text-sm text-primary-600 hover:underline">Explorar</button>
          </div>
          <div className="space-y-3">
            {featured.map((p) => {
              const cat = categoryById(p.categoryId);
              return (
                <div key={p.id} onClick={() => router.push('/fornecedores')} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cat?.color ?? 'bg-gray-100'}`}>{cat?.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <Stars rating={p.rating} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 tabular">{formatBRL(p.priceFrom)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------- Dashboard do FORNECEDOR ----------------
function FornecedorDashboard() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    setPedidos(getPedidos());
  }, []);

  const abertas = pedidos.filter((p) => p.status === 'pendente');
  const fechados = pedidos.filter((p) => p.status === 'confirmado' || p.status === 'concluido');
  const faturamento = fechados.reduce((s, p) => s + p.amount * 0.9, 0); // repasse (90%)

  return (
    <>
      <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-lg font-bold">
            {abertas.length > 0 ? `${abertas.length} novo(s) lead(s) esperando sua proposta` : 'Nenhum lead aberto no momento'}
          </h2>
          <p className="text-amber-50 text-sm mt-1">Responda rápido — velocidade vira reputação e mais contratos.</p>
        </div>
        <button
          onClick={() => router.push('/oportunidades')}
          className="bg-white text-orange-700 font-semibold px-6 py-3 rounded-xl hover:bg-amber-50 transition whitespace-nowrap"
        >
          Ver oportunidades
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard value={String(abertas.length)} label="Leads abertos" icon="⚡" color="bg-amber-50 text-amber-700" />
        <StatCard value={String(fechados.length)} label="Contratos fechados" icon="✅" color="bg-emerald-50 text-emerald-700" />
        <StatCard value={String(pedidos.filter((p) => p.amount > 0).length)} label="Propostas enviadas" icon="📨" color="bg-blue-50 text-blue-700" />
        <StatCard value={formatBRL(faturamento)} label="Faturamento (repasse)" icon="💰" color="bg-violet-50 text-violet-700" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Leads recentes</h2>
          <button onClick={() => router.push('/oportunidades')} className="text-sm text-primary-600 hover:underline">Ver todos</button>
        </div>
        {abertas.length > 0 ? (
          <div className="space-y-3">
            {abertas.slice(0, 5).map((p) => {
              const cat = categoryById(p.categoryId);
              return (
                <div key={p.id} onClick={() => router.push('/oportunidades')} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cat?.color ?? 'bg-gray-100'}`}>{cat?.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.eventName}</p>
                    <p className="text-xs text-gray-400 truncate">{cat?.name} · {p.guests} convidados</p>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Responder</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 text-sm">Sem leads abertos agora. Volte em breve.</div>
        )}
      </div>
    </>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    seedOnce();
    setUser(getSession().user);
  }, []);

  const isFornecedor = user?.role === 'fornecedor';

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Olá, {user?.name?.split(' ')[0] ?? ''} 👋</h1>
          <p className="text-gray-500 mt-1">
            {isFornecedor ? 'Acompanhe seus leads e propostas.' : 'Aqui está o resumo da sua operação de eventos.'}
          </p>
        </div>
        {isFornecedor ? <FornecedorDashboard /> : <EmpresaDashboard user={user} />}
      </div>
    </Layout>
  );
}
