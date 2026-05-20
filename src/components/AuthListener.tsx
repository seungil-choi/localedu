"use client";

/**
 * Supabase 인증 상태를 Zustand 스토어와 동기화하는 글로벌 리스너.
 * 루트 layout.tsx에 한 번만 마운트.
 */

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAppStore, type AuthUser, type AuthProvider } from "@/store/useAppStore";

function providerFromIdentity(user: { app_metadata?: { provider?: string } }): AuthProvider {
  const p = user.app_metadata?.provider;
  if (p === "kakao") return "kakao";
  if (p === "google") return "google";
  if (p === "email") return "email";
  return "google";
}

export function AuthListener() {
  const setUser = useAppStore((s) => s.setUser);
  const logout = useAppStore((s) => s.logout);

  useEffect(() => {
    // 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        const authUser: AuthUser = {
          name:
            u.user_metadata?.full_name ??
            u.user_metadata?.name ??
            u.email?.split("@")[0] ??
            "사용자",
          email: u.email ?? undefined,
          provider: providerFromIdentity(u),
          loggedInAt: new Date().toISOString(),
          supabaseId: u.id,
        };
        setUser(authUser);
      }
    });

    // 세션 변경 구독 (로그인/로그아웃)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const u = session.user;
          const authUser: AuthUser = {
            name:
              u.user_metadata?.full_name ??
              u.user_metadata?.name ??
              u.email?.split("@")[0] ??
              "사용자",
            email: u.email ?? undefined,
            provider: providerFromIdentity(u),
            loggedInAt: new Date().toISOString(),
            supabaseId: u.id,
          };
          setUser(authUser);
        } else {
          logout();
        }
      },
    );

    return () => subscription.unsubscribe();
  }, [setUser, logout]);

  return null;
}
