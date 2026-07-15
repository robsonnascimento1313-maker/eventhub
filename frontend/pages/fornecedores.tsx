import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ProviderCard from '../components/ProviderCard';
import SolicitarModal from '../components/SolicitarModal';
import Icon from '../components/Icon';
import { providers, categories, Provider } from '../services/catalog';

type SortKey = 'relevancia' | 'avaliacao' | 'preco';

export default function FornecedoresPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string>('todos');
  const [sort, setSort] = useState<SortKey>('relevancia');
  const [selected, setSelected] = useState<Provider | null>(null);
  const [toast, setToast] = useState('');

  const list = useMemo(() => {
    let result = providers.filter((p) => {
      const matchCat = activeCat === 'todos' || p.categoryId === activeCat;
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchCat && matchQuery;
    });
    if (sort === 'avaliacao') result = [...result].sort((a, b) => b.rating - a.rating);
    if (sort === 'preco') result = [...result].sort((a, b) => a.priceFrom - b.priceFrom);
    if (sort === 'relevancia') result = [...result].sort((a, b) => Number(b.featured) - Number(a.featured));
    return result;
  }, [query, activeCat, sort]);

  function handleSuccess() {
    setSelected(null);
    setToast('✅ Solicitação enviada! Acompanhe em Pedidos.');
    setTimeout(() => setToast(''), 4000);
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Encontre fornecedores</h1>
          <p className="text-gray-500 mt-1">
            {providers.length} fornecedores verificados para o seu evento
          </p>
        </div>

        {/* Busca */}
        <div className="relative mb-5">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="search" size={18} /></span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busque por serviço, ex.: buffet, DJ, decoração..."
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
        </div>

        {/* Filtro de categorias */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          <button
            onClick={() => setActiveCat('todos')}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition ${
              activeCat === 'todos' ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-400'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition flex items-center gap-1.5 ${
                activeCat === cat.id ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-400'
              }`}
            >
              <Icon name={cat.icon} size={15} /> {cat.name}
            </button>
          ))}
        </div>

        {/* Ordenação + contagem */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-400">{list.length} resultado(s)</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Ordenar por:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="relevancia">Relevância</option>
              <option value="avaliacao">Melhor avaliação</option>
              <option value="preco">Menor preço</option>
            </select>
          </div>
        </div>

        {/* Grid de fornecedores */}
        {list.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {list.map((p) => (
              <ProviderCard key={p.id} provider={p} onSolicitar={setSelected} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <span className="inline-flex text-gray-300"><Icon name="search" size={40} strokeWidth={1.5} /></span>
            <p className="text-gray-500 mt-3">Nenhum fornecedor encontrado para esta busca.</p>
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
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm flex items-center gap-3 z-50">
          {toast}
          <button onClick={() => router.push('/pedidos')} className="underline text-primary-300">
            Ver pedidos
          </button>
        </div>
      )}
    </Layout>
  );
}
