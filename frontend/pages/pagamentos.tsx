import Layout from '../components/Layout';

export default function PagamentosPage() {
  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Pagamentos</h1>
          <p className="text-gray-500 mt-1">Gerencie pagamentos com split automático via Stripe</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {[
            { label: 'Total Processado', value: 'R$ 0,00', icon: '💳', color: 'text-green-600' },
            { label: 'Aguardando',       value: 'R$ 0,00', icon: '⏳', color: 'text-yellow-600' },
            { label: 'Split Repassado',  value: 'R$ 0,00', icon: '🔀', color: 'text-blue-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              <span className="text-2xl">{s.icon}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <span className="text-5xl">💳</span>
          <h3 className="text-lg font-semibold text-gray-700 mt-4">Nenhum pagamento registrado</h3>
          <p className="text-gray-400 text-sm mt-2">
            Pagamentos processados via Stripe aparecerão aqui com split automático para fornecedores.
          </p>
          <button className="mt-6 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition">
            Conectar Stripe
          </button>
        </div>
      </div>
    </Layout>
  );
}
