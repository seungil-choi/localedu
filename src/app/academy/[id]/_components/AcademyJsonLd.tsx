import type { Academy } from "@/lib/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://localedu.app";

/**
 * 학원 상세 페이지의 Google Rich Results용 JSON-LD.
 *
 * EducationalOrganization (학원 일반 정보) +
 *  - postalAddress
 *  - geoCoordinates
 *  - aggregateRating (후기 1건 이상일 때만)
 *
 * Schema.org 문서: https://schema.org/EducationalOrganization
 */
export function AcademyJsonLd({ academy: a }: { academy: Academy }) {
  const json: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE_URL}/academy/${a.id}`,
    name: a.name,
    url: `${SITE_URL}/academy/${a.id}`,
    description:
      a.one_line_summary || a.judgement || `${a.region} ${a.dong}의 ${a.subject} 학원`,
    address: {
      "@type": "PostalAddress",
      addressCountry: "KR",
      addressLocality: a.region,
      streetAddress: a.address,
    },
    geo:
      a.lat && a.lng
        ? {
            "@type": "GeoCoordinates",
            latitude: a.lat,
            longitude: a.lng,
          }
        : undefined,
  };

  if (a.rating > 0 && a.review_count > 0) {
    json.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: a.rating.toFixed(1),
      reviewCount: a.review_count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return (
    <script
      type="application/ld+json"
      // dangerouslySetInnerHTML은 SSR 환경에서 가장 안전한 JSON-LD 주입 방법.
      // 사용자 입력이 아닌 빌드 타임 데이터만 직렬화한다.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
