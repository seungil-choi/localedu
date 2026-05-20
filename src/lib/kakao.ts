/**
 * 카카오 지도 JavaScript SDK 싱글턴 로더.
 * 환경변수: NEXT_PUBLIC_KAKAO_MAP_KEY
 *
 * 키가 없거나 로드 실패 시 호출자가 fallback (SVG MapCanvas) 으로 대응.
 */

declare global {
  interface Window {
    kakao?: KakaoNamespace;
  }
}

export interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

export interface KakaoMap {
  setCenter(latlng: KakaoLatLng): void;
  setLevel(level: number): void;
  panTo(latlng: KakaoLatLng): void;
  getLevel(): number;
}

export interface KakaoCustomOverlay {
  setMap(map: KakaoMap | null): void;
  getContent(): HTMLElement | string;
}

export type KakaoNamespace = {
  maps: {
    load: (cb: () => void) => void;
    LatLng: new (lat: number, lng: number) => KakaoLatLng;
    Map: new (
      container: HTMLElement,
      options: { center: KakaoLatLng; level: number },
    ) => KakaoMap;
    CustomOverlay: new (options: {
      position: KakaoLatLng;
      content: HTMLElement | string;
      yAnchor?: number;
      xAnchor?: number;
      clickable?: boolean;
      zIndex?: number;
    }) => KakaoCustomOverlay;
    event: {
      addListener: (
        target: KakaoMap | KakaoCustomOverlay,
        type: string,
        handler: () => void,
      ) => void;
    };
  };
};

let loadPromise: Promise<KakaoNamespace> | null = null;

export function getKakaoKey(): string | undefined {
  return process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
}

export function isKakaoEnabled(): boolean {
  return Boolean(getKakaoKey());
}

export function loadKakaoMaps(): Promise<KakaoNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("SSR: cannot load Kakao SDK"));
  }
  if (window.kakao?.maps) return Promise.resolve(window.kakao);
  if (loadPromise) return loadPromise;

  const key = getKakaoKey();
  if (!key) {
    return Promise.reject(new Error("NEXT_PUBLIC_KAKAO_MAP_KEY not set"));
  }

  loadPromise = new Promise<KakaoNamespace>((resolve, reject) => {
    const existing = document.getElementById("kakao-maps-sdk") as
      | HTMLScriptElement
      | null;
    if (existing) {
      existing.addEventListener("load", () => {
        window.kakao!.maps.load(() => resolve(window.kakao!));
      });
      return;
    }
    const script = document.createElement("script");
    script.id = "kakao-maps-sdk";
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(
      key,
    )}&autoload=false`;
    script.onload = () => {
      if (!window.kakao) {
        reject(new Error("Kakao SDK loaded but window.kakao missing"));
        return;
      }
      window.kakao.maps.load(() => resolve(window.kakao!));
    };
    script.onerror = () => reject(new Error("Failed to load Kakao SDK"));
    document.head.appendChild(script);
  });

  return loadPromise;
}
