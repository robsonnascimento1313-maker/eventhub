import { useState } from 'react';
import { Provider, categoryById, formatBRL } from '../services/catalog';
import { addPedido } from '../services/store';
import Stars from './Stars';
import Icon from './Icon';

interface Props {
  provider: Provider;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SolicitarModal({ provider, onClose, onSuccess }: Props) {
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const category = categoryById(provider.categoryId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    addPedido({
      providerId: provider.id,
      providerName: provider.name,
      categoryId: provider.categoryId,
      eventName: eventName || 'Evento sem nome',
      date,
      guests: Number(guests) || 0,
      details,
    });
    setTimeout(() => {
      setSubmitting(false);
      onSuccess();
    }, 600);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-surface rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do fornecedor */}
        <div className="flex items-start gap-4 p-6 border-b border-edge-soft">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${category?.color ?? 'bg-surface-3'}`}>
            {category && <Icon name={category.icon} size={26} />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-100">{provider.name}</h3>
              {provider.verified && (
                <span className="inline-flex items-center gap-1 text-xs bg-primary-400/10 text-primary-300 px-1.5 py-0.5 rounded font-medium">
                  <Icon name="check" size={11} strokeWidth={3} /> Verificado
                </span>
              )}
            </div>
            <div className="mt-1"><Stars rating={provider.rating} /></div>
            <p className="text-xs text-gray-400 mt-1">
              A partir de <span className="font-semibold text-gray-200">{formatBRL(provider.priceFrom)}</span> · {provider.responseTime}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300"><Icon name="x" size={20} /></button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Nome do evento</label>
            <input
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Ex.: Convenção Anual de Vendas"
              className="w-full px-3 py-2.5 bg-surface-3 border border-edge rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-surface-3 border border-edge rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Convidados</label>
              <input
                type="number"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                placeholder="Ex.: 150"
                className="w-full px-3 py-2.5 bg-surface-3 border border-edge rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Detalhes da solicitação</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              placeholder="Descreva o que você precisa..."
              className="w-full px-3 py-2.5 bg-surface-3 border border-edge rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition disabled:opacity-60"
          >
            {submitting ? 'Enviando solicitação...' : 'Solicitar orçamento'}
          </button>
          <p className="text-xs text-center text-gray-400">
            Sem compromisso · o fornecedor responde com uma proposta
          </p>
        </form>
      </div>
    </div>
  );
}
