import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Provider, categoryById, formatBRL, profileLabel, photoFor,
  isTopResponder, isFastResponder,
} from '../services/catalog';
import Icon from './Icon';

interface Props {
  provider: Provider;
  onSolicitar: (p: Provider) => void;
  onHover?: (id: string | null) => void;
}

function ResponseTag({ provider }: { provider: Provider }) {
  const time = provider.responseTime.replace('responde em ', '');
  if (isTopResponder(provider)) {
    return (
      <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-950 text-[11px] font-extrabold uppercase tracking-wide px-2 py-1 rounded-lg shadow">
        <Icon name="bolt" size={11} filled strokeWidth={0} /> Top · {time}
      </span>
    );
  }
  if (isFastResponder(provider)) {
    return (
      <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[11px] font-bold px-2 py-1 rounded-lg shadow">
        <Icon name="bolt" size={11} filled strokeWidth={0} /> {time}
      </span>
    );
  }
  return null;
}

export default function ProviderCard({ provider, onSolicitar, onHover }: Props) {
  const router = useRouter();
  const category = categoryById(provider.categoryId);
  const [fav, setFav] = useState(false);
  const [imgOk, setImgOk] = useState(true);

  return (
    <div
      onClick={() => router.push(`/fornecedor/${provider.id}`)}
      onMouseEnter={() => onHover?.(provider.id)}
      onMouseLeave={() => onHover?.(null)}
      className="group bg-surface rounded-2xl border border-edge hover:border-primary-500/50 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Foto dominante */}
      <div className="relative aspect-[16/10] bg-gradient-to-br from-surface-3 to-ground overflow-hidden">
        {imgOk ? (
          <img
            src={photoFor(provider)}
            alt={provider.name}
            loading="lazy"
            onError={() => setImgOk(false)}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${category?.color ?? ''}`}>
            {category && <Icon name={category.icon} size={40} />}
          </div>
        )}

        {/* Selo de resposta (sobreposto) */}
        <div className="absolute top-3 left-3"><ResponseTag provider={provider} /></div>

        {/* Favoritar */}
        <button
          onClick={(e) => { e.stopPropagation(); setFav((v) => !v); }}
          aria-label="Favoritar"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-ink-900/60 backdrop-blur flex items-center justify-center hover:bg-ink-900/80 transition"
        >
          <Icon name="heart" size={18} filled={fav} className={fav ? 'text-rose-500' : 'text-white'} strokeWidth={fav ? 0 : 2} />
        </button>

        {provider.verified && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 bg-ink-900/70 backdrop-blur text-primary-300 text-[11px] font-semibold px-2 py-1 rounded-lg">
            <Icon name="check-circle" size={12} /> Verificado
          </span>
        )}
      </div>

      {/* Corpo */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[17px] font-extrabold text-gray-50 tabular">
            {formatBRL(provider.priceFrom)} <span className="text-xs font-medium text-gray-400">a partir de</span>
          </p>
        </div>

        <h3 className="font-bold text-[15px] text-gray-50 mt-1.5 truncate group-hover:text-primary-300 transition-colors">
          {provider.name}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">{category?.name} · {profileLabel(provider.profileType)}</p>

        {/* Specs (linha com ícones, estilo QuintoAndar) */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-edge-soft text-xs text-gray-300">
          <span className="inline-flex items-center gap-1">
            <Icon name="star" size={13} filled strokeWidth={0} className="text-amber-400" /> {provider.rating.toFixed(1)}
          </span>
          <span className="inline-flex items-center gap-1 text-gray-400">
            <Icon name="check-circle" size={13} /> {provider.completedJobs}
          </span>
          <span className="inline-flex items-center gap-1 text-gray-400 truncate">
            <Icon name="pin" size={13} /> {provider.location.split(',')[0]}
          </span>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onSolicitar(provider); }}
          className="mt-3 w-full py-2 bg-primary-600 text-white text-[13px] font-bold rounded-xl hover:bg-primary-700 active:scale-[.98] transition"
        >
          Solicitar orçamento
        </button>
      </div>
    </div>
  );
}
