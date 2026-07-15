import { CSSProperties } from 'react';
import {
  Home, Search, ClipboardList, Calendar, CreditCard, Wallet, Zap, Building2,
  Star, MapPin, Users, MessageCircle, Check, CheckCircle2, Mail, DollarSign,
  TrendingUp, ArrowRight, Plus, X, LogOut, Utensils, Music, Palette, Camera,
  Shield, Truck, Landmark, Briefcase, User, Split,
} from 'lucide-react';

// Adaptador sobre a Lucide (ícones profissionais, mesmo set da Linear/Shadcn).
// Mantém a API interna estável: <Icon name="..." size filled strokeWidth />.
export type IconName =
  | 'home' | 'search' | 'clipboard' | 'calendar' | 'card' | 'wallet' | 'zap'
  | 'building' | 'star' | 'pin' | 'users' | 'message' | 'check' | 'check-circle'
  | 'mail' | 'dollar' | 'trending' | 'arrow-right' | 'plus' | 'x' | 'logout'
  | 'utensils' | 'music' | 'palette' | 'camera' | 'shield' | 'truck' | 'landmark'
  | 'bolt' | 'briefcase' | 'user' | 'split';

const MAP: Record<IconName, React.ComponentType<any>> = {
  home: Home,
  search: Search,
  clipboard: ClipboardList,
  calendar: Calendar,
  card: CreditCard,
  wallet: Wallet,
  zap: Zap,
  bolt: Zap,
  building: Building2,
  star: Star,
  pin: MapPin,
  users: Users,
  user: User,
  message: MessageCircle,
  check: Check,
  'check-circle': CheckCircle2,
  mail: Mail,
  dollar: DollarSign,
  trending: TrendingUp,
  'arrow-right': ArrowRight,
  plus: Plus,
  x: X,
  logout: LogOut,
  split: Split,
  briefcase: Briefcase,
  utensils: Utensils,
  music: Music,
  palette: Palette,
  camera: Camera,
  shield: Shield,
  truck: Truck,
  landmark: Landmark,
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  filled?: boolean;
  style?: CSSProperties;
}

export default function Icon({ name, size = 20, className = '', strokeWidth = 2, filled = false, style }: IconProps) {
  const Cmp = MAP[name];
  return (
    <Cmp
      size={size}
      className={className}
      strokeWidth={filled ? Math.max(strokeWidth, 1) : strokeWidth}
      fill={filled ? 'currentColor' : 'none'}
      style={style}
      aria-hidden="true"
    />
  );
}
