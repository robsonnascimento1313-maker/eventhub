import { useRouter } from 'next/router';
import {
  Provider, categoryById, formatBRL, profileLabel,
  isTopResponder, isFastResponder,
} from '../services/catalog';
import Stars from './Stars';
import Icon from './Icon';

interface Props {
  provider: Provider;
  onSolicitar: (p: Provider) => void;
}

function ResponseBadge({ provider }: { provider: Provider }) {
  const time = provider.responseTime.replace('responde em ', '');
  if (isTopResponder(provider)) {
    return (
      <span className="inline-flex items-center gap-1 bg-amber-400/15 text-amber-300 text-[11px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full border border-amber-400/30">
        <Icon name="bolt" size={11} filled strokeWidth={0} /> Top resposta · {time}
      </span>
    );
  }
  if (isFastResponder(provider)) {
    return (
      <span className="inline-flex items-center gap-1 bg-emerald-400/10 text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-400/20">
        <Icon name="bolt" size={11} filled strokeWidth={0} /> Responde em {time}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400 px-1 py-1">
      responde em {time}
    </span>
  );
}

export default function ProviderCard({ provider, onSolicitar }: Props) {
  const router = useRouter();
  const category = categoryById(provider.categoryId);
  const top = isTopResponder(provider);

  return (
    <div
      onClick={() => router.push(`/fornecedor/${provider.id}`)}
      className={`group bg-surface rounded-2xl border shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col overflow-hidden cursor-pointer ${
        top ? 'border-amber-400/25' : 'border-edge hover:border-primary-200'
      }`}
    >
      <div className="p-5 flex-1">
        {/* Selo de velocidade — o destaque nº 1 do card */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <ResponseBadge provider={provider} />
          {provider.verified && (
            <span title="Verificado" className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-400">
              <Icon name="check-circle" size={13} /> Verificado
            </span>
          )}
        </div>

        <div className="flex items-start gap-3.5">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${category?.color ?? 'bg-surface-3'}`}>
            {category && <Icon name={category.icon} size={22} />}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-[15px] text-gray-50 truncate leading-snug group-hover:text-primary-700 transition-colors">
              {provider.name}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {category?.name} · {profileLabel(provider.profileType)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3.5">
          <Stars rating={provider.rating} />
          <span className="text-xs text-gray-400">({provider.reviews})</span>
          <span className="text-gray-700">·</span>
          <span className="text-xs text-gray-400">{provider.completedJobs} serviços</span>
        </div>

        <p className="text-[13px] text-gray-400 mt-3 line-clamp-2 leading-relaxed">{provider.description}</p>

        <div className="flex items-center gap-1.5 mt-3.5 text-xs text-gray-400">
          <Icon name="pin" size={13} /> {provider.location}
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-4 border-t border-edge-soft bg-white/[.03]">
        <div>
          <p className="text-[11px] text-gray-400">a partir de</p>
          <p className="font-extrabold text-gray-50 tabular text-[15px]">{formatBRL(provider.priceFrom)}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onSolicitar(provider); }}
          className="px-4 py-2 bg-primary-600 text-white text-[13px] font-bold rounded-xl hover:bg-primary-700 active:scale-[.98] transition"
        >
          Solicitar orçamento
        </button>
      </div>
    </div>
  );
}
