import type { CSSProperties } from "react";
import {
  Stethoscope,
  Users,
  FlaskConical,
  GraduationCap,
  Landmark,
  LayoutTemplate,
  ShieldCheck,
  LineChart,
  Folder,
  BookOpen,
  FileText,
  Wrench,
  ListChecks,
  Scale,
  PlayCircle,
  Database,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  users: Users,
  "flask-conical": FlaskConical,
  "graduation-cap": GraduationCap,
  landmark: Landmark,
  "layout-template": LayoutTemplate,
  "shield-check": ShieldCheck,
  "line-chart": LineChart,
  folder: Folder,
  "book-open": BookOpen,
  "file-text": FileText,
  wrench: Wrench,
  "list-checks": ListChecks,
  scale: Scale,
  "play-circle": PlayCircle,
  database: Database,
};

export function CategoryIcon({
  name,
  className,
  style,
}: {
  name: string;
  className?: string;
  style?: CSSProperties;
}) {
  const Cmp = ICONS[name] ?? Folder;
  return <Cmp className={className} style={style} aria-hidden />;
}
