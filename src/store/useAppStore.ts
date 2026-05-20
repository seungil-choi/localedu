"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DEFAULT_FILTER, type FilterState, type Region, type Subject } from "@/lib/types";

const MAX_COMPARE = 3;

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

interface AppState {
  // 필터
  filter: FilterState;
  setFilter: (patch: Partial<FilterState>) => void;
  resetFilter: () => void;

  // 비교
  compareIds: string[];
  toggleCompare: (id: string) => void;
  removeCompare: (id: string) => void;
  clearCompare: () => void;

  // 저장
  savedIds: string[];
  toggleSaved: (id: string) => void;

  // 최근 본
  recentIds: string[];
  pushRecent: (id: string) => void;

  // 문의
  inquiries: Inquiry[];
  submitInquiry: (
    payload: Omit<Inquiry, "id" | "createdAt" | "status">,
  ) => Inquiry;

  // 학부모 프로필 (온보딩 결과)
  profile: ParentProfile;
  updateProfile: (patch: Partial<ParentProfile>) => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;

  // 인증
  user: AuthUser | null;
  loginWith: (provider: AuthProvider, name?: string) => AuthUser;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      filter: DEFAULT_FILTER,
      setFilter: (patch) => set({ filter: { ...get().filter, ...patch } }),
      resetFilter: () => set({ filter: DEFAULT_FILTER }),

      compareIds: [],
      toggleCompare: (id) => {
        const list = get().compareIds;
        if (list.includes(id)) {
          set({ compareIds: list.filter((x) => x !== id) });
        } else if (list.length < MAX_COMPARE) {
          set({ compareIds: [...list, id] });
        }
      },
      removeCompare: (id) =>
        set({ compareIds: get().compareIds.filter((x) => x !== id) }),
      clearCompare: () => set({ compareIds: [] }),

      savedIds: [],
      toggleSaved: (id) => {
        const list = get().savedIds;
        set({
          savedIds: list.includes(id)
            ? list.filter((x) => x !== id)
            : [...list, id],
        });
      },

      recentIds: [],
      pushRecent: (id) => {
        const list = get().recentIds.filter((x) => x !== id);
        set({ recentIds: [id, ...list].slice(0, 8) });
      },

      inquiries: [],
      submitInquiry: (payload) => {
        const inquiry: Inquiry = {
          ...payload,
          id: `q-${Date.now().toString(36)}`,
          createdAt: new Date().toISOString(),
          status: "전송됨",
        };
        set({ inquiries: [inquiry, ...get().inquiries].slice(0, 50) });
        return inquiry;
      },

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

      user: null,
      loginWith: (provider, name) => {
        const fallbackNames: Record<AuthProvider, string> = {
          kakao: "카카오 사용자",
          naver: "네이버 사용자",
          google: "구글 사용자",
          email: "이메일 사용자",
        };
        const u: AuthUser = {
          name: name ?? fallbackNames[provider],
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
      name: "localedu:v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        compareIds: s.compareIds,
        savedIds: s.savedIds,
        recentIds: s.recentIds,
        inquiries: s.inquiries,
        profile: s.profile,
        user: s.user,
      }),
    },
  ),
);

export const MAX_COMPARE_SLOTS = MAX_COMPARE;
