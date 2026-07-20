import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import ProviderCard from '../components/ProviderCard';
import SolicitarModal from '../components/SolicitarModal';
import Icon from '../components/Icon';
import {
  providers, categories, Provider,
  responseHours, isFastResponder,
} from '../services/catalog';

const ProviderMap = dynamic(() => import('../components/ProviderMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-ground flex items-center justify-center text-gray-500 text-sm">
      Carregando mapa…
    </div>
  ),
});

type SortKey = 'relevancia' | 'resposta' | 'avaliacao' | 'preco';

export default function FornecedoresPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string>('todos');
  const [fastOnly, setFastOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>('relevancia');
  const [selected, setSelected] = useState<Provider | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const list = useMemo(() => {
    let result = providers.filter((p) => {
      const matchCat = activeCat === 'todos' || p.categoryId === activeCat;
      const matchFast = !fastOnly || isFastResponder(p);
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchCat && matchFast && matchQuery;
    });
    if (sort === 'relevancia') {
      result = [...result].sort((a, b) =>
        responseHours(a) - responseHours(b) ||
        Number(b.featured) - Number(a.featured) ||
        b.rating - a.rating,
      );
    }
    if (sort === 'resposta') result = [...result].sort((a, b) => responseHours(a) - responseHours(b));
    if (sort === 'avaliacao') result = [...result].sort((a, b) => b.rating - a.rating);
    if (sort === 'preco') result = [...result].sort((a, b) => a.priceFrom - b.priceFrom);
    return result;
  }, [query, activeCat, fastOnly, sort]);

  function handleSuccess() {
    setSelected(null);
    setToast('Solicitação enviada! Acompanhe em Pedidos.');
    setTimeout(() => setToast(''), 4000);
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Barra de busca + filtros (sticky) */}
        <div className="shrink-0 border-b border-edge bg-ground/95 backdrop-blur px-5 py-3 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="search" size={18} /></span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busque por serviço, ex.: buffet, DJ, decoração..."
                className="w-full pl-11 pr-4 py-2.5 bg-surface border border-edge rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="shrink-0 bg-surface border border-edge rounded-xl px-3 py-2.5 text-sm text-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="relevancia">Relevância</option>
              <option value="resposta">Resposta mais rápida</option>
              <option value="avaliacao">Melhor avaliação</option>
              <option value="preco">Menor preço</option>
            </select>
          </div>

          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFastOnly(!fastOnly)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-bold transition flex items-center gap-1.5 ${
                fastOnly ? 'bg-amber-400 text-amber-950' : 'bg-surface border border-amber-400/30 text-amber-300 hover:bg-amber-400/10'
              }`}
            >
              <Icon name="bolt" size={13} filled strokeWidth={0} /> Resposta rápida
            </button>
            <span className="shrink-0 w-px bg-edge my-1" />
            <button
              onClick={() => setActiveCat('todos')}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition ${
                activeCat === 'todos' ? 'bg-gray-100 text-gray-900' : 'bg-surface border border-edge text-gray-300 hover:border-gray-500'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition flex items-center gap-1.5 ${
                  activeCat === cat.id ? 'bg-gray-100 text-gray-900' : 'bg-surface border border-edge text-gray-300 hover:border-gray-500'
                }`}
              >
                <Icon name={cat.icon} size={14} /> {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Split: grid (esq) + mapa (dir) */}
        <div className="flex-1 flex min-h-0">
          <div className="w-full lg:w-[57%] overflow-y-auto px-5 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-extrabold text-gray-50">
                {list.length} fornecedor(es) <span className="text-gray-400 font-medium">em São Paulo e região</span>
              </h1>
            </div>

            {list.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {list.map((p, i) => (
                  <div key={p.id} className="animate-up" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                    <ProviderCard provider={p} onSolicitar={setSelected} onHover={setHoverId} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface rounded-2xl border border-edge p-12 text-center">
                <span className="inline-flex text-gray-600"><Icon name="search" size={40} strokeWidth={1.5} /></span>
                <p className="text-gray-400 mt-3">Nenhum fornecedor encontrado para esta busca.</p>
              </div>
            )}
          </div>

          {/* Mapa */}
          <div className="hidden lg:block lg:w-[43%] border-l border-edge relative">
            <ProviderMap providers={list} activeId={hoverId} />
          </div>
        </div>
      </div>

      {selected && (
        <SolicitarModal
          provider={selected}
          onClose={() => setSelected(null)}
          onSuccess={handleSuccess}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-surface-3 border border-edge text-white px-5 py-3.5 rounded-2xl shadow-card-hover text-sm flex items-center gap-3 z-50">
          <Icon name="check-circle" size={16} className="text-emerald-400" /> {toast}
          <button onClick={() => router.push('/pedidos')} className="underline text-primary-300 font-semibold">
            Ver pedidos
          </button>
        </div>
      )}
    </Layout>
  );
}
