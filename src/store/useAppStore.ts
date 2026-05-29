// Zustand store — "use client" 불필요. 훅을 호출하는 클라이언트 컴포넌트에서만 사용됨.
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DEFAULT_FILTER, type FilterState, type Region, type Subject } from "@/lib/types";

/* ─────────────────────────────────────────────────────────
 * 상수
 * ──────────────────────────────────────────────────────── */

/** 최근 본 학원 최대 개수 */
const MAX_RECENT = 8;
/** 보관할 문의 내역 최대 개수 */
const MAX_INQUIRIES = 50;
/** localStorage 영속화 키 */
const PERSIST_KEY = "localedu:v1";

/* ─────────────────────────────────────────────────────────
 * 타입
 * ──────────────────────────────────────────────────────── */

export type InquiryTiming = "이번 주" | "다음 주" | "이번 달" | "언제든";
export type InquiryStatus = "전송됨" | "응답 대기" | "응답 완료";

export interface Inquiry {
  id: string;
  academyIds: string[];
  parentName: string;
  phone: string;
  childGrade: string;
  timing: InquiryTiming;
  message?: string;
  createdAt: string; // ISO
  status: InquiryStatus;
}

export interface ParentProfile {
  region?: Region;
  childGrade?: string; // "초등 2학년" 등
  childBirthYear?: number;
  interests: Subject[];
  onboardingDone: boolean;
  onboardingSkipped?: boolean;
}

export type AuthProvider = "kakao" | "naver" | "google" | "email";

export interface AuthUser {
  name: string;
  email?: string;
  provider: AuthProvider;
  loggedInAt: string;
  supabaseId?: string; // Supabase auth.users.id
}

/* ─────────────────────────────────────────────────────────
 * 스토어 인터페이스
 *
 * 6개 도메인:
 *   1. filter     — 검색 필터 상태
 *   2. saved      — 저장한 학원 (보관함)
 *   3. recent     — 최근 본 학원 (최대 8개)
 *   4. inquiries  — 상담 문의 내역
 *   5. profile    — 학부모 프로필 + 온보딩
 *   6. user       — Supabase OAuth 사용자
 *
 * (비교 학원은 영속 상태가 아닌 /compare?ids=... URL 세션으로 전달)
 * ──────────────────────────────────────────────────────── */

interface AppState {
  // 1. 필터
  filter: FilterState;
  setFilter: (patch: Partial<FilterState>) => void;
  resetFilter: () => void;

  // 2. 저장
  savedIds: string[];
  toggleSaved: (id: string) => void;

  // 3. 최근 본
  recentIds: string[];
  pushRecent: (id: string) => void;

  // 4. 문의
  inquiries: Inquiry[];
  submitInquiry: (payload: Omit<Inquiry, "id" | "createdAt" | "status">) => Inquiry;

  // 5. 학부모 프로필 (온보딩 결과)
  profile: ParentProfile;
  updateProfile: (patch: Partial<ParentProfile>) => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;

  // 6. 인증
  user: AuthUser | null;
  loginWith: (provider: AuthProvider, name?: string) => AuthUser;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

/* ─────────────────────────────────────────────────────────
 * 영속화 정책
 *
 * - `filter`는 새 세션에서 기본값으로 초기화 (검색 의도가 sticky하면 어색)
 * - 그 외 (saved/recent/inquiries/profile/user)는 localStorage 보존
 * ──────────────────────────────────────────────────────── */

const PROVIDER_FALLBACK_NAME: Record<AuthProvider, string> = {
  kakao: "카카오 사용자",
  naver: "네이버 사용자",
  google: "구글 사용자",
  email: "이메일 사용자",
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      /* ── 1. 필터 ─────────────────────────────── */
      filter: DEFAULT_FILTER,
      setFilter: (patch) => set({ filter: { ...get().filter, ...patch } }),
      resetFilter: () => set({ filter: DEFAULT_FILTER }),

      /* ── 2. 저장 ─────────────────────────────── */
      savedIds: [],
      toggleSaved: (id) => {
        const list = get().savedIds;
        set({
          savedIds: list.includes(id) ? list.filter((x) => x !== id) : [...list, id],
        });
      },

      /* ── 3. 최근 본 ──────────────────────────── */
      recentIds: [],
      pushRecent: (id) => {
        const list = get().recentIds.filter((x) => x !== id);
        set({ recentIds: [id, ...list].slice(0, MAX_RECENT) });
      },

      /* ── 4. 문의 ─────────────────────────────── */
      inquiries: [],
      submitInquiry: (payload) => {
        const inquiry: Inquiry = {
          ...payload,
          id: `q-${Date.now().toString(36)}`,
          createdAt: new Date().toISOString(),
          status: "전송됨",
        };
        set({ inquiries: [inquiry, ...get().inquiries].slice(0, MAX_INQUIRIES) });
        return inquiry;
      },

      /* ── 5. 프로필 ────────────────────────────── */
      profile: {
        interests: [],
        onboardingDone: false,
      },
      updateProfile: (patch) =>
        set({ profile: { ...get().profile, ...patch } }),
      completeOnboarding: () =>
        set({ profile: { ...get().profile, onboardingDone: true } }),
      skipOnboarding: () =>
        set({
          profile: {
            ...get().profile,
            onboardingDone: true,
            onboardingSkipped: true,
          },
        }),

      /* ── 6. 인증 ─────────────────────────────── */
      user: null,
      loginWith: (provider, name) => {
        const u: AuthUser = {
          name: name ?? PROVIDER_FALLBACK_NAME[provider],
          provider,
          loggedInAt: new Date().toISOString(),
        };
        set({ user: u });
        return u;
      },
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: PERSIST_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        // filter는 의도적으로 제외 — 새 세션은 기본값으로
        savedIds: s.savedIds,
        recentIds: s.recentIds,
        inquiries: s.inquiries,
        profile: s.profile,
        user: s.user,
      }),
    },
  ),
);
