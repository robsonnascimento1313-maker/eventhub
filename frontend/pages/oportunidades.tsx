import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getSession } from '../services/auth';
import {
  getPedidos, enviarProposta, seedOnce, Pedido,
  isLeadOpen, proposalsLeft, timeAgo, MAX_PROPOSALS,
} from '../services/store';
import { categoryById, formatBRL } from '../services/catalog';
import Icon from '../components/Icon';

export default function OportunidadesPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [role, setRole] = useState<string>('');
  const [active, setActive] = useState<Pedido | null>(null);
  const [price, setPrice] = useState('');
  const [toast, setToast] = useState('');

  function refresh() {
    // "Leads Justos": só leads abertos (pendentes, no prazo e com vaga).
    setPedidos(getPedidos().filter(isLeadOpen));
  }

  useEffect(() => {
    seedOnce();
    setRole(getSession().user?.role ?? '');
    refresh();
  }, []);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!active) return;
    const ok = enviarProposta(active.id, Number(price) || 0);
    setActive(null);
    setPrice('');
    setToast(ok
      ? '✅ Proposta enviada! A empresa vai comparar e responder.'
      : '⚠️ Este lead acabou de fechar (limite de propostas atingido).');
    setTimeout(() => setToast(''), 4000);
    refresh();
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-50">Oportunidades</h1>
          <p className="text-gray-400 mt-1">
            Leads de empresas prontas para contratar. Responda rápido para ganhar o contrato.
          </p>
        </div>

        {/* Regras "Leads Justos" — nosso diferencial vs. o modelo de moedas */}
        <div className="mb-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-300 bg-surface border border-edge rounded-xl px-4 py-3">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="check-circle" size={14} className="text-emerald-400" />
            Responder é <b className="text-gray-100">grátis</b> — só paga 10% se fechar
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="users" size={14} className="text-primary-300" />
            Máx. <b className="text-gray-100">{MAX_PROPOSALS} propostas</b> por lead
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="bolt" size={14} filled strokeWidth={0} className="text-amber-400" />
            Leads expiram em 72h — sem lead "morto"
          </span>
        </div>

        {role && role !== 'fornecedor' && (
          <div className="mb-6 p-4 bg-amber-400/10 border border-amber-400/25 text-amber-200 rounded-xl text-sm">
            💡 Esta é a tela do <b>fornecedor</b>. Você está logado como <b>{role}</b> — crie uma conta com o tipo
            &quot;Fornecedor&quot; para viver essa experiência completa.
          </div>
        )}

        {pedidos.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {pedidos.map((p) => {
              const cat = categoryById(p.categoryId);
              return (
                <div key={p.id} className="bg-surface rounded-2xl border border-edge shadow-sm p-5">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${cat?.color ?? 'bg-surface-3'}`}>
                      {cat && <Icon name={cat.icon} size={22} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-gray-50 truncate">{p.eventName}</h3>
                        {(() => {
                          const left = proposalsLeft(p);
                          const scarce = left <= 2;
                          return (
                            <span className={`shrink-0 text-xs px-2 py-1 rounded-full font-bold ${
                              scarce ? 'bg-rose-500/15 text-rose-300' : 'bg-emerald-400/10 text-emerald-300'
                            }`}>
                              {left} vaga{left !== 1 ? 's' : ''} restante{left !== 1 ? 's' : ''}
                            </span>
                          );
                        })()}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {cat?.name} · <span className="text-gray-500">postado {timeAgo(p.createdAt)}</span>
                      </p>
                    </div>
                  </div>

                  {p.details && <p className="text-sm text-gray-300 mt-3">{p.details}</p>}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
                    {p.date && <span className="inline-flex items-center gap-1"><Icon name="calendar" size={13} /> {new Date(p.date).toLocaleDateString('pt-BR')}</span>}
                    {p.guests > 0 && <span className="inline-flex items-center gap-1"><Icon name="users" size={13} /> {p.guests} convidados</span>}
                    <span className="inline-flex items-center gap-1"><Icon name="message" size={13} /> {p.proposals}/{MAX_PROPOSALS} propostas</span>
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
          <div className="bg-surface rounded-xl shadow-sm border border-edge p-12 text-center">
            <span className="inline-flex text-gray-600"><Icon name="zap" size={44} strokeWidth={1.5} /></span>
            <h3 className="text-lg font-semibold text-gray-200 mt-4">Nenhum lead aberto agora</h3>
            <p className="text-gray-400 text-sm mt-2">
              Quando uma empresa solicitar um orçamento, o pedido aparece aqui na hora.
            </p>
          </div>
        )}
      </div>

      {/* Modal de proposta */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setActive(null)}>
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-edge-soft">
              <div>
                <h3 className="font-bold text-gray-50">Enviar proposta</h3>
                <p className="text-sm text-gray-400">{active.eventName}</p>
              </div>
              <button onClick={() => setActive(null)} className="text-gray-400 hover:text-gray-300"><Icon name="x" size={20} /></button>
            </div>
            <form onSubmit={handleSend} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Valor da proposta (R$)</label>
                <input
                  type="number"
                  autoFocus
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ex.: 12000"
                  className="w-full px-3 py-2.5 bg-surface-3 border border-edge rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
        <div className="fixed bottom-6 right-6 bg-surface-3 text-white px-5 py-3 rounded-xl shadow-lg text-sm z-50">
          {toast}
        </div>
      )}
    </Layout>
  );
}
