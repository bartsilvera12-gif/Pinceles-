import {
  BadgeCheck,
  Clock,
  Users,
  ShieldCheck,
  PaintRoller,
  Store,
  HardHat,
  Factory,
  Layers,
  Wrench,
  Signpost,
  Ruler,
  House,
  Building2,
  Warehouse,
  Fuel,
  Container,
  Landmark,
  Check,
  ArrowRight,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  FileText,
  Mail,
  MapPin,
  Brush,
  type LucideIcon,
} from "lucide-react";

/** Mapa de nombres kebab-case (guardados en la BD) a íconos Lucide. */
const MAP: Record<string, LucideIcon> = {
  "badge-check": BadgeCheck,
  clock: Clock,
  users: Users,
  "shield-check": ShieldCheck,
  "paint-roller": PaintRoller,
  store: Store,
  "hard-hat": HardHat,
  factory: Factory,
  layers: Layers,
  wrench: Wrench,
  signpost: Signpost,
  ruler: Ruler,
  house: House,
  "building-2": Building2,
  warehouse: Warehouse,
  fuel: Fuel,
  container: Container,
  landmark: Landmark,
  check: Check,
  "arrow-right": ArrowRight,
  "arrow-up": ArrowUp,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  x: X,
  menu: Menu,
  "file-text": FileText,
  mail: Mail,
  "map-pin": MapPin,
  brush: Brush,
};

export function Icon({
  name,
  size = 24,
  className,
  strokeWidth = 2,
}: {
  name: string | null | undefined;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = (name && MAP[name]) || Brush;
  return <Cmp size={size} className={className} strokeWidth={strokeWidth} aria-hidden />;
}
