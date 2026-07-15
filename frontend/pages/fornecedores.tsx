import Layout from '../components/Layout';

export default function FornecedoresPage() {
  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Fornecedores</h1>
            <p className="text-gray-500 mt-1">Encontre os melhores fornecedores para seu evento</p>
          </div>
          <button className="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition">
            + Cadastrar Fornecedor
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          {['Buffet', 'Som e Iluminação', 'Decoração', 'Fotografia', 'Segurança', 'Transporte'].map((cat) => (
            <div key={cat} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition cursor-pointer">
              <p className="font-semibold text-gray-700">{cat}</p>
              <p className="text-xs text-gray-400 mt-1">0 fornecedores disponíveis</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <span className="text-5xl">🏢</span>
          <h3 className="text-lg font-semibold text-gray-700 mt-4">Nenhum fornecedor cadastrado</h3>
          <p className="text-gray-400 text-sm mt-2">Cadastre fornecedores para começar a contratar serviços.</p>
        </div>
      </div>
    </Layout>
  );
}
