import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Stars from '../../components/Stars';
import Icon from '../../components/Icon';
import SolicitarModal from '../../components/SolicitarModal';
import { providerById, categoryById, reviewsFor, profileLabel, formatBRL, isTopResponder } from '../../services/catalog';

export default function ProviderProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState('');

  const provider = typeof id === 'string' ? providerById(id) : undefined;

  if (!provider) {
    return (
      <Layout>
        <div className="p-8">
          <button onClick={() => router.push('/fornecedores')} className="text-sm text-primary-400 hover:underline">
            ← Voltar
          </button>
          <div className="bg-surface rounded-xl border border-edge-soft p-12 text-center mt-6">
            <p className="text-gray-400">Fornecedor não encontrado.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const category = categoryById(provider.categoryId);
  const reviews = reviewsFor(provider);

  return (
    <Layout>
      <div className="p-8 max-w-5xl">
        <button onClick={() => router.push('/fornecedores')} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-100 mb-5">
          <Icon name="arrow-right" size={15} className="rotate-180" /> Voltar para fornecedores
        </button>

        {/* Cabeçalho */}
        <div className="bg-surface rounded-2xl border border-edge shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 ${category?.color ?? 'bg-surface-3'}`}>
              {category && <Icon name={category.icon} size={38} />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-50">{provider.name}</h1>
                {provider.verified && (
                  <span className="inline-flex items-center gap-1 text-xs bg-primary-400/10 text-primary-300 px-2 py-0.5 rounded-full font-semibold border border-primary-400/20">
                    <Icon name="check" size={12} strokeWidth={3} /> Verificado
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs bg-surface-3 text-gray-300 px-2 py-0.5 rounded-full font-medium">
                  <Icon name={provider.profileType === 'empresa' ? 'building' : 'user'} size={12} />
                  {profileLabel(provider.profileType)}
                </span>
                {isTopResponder(provider) && (
                  <span className="inline-flex items-center gap-1 text-xs bg-amber-400/15 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-400/30">
                    <Icon name="bolt" size={11} filled strokeWidth={0} /> Top resposta
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Stars rating={provider.rating} size="md" />
                <span className="text-sm text-gray-400">({provider.reviews} avaliações)</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm text-gray-400">
                <span className="inline-flex items-center gap-1"><Icon name="pin" size={15} /> {provider.location}</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <Icon name="bolt" size={13} filled strokeWidth={0} /> {provider.responseTime.replace('responde em ', '')}
                </span>
                <span className="inline-flex items-center gap-1"><Icon name="check-circle" size={15} /> {provider.completedJobs} serviços realizados</span>
                <span className="inline-flex items-center gap-1"><Icon name="calendar" size={15} /> desde {provider.since}</span>
              </div>
            </div>

            <div className="sm:text-right sm:pl-4 sm:border-l sm:border-edge-soft">
              <p className="text-xs text-gray-400">a partir de</p>
              <p className="text-2xl font-bold text-gray-50 tabular">{formatBRL(provider.priceFrom)}</p>
              <button
                onClick={() => setModal(true)}
                className="mt-3 w-full sm:w-auto px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition"
              >
                Solicitar orçamento
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sobre */}
            <section className="bg-surface rounded-2xl border border-edge shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-50 mb-3">Sobre</h2>
              <p className="text-sm text-gray-300 leading-relaxed">{provider.about}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {provider.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-ground text-gray-300 px-2.5 py-1 rounded-full border border-edge-soft">{tag}</span>
                ))}
              </div>
            </section>

            {/* Portfólio (placeholders) */}
            <section className="bg-surface rounded-2xl border border-edge shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-50 mb-3">Portfólio</h2>
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`aspect-[4/3] rounded-xl flex items-center justify-center ${category?.color ?? 'bg-surface-3'} opacity-80`}>
                    {category && <Icon name={category.icon} size={26} />}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">Fotos reais do portfólio serão exibidas aqui quando o fornecedor publicar seus trabalhos.</p>
            </section>

            {/* Avaliações */}
            <section className="bg-surface rounded-2xl border border-edge shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-50 mb-4">Avaliações ({provider.reviews})</h2>
              <div className="space-y-4">
                {reviews.map((r, i) => (
                  <div key={i} className="pb-4 border-b border-edge-soft last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-400/10 text-primary-300 flex items-center justify-center text-xs font-bold">
                          {r.author[0]}
                        </div>
                        <span className="text-sm font-medium text-gray-100">{r.author}</span>
                      </div>
                      <span className="text-xs text-gray-400">{r.date}</span>
                    </div>
                    <div className="mt-2"><Stars rating={r.rating} /></div>
                    <p className="text-sm text-gray-300 mt-1.5">{r.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Coluna lateral: serviços */}
          <div className="space-y-6">
            <section className="bg-surface rounded-2xl border border-edge shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-50 mb-4">Serviços e preços</h2>
              <div className="space-y-3">
                {provider.services.map((s) => (
                  <div key={s.name} className="flex items-center justify-between gap-3 pb-3 border-b border-edge-soft last:border-0 last:pb-0">
                    <span className="text-sm text-gray-300">{s.name}</span>
                    <span className="text-sm font-semibold text-gray-50 tabular whitespace-nowrap">{formatBRL(s.price)}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setModal(true)}
                className="mt-5 w-full py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition"
              >
                Solicitar orçamento
              </button>
              <p className="text-xs text-center text-gray-400 mt-2">Sem compromisso · resposta rápida</p>
            </section>
          </div>
        </div>
      </div>

      {modal && (
        <SolicitarModal
          provider={provider}
          onClose={() => setModal(false)}
          onSuccess={() => { setModal(false); setToast('✅ Solicitação enviada! Acompanhe em Pedidos.'); setTimeout(() => setToast(''), 4000); }}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-surface-3 text-white px-5 py-3 rounded-xl shadow-lg text-sm flex items-center gap-3 z-50">
          {toast}
          <button onClick={() => router.push('/pedidos')} className="underline text-primary-300">Ver pedidos</button>
        </div>
      )}
    </Layout>
  );
}
