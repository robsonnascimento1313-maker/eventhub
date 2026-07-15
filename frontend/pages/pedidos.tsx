import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { getPedidos, updatePedidoStatus, Pedido, PedidoStatus } from '../services/store';
import { categoryById, providerById, formatBRL } from '../services/catalog';

const filters: { key: string; label: string }[] = [
  { key: 'todos',      label: 'Todos' },
  { key: 'pendente',   label: 'Pendente' },
  { key: 'confirmado', label: 'Confirmado' },
  { key: 'concluido',  label: 'Concluído' },
  { key: 'cancelado',  label: 'Cancelado' },
];

const statusStyle: Record<string, string> = {
  pendente:   'bg-amber-100 text-amber-700',
  confirmado: 'bg-emerald-100 text-emerald-700',
  concluido:  'bg-blue-100 text-blue-700',
  cancelado:  'bg-gray-100 text-gray-500',
};

export default function PedidosPage() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [active, setActive] = useState('todos');

  function refresh() {
    setPedidos(getPedidos());
  }

  useEffect(() => {
    refresh();
  }, []);

  const list = useMemo(
    () => (active === 'todos' ? pedidos : pedidos.filter((p) => p.status === active)),
    [pedidos, active],
  );

  function handleContratar(p: Pedido) {
    // Simula aceitar a melhor proposta: usa o preço base do fornecedor como valor cotado.
    const base = providerById(p.providerId)?.priceFrom ?? 0;
    const amount = p.amount || base + p.guests * 15;
    updatePedidoStatus(p.id, 'confirmado', amount);
    refresh();
  }

  function handleStatus(p: Pedido, status: PedidoStatus) {
    updatePedidoStatus(p.id, status);
    refresh();
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Meus pedidos</h1>
            <p className="text-gray-500 mt-1">Acompanhe solicitações, propostas e contratações</p>
          </div>
          <button
            onClick={() => router.push('/fornecedores')}
            className="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition"
          >
            + Novo pedido
          </button>
        </div>

        <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
          {filters.map((f) => {
            const count = f.key === 'todos' ? pedidos.length : pedidos.filter((p) => p.status === f.key).length;
            return (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  active === f.key ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-400'
                }`}
              >
                {f.label} {count > 0 && <span className="opacity-70">({count})</span>}
              </button>
            );
          })}
        </div>

        {list.length > 0 ? (
          <div className="space-y-4">
            {list.map((p) => {
              const cat = categoryById(p.categoryId);
              return (
                <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${cat?.color ?? 'bg-gray-100'}`}>
                      {cat?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-800">{p.providerName}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusStyle[p.status]}`}>
                          {p.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{p.eventName}</p>
                      {p.details && <p className="text-sm text-gray-400 mt-2">{p.details}</p>}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
                        {p.date && <span>📅 {new Date(p.date).toLocaleDateString('pt-BR')}</span>}
                        {p.guests > 0 && <span>👥 {p.guests} convidados</span>}
                        <span>💬 {p.proposals} proposta(s) recebida(s)</span>
                        {p.amount > 0 && <span className="text-gray-700 font-semibold">{formatBRL(p.amount)}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Ações por status */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-50">
                    {p.status === 'pendente' && (
                      <>
                        <button
                          onClick={() => handleContratar(p)}
                          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition"
                        >
                          Aceitar proposta e contratar
                        </button>
                        <button
                          onClick={() => handleStatus(p, 'cancelado')}
                          className="px-4 py-2 bg-white border border-gray-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50 transition"
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                    {p.status === 'confirmado' && (
                      <>
                        <button
                          onClick={() => router.push('/pagamentos')}
                          className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition"
                        >
                          Ir para pagamento
                        </button>
                        <button
                          onClick={() => handleStatus(p, 'concluido')}
                          className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition"
                        >
                          Marcar como concluído
                        </button>
                      </>
                    )}
                    {p.status === 'concluido' && (
                      <span className="text-sm text-gray-400">✓ Serviço concluído</span>
                    )}
                    {p.status === 'cancelado' && (
                      <button
                        onClick={() => handleStatus(p, 'pendente')}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition"
                      >
                        Reabrir pedido
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <span className="text-5xl">📋</span>
            <h3 className="text-lg font-semibold text-gray-700 mt-4">Nenhum pedido aqui</h3>
            <p className="text-gray-400 text-sm mt-2">Solicite um orçamento na vitrine de fornecedores.</p>
            <button
              onClick={() => router.push('/fornecedores')}
              className="mt-6 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition"
            >
              Explorar fornecedores
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
