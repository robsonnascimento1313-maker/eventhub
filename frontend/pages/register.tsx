import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { register } from '../services/auth';
import Icon from '../components/Icon';

const roles = [
  { value: 'empresa', label: 'Empresa (contratante de serviços)' },
  { value: 'fornecedor', label: 'Fornecedor (buffet, som, decoração...)' },
  { value: 'admin', label: 'Administrador' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'empresa' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      router.push('/login');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ground bg-[radial-gradient(ellipse_at_top,rgba(124,92,250,.18),transparent_60%)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Icon name="bolt" size={24} filled strokeWidth={0} className="text-white" />
            </span>
            EventHub
          </h1>
          <p className="text-gray-400 mt-2">Crie sua conta gratuitamente</p>
        </div>

        <div className="bg-surface rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Criar conta</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Nome completo</label>
              <input
                name="name" type="text" required value={form.name} onChange={handleChange}
                placeholder="Seu nome"
                className="w-full px-4 py-3 bg-surface-3 border border-edge rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
              <input
                name="email" type="email" required value={form.email} onChange={handleChange}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 bg-surface-3 border border-edge rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Senha</label>
              <input
                name="password" type="password" required value={form.password} onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 bg-surface-3 border border-edge rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Tipo de conta</label>
              <select
                name="role" value={form.role} onChange={handleChange}
                className="w-full px-4 py-3 bg-surface-3 border border-edge rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition bg-surface"
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60 mt-2"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Já tem conta?{' '}
            <button onClick={() => router.push('/login')} className="text-primary-400 hover:underline font-medium">
              Entrar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
