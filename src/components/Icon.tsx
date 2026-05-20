/**
 * Semantic Icon — DogEar 아이콘팩의 LocalEdu 웹 포트
 * 출처: https://github.com/seungil-choi/dogear-app/tree/main/icon-pack (MIT)
 *
 * 핵심:
 *   1. 시맨틱 이름(home, search, location, ...)으로 호출 → lucide 종속을 호출부에서 제거
 *   2. "*-filled" 변형은 같은 컴포넌트 + fill prop
 *   3. stroke-width 자동 가중 (작은 사이즈일수록 굵게)
 *
 * 사용:
 *   <Icon name="home" size={24} />
 *   <Icon name="bookmark-filled" size={20} color="var(--color-primary)" />
 */

import {
  // 네비
  Home,
  Map,
  Bookmark,
  User,
  Repeat,
  // 액션
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
  CheckCircle2,
  Plus,
  Minus,
  Search,
  SlidersHorizontal,
  Share2,
  MoreHorizontal,
  Copy,
  RefreshCcw,
  // UI
  Bell,
  MapPin,
  Navigation,
  Camera,
  Image as ImageIcon,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
  Phone,
  // 설정
  Lock,
  Settings,
  ShieldCheck,
  HelpCircle,
  FileText,
  LogOut,
  TriangleAlert,
  Info,
  // 평가·관계
  Star,
  Heart,
  ThumbsUp,
  // 학원 도메인
  GraduationCap,
  BookOpen,
  Calculator,
  Beaker,
  Palette,
  Code2,
  Globe,
  Music,
  Languages,
  // 카테고리·태그
  Tag,
  List,
  LayoutGrid,
  Grid3x3,
  Award,
  Building2,
  Users,
  Train,
  Footprints,
  Clock,
  Calendar,
  CalendarDays,
  ClipboardList,
  MessageCircle,
  CircleDollarSign,
  PiggyBank,
  Trophy,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface IconDef {
  C: LucideIcon;
  filled?: boolean;
}

const ICON_MAP: Record<string, IconDef> = {
  // 네비
  home: { C: Home },
  map: { C: Map },
  bookmark: { C: Bookmark },
  "bookmark-filled": { C: Bookmark, filled: true },
  user: { C: User },
  compare: { C: Repeat },

  // 액션
  close: { C: X },
  back: { C: ChevronLeft },
  forward: { C: ChevronRight },
  down: { C: ChevronDown },
  up: { C: ChevronUp },
  check: { C: Check },
  "check-circle": { C: CheckCircle2 },
  plus: { C: Plus },
  minus: { C: Minus },
  search: { C: Search },
  filter: { C: SlidersHorizontal },
  share: { C: Share2 },
  more: { C: MoreHorizontal },
  copy: { C: Copy },
  refresh: { C: RefreshCcw },

  // UI
  bell: { C: Bell },
  "bell-filled": { C: Bell, filled: true },
  location: { C: MapPin },
  "location-filled": { C: MapPin, filled: true },
  navigate: { C: Navigation },
  camera: { C: Camera },
  image: { C: ImageIcon },
  trash: { C: Trash2 },
  edit: { C: Pencil },
  eye: { C: Eye },
  "eye-off": { C: EyeOff },
  phone: { C: Phone },

  // 설정
  lock: { C: Lock },
  settings: { C: Settings },
  shield: { C: ShieldCheck },
  help: { C: HelpCircle },
  document: { C: FileText },
  logout: { C: LogOut },
  warning: { C: TriangleAlert },
  info: { C: Info },

  // 평가·관계
  star: { C: Star, filled: true },
  "star-outline": { C: Star },
  heart: { C: Heart },
  "heart-filled": { C: Heart, filled: true },
  thumb: { C: ThumbsUp },

  // 학원 도메인 — 과목별
  graduate: { C: GraduationCap },
  book: { C: BookOpen },
  calculator: { C: Calculator },
  beaker: { C: Beaker },
  palette: { C: Palette },
  code: { C: Code2 },
  globe: { C: Globe },
  music: { C: Music },
  languages: { C: Languages },

  // 카테고리·태그
  tag: { C: Tag },
  list: { C: List },
  grid: { C: LayoutGrid },
  "grid-3": { C: Grid3x3 },
  award: { C: Award },
  building: { C: Building2 },
  users: { C: Users },
  train: { C: Train },
  walk: { C: Footprints },
  clock: { C: Clock },
  calendar: { C: Calendar },
  "calendar-days": { C: CalendarDays },
  clipboard: { C: ClipboardList },
  chat: { C: MessageCircle },
  money: { C: CircleDollarSign },
  piggy: { C: PiggyBank },
  trophy: { C: Trophy },
  sparkles: { C: Sparkles },
};

export type IconName = keyof typeof ICON_MAP;

interface IconProps {
  name: IconName;
  /** 픽셀 단위 크기. default 20 (웹 친화) */
  size?: number;
  /** 라인/채움 색상. CSS 변수 가능 */
  color?: string;
  /** 명시 시 자동 가중 무시 */
  strokeWidth?: number;
  className?: string;
}

/**
 * stroke-width 자동 가중:
 *   ≤ 16: 2.0
 *   ≤ 24: 1.75
 *   ≥ 25: 1.5
 */
export function Icon({
  name,
  size = 20,
  color = "currentColor",
  strokeWidth,
  className,
}: IconProps) {
  const def = ICON_MAP[name];
  if (!def) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(`[Icon] Unknown icon name: "${name}"`);
    }
    return (
      <HelpCircle size={size} color={color} strokeWidth={strokeWidth ?? 1.75} />
    );
  }
  const { C, filled } = def;
  const sw = strokeWidth ?? (size <= 16 ? 2 : size <= 24 ? 1.75 : 1.5);
  return (
    <C
      size={size}
      color={color}
      strokeWidth={sw}
      fill={filled ? color : "none"}
      className={className}
    />
  );
}

export const ALL_ICON_NAMES = Object.keys(ICON_MAP) as IconName[];

/**
 * 학원 과목 → 아이콘 매핑 (마커·카드에서 활용)
 */
export const SUBJECT_ICONS: Record<string, IconName> = {
  영어: "languages",
  수학: "calculator",
  국어: "book",
  과학: "beaker",
  사회: "globe",
  예체능: "palette",
  코딩: "code",
};
