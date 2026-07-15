// Catálogo de fornecedores do marketplace (modo demo).
// Dados estáticos que dão vida à vitrine — inspirado em GetNinjas / Mercado Livre.

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string; // classes tailwind para o avatar/badge
}

export interface Provider {
  id: string;
  name: string;
  categoryId: string;
  rating: number;
  reviews: number;
  priceFrom: number;
  location: string;
  responseTime: string;
  verified: boolean;
  featured: boolean;
  tags: string[];
  description: string;
}

export const categories: Category[] = [
  { id: 'buffet',      name: 'Buffet',            icon: '🍽️', color: 'bg-amber-100 text-amber-700' },
  { id: 'som',         name: 'Som e Iluminação',  icon: '🎵', color: 'bg-violet-100 text-violet-700' },
  { id: 'decoracao',   name: 'Decoração',         icon: '🎨', color: 'bg-pink-100 text-pink-700' },
  { id: 'fotografia',  name: 'Fotografia',        icon: '📸', color: 'bg-sky-100 text-sky-700' },
  { id: 'seguranca',   name: 'Segurança',         icon: '🛡️', color: 'bg-slate-200 text-slate-700' },
  { id: 'transporte',  name: 'Transporte',        icon: '🚐', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'espaco',      name: 'Espaços',           icon: '🏛️', color: 'bg-indigo-100 text-indigo-700' },
];

export const providers: Provider[] = [
  { id: 'p1',  name: 'Sabor & Cia Buffet',      categoryId: 'buffet',     rating: 4.9, reviews: 214, priceFrom: 4500, location: 'São Paulo, SP',    responseTime: 'responde em ~1h',  verified: true,  featured: true,  tags: ['Coffee break', 'Jantar', 'Coquetel'],   description: 'Buffet completo para eventos corporativos, do coffee break ao jantar de gala.' },
  { id: 'p2',  name: 'Gourmet Eventos',         categoryId: 'buffet',     rating: 4.7, reviews: 128, priceFrom: 3800, location: 'Campinas, SP',     responseTime: 'responde em ~3h',  verified: true,  featured: false, tags: ['Finger food', 'Vegano'],                 description: 'Gastronomia premium com opções veganas e sem glúten.' },
  { id: 'p3',  name: 'Bella Mesa Catering',     categoryId: 'buffet',     rating: 4.5, reviews: 86,  priceFrom: 2900, location: 'Rio de Janeiro, RJ',responseTime: 'responde em ~5h',  verified: false, featured: false, tags: ['Coffee break', 'Brunch'],                description: 'Catering ágil para reuniões e workshops empresariais.' },
  { id: 'p4',  name: 'SoundPro Áudio',          categoryId: 'som',        rating: 4.8, reviews: 176, priceFrom: 3200, location: 'São Paulo, SP',    responseTime: 'responde em ~2h',  verified: true,  featured: true,  tags: ['PA System', 'DJ', 'Microfones'],         description: 'Sonorização profissional para auditórios e grandes eventos.' },
  { id: 'p5',  name: 'LuzShow Cenografia',      categoryId: 'som',        rating: 4.6, reviews: 94,  priceFrom: 2600, location: 'Guarulhos, SP',    responseTime: 'responde em ~4h',  verified: true,  featured: false, tags: ['Iluminação cênica', 'Painel LED'],       description: 'Iluminação e painéis de LED que transformam o ambiente.' },
  { id: 'p6',  name: 'Decorart Ambientes',      categoryId: 'decoracao',  rating: 4.9, reviews: 203, priceFrom: 3500, location: 'São Paulo, SP',    responseTime: 'responde em ~1h',  verified: true,  featured: true,  tags: ['Cenografia', 'Flores', 'Mobiliário'],    description: 'Decoração sob medida alinhada à identidade da sua marca.' },
  { id: 'p7',  name: 'Flor & Estilo',           categoryId: 'decoracao',  rating: 4.4, reviews: 67,  priceFrom: 1800, location: 'Santo André, SP',  responseTime: 'responde em ~6h',  verified: false, featured: false, tags: ['Arranjos', 'Centros de mesa'],           description: 'Arranjos florais elegantes para eventos corporativos.' },
  { id: 'p8',  name: 'Click Memórias',          categoryId: 'fotografia', rating: 4.8, reviews: 152, priceFrom: 1500, location: 'São Paulo, SP',    responseTime: 'responde em ~2h',  verified: true,  featured: false, tags: ['Fotografia', 'Vídeo', 'Drone'],          description: 'Cobertura fotográfica e audiovisual completa do seu evento.' },
  { id: 'p9',  name: 'Studio Lente',            categoryId: 'fotografia', rating: 4.6, reviews: 89,  priceFrom: 1200, location: 'Osasco, SP',       responseTime: 'responde em ~4h',  verified: true,  featured: false, tags: ['Fotografia', 'Cabine'],                  description: 'Registro profissional e cabine de fotos interativa.' },
  { id: 'p10', name: 'Guardian Segurança',      categoryId: 'seguranca',  rating: 4.7, reviews: 118, priceFrom: 2200, location: 'São Paulo, SP',    responseTime: 'responde em ~3h',  verified: true,  featured: false, tags: ['Portaria', 'Controle de acesso'],        description: 'Equipe treinada e credenciada para eventos de qualquer porte.' },
  { id: 'p11', name: 'Vigi Eventos',            categoryId: 'seguranca',  rating: 4.3, reviews: 54,  priceFrom: 1600, location: 'Barueri, SP',      responseTime: 'responde em ~6h',  verified: false, featured: false, tags: ['Segurança', 'Brigada'],                  description: 'Segurança patrimonial e brigada de incêndio.' },
  { id: 'p12', name: 'TransVip Fretamento',     categoryId: 'transporte', rating: 4.8, reviews: 141, priceFrom: 1900, location: 'São Paulo, SP',    responseTime: 'responde em ~2h',  verified: true,  featured: true,  tags: ['Vans', 'Ônibus', 'Executivo'],           description: 'Transporte executivo e fretamento para colaboradores.' },
  { id: 'p13', name: 'GoEvent Transfer',        categoryId: 'transporte', rating: 4.5, reviews: 73,  priceFrom: 1400, location: 'Guarulhos, SP',    responseTime: 'responde em ~5h',  verified: true,  featured: false, tags: ['Transfer', 'Aeroporto'],                 description: 'Transfers pontuais para aeroportos e hotéis.' },
  { id: 'p14', name: 'Espaço Villa Real',       categoryId: 'espaco',     rating: 4.9, reviews: 187, priceFrom: 8500, location: 'São Paulo, SP',    responseTime: 'responde em ~1h',  verified: true,  featured: true,  tags: ['Auditório', 'Estacionamento', '500 pax'],description: 'Espaço nobre para convenções, com estrutura completa.' },
];

export function categoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function providerById(id: string): Provider | undefined {
  return providers.find((p) => p.id === id);
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });
}
