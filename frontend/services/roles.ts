// Configuração de navegação e identidade por papel (empresa, fornecedor, admin).
// É isto que faz o layout mudar conforme quem está logado.

import { IconName } from '../components/Icon';

export interface NavItem {
  label: string;
  href: string;
  icon: IconName;
}

export interface RoleConfig {
  label: string;      // como o papel aparece na UI
  tagline: string;
  nav: NavItem[];
}

const empresaNav: NavItem[] = [
  { label: 'Início',        href: '/dashboard',    icon: 'home' },
  { label: 'Fornecedores',  href: '/fornecedores', icon: 'search' },
  { label: 'Meus Pedidos',  href: '/pedidos',      icon: 'clipboard' },
  { label: 'Eventos',       href: '/eventos',      icon: 'calendar' },
  { label: 'Pagamentos',    href: '/pagamentos',   icon: 'card' },
];

const fornecedorNav: NavItem[] = [
  { label: 'Início',       href: '/dashboard',      icon: 'home' },
  { label: 'Oportunidades',href: '/oportunidades',  icon: 'zap' },
  { label: 'Recebimentos', href: '/pagamentos',     icon: 'wallet' },
];

const adminNav: NavItem[] = [
  { label: 'Início',       href: '/dashboard',    icon: 'home' },
  { label: 'Fornecedores', href: '/fornecedores', icon: 'building' },
  { label: 'Pedidos',      href: '/pedidos',      icon: 'clipboard' },
  { label: 'Pagamentos',   href: '/pagamentos',   icon: 'card' },
];

export const roleConfigs: Record<string, RoleConfig> = {
  empresa:    { label: 'Empresa',     tagline: 'Contratante',  nav: empresaNav },
  fornecedor: { label: 'Fornecedor',  tagline: 'Prestador',    nav: fornecedorNav },
  admin:      { label: 'Administrador',tagline: 'Plataforma',  nav: adminNav },
};

export function configForRole(role: string | undefined): RoleConfig {
  return roleConfigs[role ?? 'empresa'] ?? roleConfigs.empresa;
}
