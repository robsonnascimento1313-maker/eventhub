import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getSession, User } from '../services/auth';

const stats = [
  { label: 'Eventos Ativos',    value: '0', icon: '🎯', color: 'bg-blue-50 text-blue-700' },
  { label: 'Fornecedores',      value: '0', icon: '🏢', color: 'bg-purple-50 text-purple-700' },
  { label: 'Pedidos Pendentes', value: '0', icon: '📋', color: 'bg-yellow-50 text-yellow-700' },
  { label: 'Receita Total',     value: 'R$ 0', icon: '💰', color: 'bg-green-50 text-green-700' },
];

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { user } = getSession();
    setUser(user);
  }, []);

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Olá, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Bem-vindo ao EventHub. Aqui está um resumo da sua plataforma.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats.map((s) => (
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Próximos Eventos</h2>
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <span className="text-4xl mb-3">🎯</span>
              <p className="text-sm">Nenhum evento cadastrado ainda.</p>
              <button className="mt-4 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition">
                Criar primeiro evento
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Últimos Pedidos</h2>
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <span className="text-4xl mb-3">📋</span>
              <p className="text-sm">Nenhum pedido registrado ainda.</p>
              <button className="mt-4 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition">
                Solicitar serviço
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
