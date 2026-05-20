/**
 * MVP / Phase 2 기능 게이트
 *
 * 사용자 100명 규모 초기에는 데이터 의존도가 높은 기능을
 * 비활성화한다. 데이터가 충분히 쌓이면 (≥1,000건 후기 등) 단계적으로 켠다.
 *
 * - MVP: 정성 데이터 부족해도 사용 가능한 핵심 흐름만
 * - Phase 2: 자동 추천 / 다축 점수 / 폴더 / 일괄 액션 / 별도 후기 피드 / 도움돼요
 */
export const SCOPE = {
  /* MVP 핵심 — true */
  mapExplore: true,
  academyDetail: true,
  saveAcademy: true,
  compareAcademy: true,
  consultationCTA: true,
  inlineReviewsOnDetail: true,

  /* Phase 2 — false (데이터 임계 규모 필요) */
  reviewFeedPage: false, // 별도 후기 페이지 (nav 노출 X)
  scoreSystem5Axis: false, // 비교함 5축 점수
  autoRecommendation: false, // 자동 추천 1순위 (대신 평점 1위만 표시)
  savedFolders: false, // 저장함 폴더 분류
  bulkSelectActions: false, // 저장함 다중 선택 일괄 액션
  similarAcademiesWidget: false, // 저장한 학원과 비슷한 학원
  helpfulCounter: false, // 후기 도움돼요
  shareCompareLink: false, // 비교함 링크 공유
  inquiryHistoryTable: false, // 마이 문의 내역 테이블
  compareTabsExtra: false, // 비교함 상세/후기/위치 탭
  compareMemo: false, // 비교 메모
  advancedFiltersCollapsed: true, // 가격/스타일/숙제량 — 토글 안에 숨김

  /* 학원 상세 — 학원 self-input 데이터 의존 */
  detailTabs: false, // 8개 탭 — 자연 스크롤로 대체
  detailCurriculum: false, // 커리큘럼 섹션
  detailFaculty: false, // 강사진 섹션
  detailQnA: false, // Q&A 섹션

  /* 홈 — 부수 콘텐츠 */
  homeBigStats: false, // 강북구 학원 현황 큰 카드 4칸 (간결한 한 줄로 대체)
  homeNearRegionsCards: false, // 근처 지역 카드 (한 줄 안내로 대체)
} as const;
