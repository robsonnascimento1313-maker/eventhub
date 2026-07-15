import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getSession } from '../services/auth';
import { getPedidos, enviarProposta, seedOnce, Pedido } from '../services/store';
import { categoryById, formatBRL } from '../services/catalog';
import Icon from '../components/Icon';

export default function OportunidadesPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [role, setRole] = useState<string>('');
  const [active, setActive] = useState<Pedido | null>(null);
  const [price, setPrice] = useState('');
  const [toast, setToast] = useState('');

  function refresh() {
    setPedidos(getPedidos().filter((p) => p.status === 'pendente'));
  }

  useEffect(() => {
    seedOnce();
    setRole(getSession().user?.role ?? '');
    refresh();
  }, []);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!active) return;
    enviarProposta(active.id, Number(price) || 0);
    setActive(null);
    setPrice('');
    setToast('✅ Proposta enviada! A empresa vai comparar e responder.');
    setTimeout(() => setToast(''), 4000);
    refresh();
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Oportunidades</h1>
          <p className="text-gray-500 mt-1">
            Leads de empresas prontas para contratar. Responda rápido para ganhar o contrato.
          </p>
        </div>

        {role && role !== 'fornecedor' && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm">
            💡 Esta é a tela do <b>fornecedor</b>. Você está logado como <b>{role}</b> — crie uma conta com o tipo
            &quot;Fornecedor&quot; para viver essa experiência completa.
          </div>
        )}

        {pedidos.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {pedidos.map((p) => {
              const cat = categoryById(p.categoryId);
              return (
                <div key={p.id} className="bg-white rounded-2xl border border-gray-200/70 shadow-sm p-5">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${cat?.color ?? 'bg-gray-100'}`}>
                      {cat && <Icon name={cat.icon} size={22} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-gray-900 truncate">{p.eventName}</h3>
                        <span className="shrink-0 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold">
                          Novo lead
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{cat?.name}</p>
                    </div>
                  </div>

                  {p.details && <p className="text-sm text-gray-600 mt-3">{p.details}</p>}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
                    {p.date && <span className="inline-flex items-center gap-1"><Icon name="calendar" size={13} /> {new Date(p.date).toLocaleDateString('pt-BR')}</span>}
                    {p.guests > 0 && <span className="inline-flex items-center gap-1"><Icon name="users" size={13} /> {p.guests} convidados</span>}
                    <span className="inline-flex items-center gap-1"><Icon name="message" size={13} /> {p.proposals} concorrente(s)</span>
                  </div>

                  <button
                    onClick={() => { setActive(p); setPrice(p.amount ? String(p.amount) : ''); }}
                    className="mt-4 w-full py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition"
                  >
                    {p.amount > 0 ? 'Atualizar proposta' : 'Enviar proposta'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-12 text-center">
            <span className="inline-flex text-gray-300"><Icon name="zap" size={44} strokeWidth={1.5} /></span>
            <h3 className="text-lg font-semibold text-gray-700 mt-4">Nenhum lead aberto agora</h3>
            <p className="text-gray-400 text-sm mt-2">
              Quando uma empresa solicitar um orçamento, o pedido aparece aqui na hora.
            </p>
          </div>
        )}
      </div>

      {/* Modal de proposta */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setActive(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900">Enviar proposta</h3>
                <p className="text-sm text-gray-400">{active.eventName}</p>
              </div>
              <button onClick={() => setActive(null)} className="text-gray-400 hover:text-gray-600"><Icon name="x" size={20} /></button>
            </div>
            <form onSubmit={handleSend} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor da proposta (R$)</label>
                <input
                  type="number"
                  autoFocus
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ex.: 12000"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Repasse estimado (após 10% da plataforma): {formatBRL((Number(price) || 0) * 0.9)}
                </p>
              </div>
              <button type="submit" className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition">
                Enviar proposta
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm z-50">
          {toast}
        </div>
      )}
    </Layout>
  );
}
