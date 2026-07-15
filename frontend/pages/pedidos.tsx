import Layout from '../components/Layout';

export default function PedidosPage() {
  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>
            <p className="text-gray-500 mt-1">Acompanhe suas solicitações de serviço</p>
          </div>
          <button className="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition">
            + Novo Pedido
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          {['Todos', 'Pendente', 'Confirmado', 'Concluído', 'Cancelado'].map((status) => (
            <button
              key={status}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                status === 'Todos'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-400'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <span className="text-5xl">📋</span>
          <h3 className="text-lg font-semibold text-gray-700 mt-4">Nenhum pedido encontrado</h3>
          <p className="text-gray-400 text-sm mt-2">Seus pedidos de serviço aparecerão aqui.</p>
        </div>
      </div>
    </Layout>
  );
}
