// Catálogo de fornecedores do marketplace (modo demo).
// Dados estáticos que dão vida à vitrine — inspirado em GetNinjas / Mercado Livre.

import { IconName } from '../components/Icon';

export interface Category {
  id: string;
  name: string;
  icon: IconName;
  color: string; // classes tailwind para o avatar/badge
}

export type ProfileType = 'empresa' | 'autonomo';

export interface Service {
  name: string;
  price: number;
}

export interface Review {
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface Provider {
  id: string;
  name: string;
  categoryId: string;
  profileType: ProfileType;
  rating: number;
  reviews: number;
  priceFrom: number;
  location: string;
  responseTime: string;
  verified: boolean;
  featured: boolean;
  since: number;
  completedJobs: number;
  tags: string[];
  description: string;
  about: string;
  services: Service[];
}

export const categories: Category[] = [
  { id: 'buffet',      name: 'Buffet',            icon: 'utensils', color: 'bg-amber-400/10 text-amber-300' },
  { id: 'som',         name: 'Som e Iluminação',  icon: 'music',    color: 'bg-violet-400/10 text-violet-300' },
  { id: 'decoracao',   name: 'Decoração',         icon: 'palette',  color: 'bg-pink-400/10 text-pink-300' },
  { id: 'fotografia',  name: 'Fotografia',        icon: 'camera',   color: 'bg-sky-400/10 text-sky-300' },
  { id: 'seguranca',   name: 'Segurança',         icon: 'shield',   color: 'bg-slate-400/10 text-slate-300' },
  { id: 'transporte',  name: 'Transporte',        icon: 'truck',    color: 'bg-emerald-400/10 text-emerald-300' },
  { id: 'espaco',      name: 'Espaços',           icon: 'landmark', color: 'bg-indigo-400/10 text-indigo-300' },
];

export const providers: Provider[] = [
  {
    id: 'p1', name: 'Sabor & Cia Buffet', categoryId: 'buffet', profileType: 'empresa',
    rating: 4.9, reviews: 214, priceFrom: 4500, location: 'São Paulo, SP', responseTime: 'responde em ~1h',
    verified: true, featured: true, since: 2014, completedJobs: 320,
    tags: ['Coffee break', 'Jantar', 'Coquetel'],
    description: 'Buffet completo para eventos corporativos, do coffee break ao jantar de gala.',
    about: 'Somos um buffet especializado em eventos corporativos há mais de 10 anos. Equipe própria de chefs, garçons e maîtres, com cardápios personalizados e opções para todas as restrições alimentares.',
    services: [
      { name: 'Coffee break (por pessoa)', price: 45 },
      { name: 'Almoço executivo (por pessoa)', price: 89 },
      { name: 'Coquetel volante (por pessoa)', price: 120 },
    ],
  },
  {
    id: 'p2', name: 'Gourmet Eventos', categoryId: 'buffet', profileType: 'empresa',
    rating: 4.7, reviews: 128, priceFrom: 3800, location: 'Campinas, SP', responseTime: 'responde em ~3h',
    verified: true, featured: false, since: 2017, completedJobs: 190,
    tags: ['Finger food', 'Vegano'],
    description: 'Gastronomia premium com opções veganas e sem glúten.',
    about: 'Gastronomia contemporânea com forte atuação em opções veganas e sem glúten. Ideal para empresas que valorizam inclusão e apresentação impecável.',
    services: [
      { name: 'Finger food (por pessoa)', price: 55 },
      { name: 'Menu vegano completo (por pessoa)', price: 95 },
    ],
  },
  {
    id: 'p3', name: 'Bella Mesa Catering', categoryId: 'buffet', profileType: 'empresa',
    rating: 4.5, reviews: 86, priceFrom: 2900, location: 'Rio de Janeiro, RJ', responseTime: 'responde em ~5h',
    verified: false, featured: false, since: 2019, completedJobs: 110,
    tags: ['Coffee break', 'Brunch'],
    description: 'Catering ágil para reuniões e workshops empresariais.',
    about: 'Catering ágil e acessível para reuniões, treinamentos e workshops. Entrega pontual e montagem rápida.',
    services: [
      { name: 'Coffee break simples (por pessoa)', price: 32 },
      { name: 'Brunch corporativo (por pessoa)', price: 68 },
    ],
  },
  {
    id: 'p4', name: 'SoundPro Áudio', categoryId: 'som', profileType: 'empresa',
    rating: 4.8, reviews: 176, priceFrom: 3200, location: 'São Paulo, SP', responseTime: 'responde em ~2h',
    verified: true, featured: true, since: 2013, completedJobs: 280,
    tags: ['PA System', 'DJ', 'Microfones'],
    description: 'Sonorização profissional para auditórios e grandes eventos.',
    about: 'Locação e operação de som profissional para auditórios, convenções e shows corporativos. Técnicos credenciados acompanham todo o evento.',
    services: [
      { name: 'Kit som para até 200 pessoas', price: 3200 },
      { name: 'DJ residente (4h)', price: 1800 },
      { name: 'Microfones sem fio (unidade)', price: 150 },
    ],
  },
  {
    id: 'p5', name: 'LuzShow Cenografia', categoryId: 'som', profileType: 'empresa',
    rating: 4.6, reviews: 94, priceFrom: 2600, location: 'Guarulhos, SP', responseTime: 'responde em ~4h',
    verified: true, featured: false, since: 2016, completedJobs: 150,
    tags: ['Iluminação cênica', 'Painel LED'],
    description: 'Iluminação e painéis de LED que transformam o ambiente.',
    about: 'Projetos de iluminação cênica e painéis de LED sob medida, criando atmosfera e impacto visual para o seu evento.',
    services: [
      { name: 'Iluminação cênica (pacote)', price: 2600 },
      { name: 'Painel de LED (m²)', price: 380 },
    ],
  },
  {
    id: 'p6', name: 'Decorart Ambientes', categoryId: 'decoracao', profileType: 'empresa',
    rating: 4.9, reviews: 203, priceFrom: 3500, location: 'São Paulo, SP', responseTime: 'responde em ~1h',
    verified: true, featured: true, since: 2012, completedJobs: 340,
    tags: ['Cenografia', 'Flores', 'Mobiliário'],
    description: 'Decoração sob medida alinhada à identidade da sua marca.',
    about: 'Decoração e cenografia sob medida, alinhadas à identidade visual da sua empresa. Do conceito à montagem, cuidamos de tudo.',
    services: [
      { name: 'Projeto de decoração (pacote)', price: 3500 },
      { name: 'Locação de mobiliário (por peça)', price: 90 },
    ],
  },
  {
    id: 'p7', name: 'Marina Flores', categoryId: 'decoracao', profileType: 'autonomo',
    rating: 4.4, reviews: 67, priceFrom: 1800, location: 'Santo André, SP', responseTime: 'responde em ~6h',
    verified: false, featured: false, since: 2020, completedJobs: 72,
    tags: ['Arranjos', 'Centros de mesa'],
    description: 'Decoradora floral autônoma para eventos corporativos.',
    about: 'Sou decoradora floral autônoma. Trabalho com arranjos elegantes e personalizados, atendendo pessoalmente cada cliente do briefing à montagem.',
    services: [
      { name: 'Arranjo de mesa (unidade)', price: 120 },
      { name: 'Decoração de recepção', price: 1800 },
    ],
  },
  {
    id: 'p8', name: 'Click Memórias', categoryId: 'fotografia', profileType: 'empresa',
    rating: 4.8, reviews: 152, priceFrom: 1500, location: 'São Paulo, SP', responseTime: 'responde em ~2h',
    verified: true, featured: false, since: 2015, completedJobs: 240,
    tags: ['Fotografia', 'Vídeo', 'Drone'],
    description: 'Cobertura fotográfica e audiovisual completa do seu evento.',
    about: 'Estúdio de fotografia e vídeo com equipe para cobertura completa: fotos, filmagem e imagens aéreas com drone. Entrega editada em até 7 dias.',
    services: [
      { name: 'Cobertura fotográfica (4h)', price: 1500 },
      { name: 'Filmagem + edição', price: 2800 },
      { name: 'Imagens com drone', price: 900 },
    ],
  },
  {
    id: 'p9', name: 'Rafael Lente', categoryId: 'fotografia', profileType: 'autonomo',
    rating: 4.6, reviews: 89, priceFrom: 1200, location: 'Osasco, SP', responseTime: 'responde em ~4h',
    verified: true, featured: false, since: 2018, completedJobs: 130,
    tags: ['Fotografia', 'Cabine'],
    description: 'Fotógrafo autônomo com cabine de fotos interativa.',
    about: 'Fotógrafo autônomo especializado em eventos corporativos. Ofereço registro profissional e cabine de fotos interativa para engajar os convidados.',
    services: [
      { name: 'Cobertura fotográfica (4h)', price: 1200 },
      { name: 'Cabine de fotos (por evento)', price: 800 },
    ],
  },
  {
    id: 'p10', name: 'Guardian Segurança', categoryId: 'seguranca', profileType: 'empresa',
    rating: 4.7, reviews: 118, priceFrom: 2200, location: 'São Paulo, SP', responseTime: 'responde em ~3h',
    verified: true, featured: false, since: 2011, completedJobs: 260,
    tags: ['Portaria', 'Controle de acesso'],
    description: 'Equipe treinada e credenciada para eventos de qualquer porte.',
    about: 'Empresa de segurança credenciada, com equipe treinada para portaria, controle de acesso e segurança patrimonial em eventos de qualquer porte.',
    services: [
      { name: 'Segurança (por profissional/12h)', price: 380 },
      { name: 'Controle de acesso (pacote)', price: 2200 },
    ],
  },
  {
    id: 'p11', name: 'Carlos Vigi', categoryId: 'seguranca', profileType: 'autonomo',
    rating: 4.3, reviews: 54, priceFrom: 1600, location: 'Barueri, SP', responseTime: 'responde em ~6h',
    verified: false, featured: false, since: 2021, completedJobs: 48,
    tags: ['Segurança', 'Brigada'],
    description: 'Profissional de segurança e brigada autônomo.',
    about: 'Profissional de segurança autônomo, formado em brigada de incêndio. Atendo eventos de pequeno e médio porte com pontualidade e discrição.',
    services: [
      { name: 'Segurança (12h)', price: 350 },
      { name: 'Brigadista (12h)', price: 320 },
    ],
  },
  {
    id: 'p12', name: 'TransVip Fretamento', categoryId: 'transporte', profileType: 'empresa',
    rating: 4.8, reviews: 141, priceFrom: 1900, location: 'São Paulo, SP', responseTime: 'responde em ~2h',
    verified: true, featured: true, since: 2014, completedJobs: 300,
    tags: ['Vans', 'Ônibus', 'Executivo'],
    description: 'Transporte executivo e fretamento para colaboradores.',
    about: 'Frota própria de vans e ônibus executivos para transporte de colaboradores e convidados. Motoristas experientes e veículos revisados.',
    services: [
      { name: 'Van executiva (diária)', price: 1900 },
      { name: 'Ônibus fretado (diária)', price: 3400 },
    ],
  },
  {
    id: 'p13', name: 'Pedro Transfer', categoryId: 'transporte', profileType: 'autonomo',
    rating: 4.5, reviews: 73, priceFrom: 1400, location: 'Guarulhos, SP', responseTime: 'responde em ~5h',
    verified: true, featured: false, since: 2019, completedJobs: 95,
    tags: ['Transfer', 'Aeroporto'],
    description: 'Motorista executivo autônomo para transfers.',
    about: 'Motorista executivo autônomo. Faço transfers pontuais para aeroportos e hotéis, com veículo confortável e atendimento personalizado.',
    services: [
      { name: 'Transfer aeroporto (trecho)', price: 220 },
      { name: 'Diária executiva', price: 1400 },
    ],
  },
  {
    id: 'p14', name: 'Espaço Villa Real', categoryId: 'espaco', profileType: 'empresa',
    rating: 4.9, reviews: 187, priceFrom: 8500, location: 'São Paulo, SP', responseTime: 'responde em ~1h',
    verified: true, featured: true, since: 2010, completedJobs: 210,
    tags: ['Auditório', 'Estacionamento', '500 pax'],
    description: 'Espaço nobre para convenções, com estrutura completa.',
    about: 'Espaço nobre para convenções e eventos corporativos, com auditório para até 500 pessoas, estacionamento próprio e infraestrutura completa de apoio.',
    services: [
      { name: 'Locação do espaço (diária)', price: 8500 },
      { name: 'Auditório (período)', price: 4200 },
    ],
  },
];

// Reviews de exemplo, geradas de forma determinística a partir do id do fornecedor.
const REVIEW_POOL = [
  { author: 'Ana Paula M.', text: 'Serviço impecável, equipe pontual e muito atenciosa. Recomendo!' },
  { author: 'Ricardo Souza', text: 'Superou as expectativas. O evento da nossa empresa foi um sucesso.' },
  { author: 'Juliana Alves', text: 'Ótimo custo-benefício e comunicação clara do início ao fim.' },
  { author: 'Marcos T.', text: 'Profissionais dedicados. Resolveram tudo com agilidade no dia.' },
  { author: 'Fernanda Lima', text: 'Contrataria novamente sem pensar duas vezes. Nota 10.' },
];

export function reviewsFor(provider: Provider): Review[] {
  const seed = provider.id.charCodeAt(1) || 0;
  return REVIEW_POOL.slice(0, 3).map((r, i) => ({
    author: r.author,
    text: r.text,
    rating: Math.min(5, Math.round(provider.rating) - (i === 2 ? 1 : 0)),
    date: `${['Jun', 'Mai', 'Abr'][i]} 2026`,
  })).filter((_, i) => (seed + i) % 7 !== 6);
}

export function categoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function providerById(id: string): Provider | undefined {
  return providers.find((p) => p.id === id);
}

export function profileLabel(type: ProfileType): string {
  return type === 'empresa' ? 'Empresa' : 'Profissional autônomo';
}

// Velocidade de resposta (modelo Thumbtack: responder rápido é recompensado).
export function responseHours(p: Provider): number {
  const m = p.responseTime.match(/(\d+)/);
  return m ? Number(m[1]) : 24;
}

// "Top resposta": responde em até 1h — o selo mais valioso da vitrine.
export function isTopResponder(p: Provider): boolean {
  return responseHours(p) <= 1;
}

// Resposta rápida: até 3h — ainda ganha destaque verde.
export function isFastResponder(p: Provider): boolean {
  return responseHours(p) <= 3;
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });
}
