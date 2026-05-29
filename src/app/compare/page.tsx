import { CompareClient } from "./_components/CompareClient";

export const metadata = { title: "비교 결과" };

/**
 * /compare?ids=a,b,c — URL 파라미터 기반.
 *
 * compareIds 영속 상태 대신 URL로 전달되는 세션 모드.
 * 보관함의 다중 선택에서 진입.
 */
export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids } = await searchParams;
  const idList = ids ? ids.split(",").filter(Boolean) : [];
  return <CompareClient academyIds={idList} />;
}
