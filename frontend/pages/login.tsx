import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { login, saveSession } from '../services/auth';
import Icon from '../components/Icon';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      saveSession(data.accessToken, data.user);
      router.push('/dashboard');
    } catch {
      setError('Email ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Icon name="bolt" size={24} filled strokeWidth={0} className="text-white" />
            </span>
            EventHub
          </h1>
          <p className="text-blue-200 mt-2">Plataforma B2B para eventos corporativos</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Entrar na plataforma</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Não tem conta?{' '}
            <button
              onClick={() => router.push('/register')}
              className="text-primary-600 hover:underline font-medium"
            >
              Criar conta
            </button>
          </p>

          <div className="mt-5 p-3 bg-gray-50 border border-gray-100 rounded-lg text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Conta demo</p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-mono">demo@eventhub.com</span> · <span className="font-mono">demo123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
