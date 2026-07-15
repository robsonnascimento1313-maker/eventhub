import Layout from '../components/Layout';

export default function EventosPage() {
  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Eventos</h1>
            <p className="text-gray-500 mt-1">Gerencie seus eventos corporativos</p>
          </div>
          <button className="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition">
            + Novo Evento
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <span className="text-5xl">🎯</span>
          <h3 className="text-lg font-semibold text-gray-700 mt-4">Nenhum evento cadastrado</h3>
          <p className="text-gray-400 text-sm mt-2">Crie seu primeiro evento e comece a contratar serviços.</p>
          <button className="mt-6 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition">
            Criar Evento
          </button>
        </div>
      </div>
    </Layout>
  );
}
