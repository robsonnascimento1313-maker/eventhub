import { Provider, categoryById, formatBRL } from '../services/catalog';
import Stars from './Stars';

interface Props {
  provider: Provider;
  onSolicitar: (p: Provider) => void;
}

export default function ProviderCard({ provider, onSolicitar }: Props) {
  const category = categoryById(provider.categoryId);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition flex flex-col overflow-hidden">
      <div className="p-5 flex-1">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${category?.color ?? 'bg-gray-100'}`}>
            {category?.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-gray-800 truncate">{provider.name}</h3>
              {provider.verified && (
                <span title="Verificado" className="text-primary-600 text-sm shrink-0">✓</span>
              )}
            </div>
            <p className="text-xs text-gray-400">{category?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Stars rating={provider.rating} />
          <span className="text-xs text-gray-400">({provider.reviews})</span>
        </div>

        <p className="text-sm text-gray-500 mt-3 line-clamp-2">{provider.description}</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {provider.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full border border-gray-100">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-4 text-xs text-gray-400">
          <span>📍 {provider.location}</span>
          <span>·</span>
          <span>⚡ {provider.responseTime}</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50 bg-gray-50/50">
        <div>
          <p className="text-xs text-gray-400">a partir de</p>
          <p className="font-bold text-gray-800">{formatBRL(provider.priceFrom)}</p>
        </div>
        <button
          onClick={() => onSolicitar(provider)}
          className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition"
        >
          Solicitar orçamento
        </button>
      </div>
    </div>
  );
}
