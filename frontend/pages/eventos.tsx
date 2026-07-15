import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getEventos, addEvento, seedOnce, Evento } from '../services/store';

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', location: '', guests: '' });

  function refresh() {
    setEventos(getEventos());
  }

  useEffect(() => {
    seedOnce();
    refresh();
  }, []);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) return;
    addEvento({
      name: form.name,
      date: form.date,
      location: form.location,
      guests: Number(form.guests) || 0,
    });
    setForm({ name: '', date: '', location: '', guests: '' });
    setOpen(false);
    refresh();
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Eventos</h1>
            <p className="text-gray-500 mt-1">Gerencie seus eventos corporativos</p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition"
          >
            + Novo Evento
          </button>
        </div>

        {eventos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {eventos.map((ev) => (
              <div key={ev.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🎯</span>
                  <span className="text-xs text-gray-400">
                    {ev.date ? new Date(ev.date).toLocaleDateString('pt-BR') : 'Sem data'}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 mt-3">{ev.name}</h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  {ev.location && <span>📍 {ev.location}</span>}
                  {ev.guests > 0 && <span>👥 {ev.guests}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <span className="text-5xl">🎯</span>
            <h3 className="text-lg font-semibold text-gray-700 mt-4">Nenhum evento cadastrado</h3>
            <p className="text-gray-400 text-sm mt-2">Crie seu primeiro evento e comece a contratar serviços.</p>
            <button
              onClick={() => setOpen(true)}
              className="mt-6 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition"
            >
              Criar Evento
            </button>
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Novo evento</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do evento</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex.: Confraternização de fim de ano"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Convidados</label>
                  <input
                    type="number"
                    value={form.guests}
                    onChange={(e) => setForm({ ...form, guests: e.target.value })}
                    placeholder="Ex.: 100"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Ex.: São Paulo, SP"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button type="submit" className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition">
                Criar evento
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
