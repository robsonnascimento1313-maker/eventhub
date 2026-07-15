// Configuração de navegação e identidade por papel (empresa, fornecedor, admin).
// É isto que faz o layout mudar conforme quem está logado.

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export interface RoleConfig {
  label: string;      // como o papel aparece na UI
  tagline: string;
  nav: NavItem[];
}

const empresaNav: NavItem[] = [
  { label: 'Início',        href: '/dashboard',    icon: '🏠' },
  { label: 'Fornecedores',  href: '/fornecedores', icon: '🔎' },
  { label: 'Meus Pedidos',  href: '/pedidos',      icon: '📋' },
  { label: 'Eventos',       href: '/eventos',      icon: '📅' },
  { label: 'Pagamentos',    href: '/pagamentos',   icon: '💳' },
];

const fornecedorNav: NavItem[] = [
  { label: 'Início',       href: '/dashboard',      icon: '🏠' },
  { label: 'Oportunidades',href: '/oportunidades',  icon: '⚡' },
  { label: 'Recebimentos', href: '/pagamentos',     icon: '💰' },
];

const adminNav: NavItem[] = [
  { label: 'Início',       href: '/dashboard',    icon: '🏠' },
  { label: 'Fornecedores', href: '/fornecedores', icon: '🏢' },
  { label: 'Pedidos',      href: '/pedidos',      icon: '📋' },
  { label: 'Pagamentos',   href: '/pagamentos',   icon: '💳' },
];

export const roleConfigs: Record<string, RoleConfig> = {
  empresa:    { label: 'Empresa',     tagline: 'Contratante',  nav: empresaNav },
  fornecedor: { label: 'Fornecedor',  tagline: 'Prestador',    nav: fornecedorNav },
  admin:      { label: 'Administrador',tagline: 'Plataforma',  nav: adminNav },
};

export function configForRole(role: string | undefined): RoleConfig {
  return roleConfigs[role ?? 'empresa'] ?? roleConfigs.empresa;
}
