import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getPedidos, seedOnce, Pedido } from '../services/store';
import { categoryById, formatBRL } from '../services/catalog';
import Icon, { IconName } from '../components/Icon';

const PLATFORM_FEE = 0.1; // 10% de comissão da plataforma (split automático)

export default function PagamentosPage() {
  const [pagos, setPagos] = useState<Pedido[]>([]);

  useEffect(() => {
    seedOnce();
    const list = getPedidos().filter(
      (p) => (p.status === 'confirmado' || p.status === 'concluido') && p.amount > 0,
    );
    setPagos(list);
  }, []);

  const totalProcessado = pagos.reduce((s, p) => s + p.amount, 0);
  const totalTaxa = totalProcessado * PLATFORM_FEE;
  const totalRepasse = totalProcessado - totalTaxa;

  const cards: { label: string; value: string; color: string; icon: IconName }[] = [
    { label: 'Total Processado', value: formatBRL(totalProcessado), color: 'text-emerald-600', icon: 'card' },
    { label: 'Comissão EventHub (10%)', value: formatBRL(totalTaxa), color: 'text-blue-600', icon: 'building' },
    { label: 'Repasse a Fornecedores', value: formatBRL(totalRepasse), color: 'text-violet-600', icon: 'split' },
  ];

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Pagamentos</h1>
          <p className="text-gray-500 mt-1">Split automático via Stripe Connect — comissão retida e repasse ao fornecedor</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {cards.map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{s.label}</p>
                <span className={s.color}><Icon name={s.icon} size={20} /></span>
              </div>
              <p className={`text-2xl font-bold mt-2 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {pagos.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Transações</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-50">
                    <th className="px-6 py-3 font-medium">Fornecedor</th>
                    <th className="px-6 py-3 font-medium">Evento</th>
                    <th className="px-6 py-3 font-medium text-right">Valor</th>
                    <th className="px-6 py-3 font-medium text-right">Comissão</th>
                    <th className="px-6 py-3 font-medium text-right">Repasse</th>
                    <th className="px-6 py-3 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map((p) => {
                    const cat = categoryById(p.categoryId);
                    const fee = p.amount * PLATFORM_FEE;
                    return (
                      <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${cat?.color ?? 'bg-gray-100'}`}>
                              {cat && <Icon name={cat.icon} size={14} />}
                            </span>
                            <span className="font-medium text-gray-700">{p.providerName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{p.eventName}</td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-800">{formatBRL(p.amount)}</td>
                        <td className="px-6 py-4 text-right text-blue-600">{formatBRL(fee)}</td>
                        <td className="px-6 py-4 text-right text-violet-600">{formatBRL(p.amount - fee)}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                            Pago
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <span className="inline-flex text-gray-300"><Icon name="card" size={44} strokeWidth={1.5} /></span>
            <h3 className="text-lg font-semibold text-gray-700 mt-4">Nenhum pagamento ainda</h3>
            <p className="text-gray-400 text-sm mt-2">
              Contrate um fornecedor (em Pedidos) para gerar uma transação com split automático.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
