// Loja persistente (localStorage) para pedidos e eventos — modo demo.
// Simula o backend do marketplace: solicitar orçamento, receber propostas, contratar.

import { providers } from './catalog';

export type PedidoStatus = 'pendente' | 'confirmado' | 'concluido' | 'cancelado';

export interface Pedido {
  id: string;
  providerId: string;
  providerName: string;
  categoryId: string;
  eventName: string;
  date: string;
  guests: number;
  details: string;
  status: PedidoStatus;
  proposals: number; // propostas recebidas (simulado)
  amount: number;    // valor cotado
  createdAt: string;
}

export interface Evento {
  id: string;
  name: string;
  date: string;
  location: string;
  guests: number;
  createdAt: string;
}

const PEDIDOS_KEY = 'eventhub_pedidos';
const EVENTOS_KEY = 'eventhub_eventos';
const SEED_KEY = 'eventhub_seeded';

function read<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

// Semeia dados de exemplo na primeira visita, para a plataforma não parecer vazia.
export function seedOnce(): void {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(SEED_KEY)) return;

  const eventos: Evento[] = [
    { id: uid(), name: 'Convenção Anual de Vendas',   date: '2026-08-22', location: 'São Paulo, SP', guests: 320, createdAt: new Date().toISOString() },
    { id: uid(), name: 'Workshop de Inovação',        date: '2026-07-30', location: 'Campinas, SP',  guests: 80,  createdAt: new Date().toISOString() },
  ];

  const p1 = providers.find((p) => p.id === 'p1');
  const p6 = providers.find((p) => p.id === 'p6');
  const pedidos: Pedido[] = [
    {
      id: uid(), providerId: 'p1', providerName: p1?.name ?? 'Buffet', categoryId: 'buffet',
      eventName: 'Convenção Anual de Vendas', date: '2026-08-22', guests: 320,
      details: 'Coffee break manhã e tarde + almoço para 320 pessoas.',
      status: 'confirmado', proposals: 4, amount: 18500, createdAt: new Date(Date.now() - 2 * 864e5).toISOString(),
    },
    {
      id: uid(), providerId: 'p6', providerName: p6?.name ?? 'Decoração', categoryId: 'decoracao',
      eventName: 'Workshop de Inovação', date: '2026-07-30', guests: 80,
      details: 'Cenografia com identidade visual da empresa.',
      status: 'pendente', proposals: 2, amount: 0, createdAt: new Date(Date.now() - 1 * 864e5).toISOString(),
    },
  ];

  write(EVENTOS_KEY, eventos);
  write(PEDIDOS_KEY, pedidos);
  localStorage.setItem(SEED_KEY, '1');
}

// ---------- Pedidos ----------
export function getPedidos(): Pedido[] {
  return read<Pedido>(PEDIDOS_KEY).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addPedido(input: Omit<Pedido, 'id' | 'status' | 'proposals' | 'amount' | 'createdAt'>): Pedido {
  const pedido: Pedido = {
    ...input,
    id: uid(),
    status: 'pendente',
    proposals: Math.floor(Math.random() * 3) + 1, // 1-3 propostas chegam "na hora"
    amount: 0,
    createdAt: new Date().toISOString(),
  };
  const all = read<Pedido>(PEDIDOS_KEY);
  all.push(pedido);
  write(PEDIDOS_KEY, all);
  return pedido;
}

export function updatePedidoStatus(id: string, status: PedidoStatus, amount?: number): void {
  const all = read<Pedido>(PEDIDOS_KEY).map((p) =>
    p.id === id ? { ...p, status, amount: amount ?? p.amount } : p,
  );
  write(PEDIDOS_KEY, all);
}

// Lado do FORNECEDOR: responde a um lead com uma proposta de preço.
export function enviarProposta(id: string, amount: number): void {
  const all = read<Pedido>(PEDIDOS_KEY).map((p) =>
    p.id === id ? { ...p, amount, proposals: p.proposals + 1 } : p,
  );
  write(PEDIDOS_KEY, all);
}

// ---------- Eventos ----------
export function getEventos(): Evento[] {
  return read<Evento>(EVENTOS_KEY).sort((a, b) => a.date.localeCompare(b.date));
}

export function addEvento(input: Omit<Evento, 'id' | 'createdAt'>): Evento {
  const evento: Evento = { ...input, id: uid(), createdAt: new Date().toISOString() };
  const all = read<Evento>(EVENTOS_KEY);
  all.push(evento);
  write(EVENTOS_KEY, all);
  return evento;
}

// ---------- Métricas derivadas ----------
export function getStats() {
  const pedidos = getPedidos();
  const eventos = getEventos();
  const receita = pedidos
    .filter((p) => p.status === 'confirmado' || p.status === 'concluido')
    .reduce((sum, p) => sum + p.amount, 0);
  return {
    eventos: eventos.length,
    fornecedores: providers.length,
    pedidosPendentes: pedidos.filter((p) => p.status === 'pendente').length,
    receita,
  };
}
