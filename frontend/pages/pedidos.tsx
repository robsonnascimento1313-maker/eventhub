import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { getPedidos, updatePedidoStatus, seedOnce, Pedido, PedidoStatus } from '../services/store';
import { categoryById, providerById, formatBRL } from '../services/catalog';
import Icon from '../components/Icon';

const filters: { key: string; label: string }[] = [
  { key: 'todos',      label: 'Todos' },
  { key: 'pendente',   label: 'Pendente' },
  { key: 'confirmado', label: 'Confirmado' },
  { key: 'concluido',  label: 'Concluído' },
  { key: 'cancelado',  label: 'Cancelado' },
];

const statusStyle: Record<string, string> = {
  pendente:   'bg-amber-400/10 text-amber-300',
  confirmado: 'bg-emerald-400/10 text-emerald-300',
  concluido:  'bg-sky-400/10 text-sky-300',
  cancelado:  'bg-surface-3 text-gray-400',
};

export default function PedidosPage() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [active, setActive] = useState('todos');

  function refresh() {
    setPedidos(getPedidos());
  }

  useEffect(() => {
    seedOnce();
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
            <h1 className="text-2xl font-bold text-gray-100">Meus pedidos</h1>
            <p className="text-gray-400 mt-1">Acompanhe solicitações, propostas e contratações</p>
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
                  active === f.key ? 'bg-primary-600 text-white' : 'bg-surface border border-edge text-gray-300 hover:border-primary-500'
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
                <div key={p.id} className="bg-surface rounded-xl border border-edge-soft shadow-sm p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${cat?.color ?? 'bg-surface-3'}`}>
                      {cat && <Icon name={cat.icon} size={22} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-100">{p.providerName}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusStyle[p.status]}`}>
                          {p.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-0.5">{p.eventName}</p>
                      {p.details && <p className="text-sm text-gray-400 mt-2">{p.details}</p>}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
                        {p.date && <span className="inline-flex items-center gap-1"><Icon name="calendar" size={13} /> {new Date(p.date).toLocaleDateString('pt-BR')}</span>}
                        {p.guests > 0 && <span className="inline-flex items-center gap-1"><Icon name="users" size={13} /> {p.guests} convidados</span>}
                        <span className="inline-flex items-center gap-1"><Icon name="message" size={13} /> {p.proposals} proposta(s) recebida(s)</span>
                        {p.amount > 0 && <span className="text-gray-200 font-semibold">{formatBRL(p.amount)}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Ações por status */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-edge-soft">
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
                          className="px-4 py-2 bg-surface border border-edge text-gray-400 text-sm rounded-lg hover:bg-white/5 transition"
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
                          className="px-4 py-2 bg-surface border border-edge text-gray-300 text-sm rounded-lg hover:bg-white/5 transition"
                        >
                          Marcar como concluído
                        </button>
                      </>
                    )}
                    {p.status === 'concluido' && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-400"><Icon name="check-circle" size={15} /> Serviço concluído</span>
                    )}
                    {p.status === 'cancelado' && (
                      <button
                        onClick={() => handleStatus(p, 'pendente')}
                        className="px-4 py-2 bg-surface border border-edge text-gray-300 text-sm rounded-lg hover:bg-white/5 transition"
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
          <div className="bg-surface rounded-xl shadow-sm border border-edge-soft p-12 text-center">
            <span className="inline-flex text-gray-600"><Icon name="clipboard" size={44} strokeWidth={1.5} /></span>
            <h3 className="text-lg font-semibold text-gray-200 mt-4">Nenhum pedido aqui</h3>
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
