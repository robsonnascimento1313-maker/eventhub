import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ProviderCard from '../components/ProviderCard';
import SolicitarModal from '../components/SolicitarModal';
import Icon from '../components/Icon';
import {
  providers, categories, Provider,
  responseHours, isFastResponder,
} from '../services/catalog';

type SortKey = 'relevancia' | 'resposta' | 'avaliacao' | 'preco';

export default function FornecedoresPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string>('todos');
  const [fastOnly, setFastOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>('relevancia');
  const [selected, setSelected] = useState<Provider | null>(null);
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
    // Relevância premia quem responde rápido (modelo Thumbtack Top Pro),
    // depois destaque e nota.
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
      <div className="p-8 max-w-7xl">
        <div className="mb-7">
          <h1 className="text-[28px] font-extrabold text-gray-50 tracking-tight">
            Encontre o fornecedor certo
          </h1>
          <p className="text-gray-400 mt-1.5">
            {providers.length} fornecedores verificados · quem responde rápido aparece primeiro
          </p>
        </div>

        {/* Busca */}
        <div className="relative mb-5">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="search" size={18} /></span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busque por serviço, ex.: buffet, DJ, decoração..."
            className="w-full pl-11 pr-4 py-3.5 bg-surface border border-edge rounded-2xl text-sm shadow-card focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          <button
            onClick={() => setFastOnly(!fastOnly)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-bold transition flex items-center gap-1.5 ${
              fastOnly
                ? 'bg-amber-400 text-amber-950 shadow-sm'
                : 'bg-surface border border-amber-400/30 text-amber-300 hover:bg-amber-400/10'
            }`}
          >
            <Icon name="bolt" size={13} filled strokeWidth={0} /> Resposta rápida
          </button>
          <span className="shrink-0 w-px bg-edge my-1" />
          <button
            onClick={() => setActiveCat('todos')}
            className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold transition ${
              activeCat === 'todos' ? 'bg-gray-100 text-gray-900' : 'bg-surface border border-edge text-gray-300 hover:border-gray-500'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold transition flex items-center gap-1.5 ${
                activeCat === cat.id ? 'bg-gray-100 text-gray-900' : 'bg-surface border border-edge text-gray-300 hover:border-gray-500'
              }`}
            >
              <Icon name={cat.icon} size={14} /> {cat.name}
            </button>
          ))}
        </div>

        {/* Ordenação + contagem */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-400 tabular">{list.length} resultado(s)</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Ordenar por:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-surface border border-edge rounded-lg px-2.5 py-1.5 text-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="relevancia">Relevância</option>
              <option value="resposta">Resposta mais rápida</option>
              <option value="avaliacao">Melhor avaliação</option>
              <option value="preco">Menor preço</option>
            </select>
          </div>
        </div>

        {/* Grid de fornecedores */}
        {list.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {list.map((p, i) => (
              <div key={p.id} className="animate-up" style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}>
                <ProviderCard provider={p} onSolicitar={setSelected} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-2xl border border-edge shadow-card p-12 text-center">
            <span className="inline-flex text-gray-600"><Icon name="search" size={40} strokeWidth={1.5} /></span>
            <p className="text-gray-400 mt-3">Nenhum fornecedor encontrado para esta busca.</p>
          </div>
        )}
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
