import { ExploreClient } from "./_components/ExploreClient";

export const metadata = {
  title: "지도 탐색",
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; subject?: string }>;
}) {
  // Promise를 서버에서 resolve하여 일반 값으로 전달
  // (클라이언트에서 use()로 Promise를 받으면 production에서 Suspense가 무한 loading 상태에 빠짐)
  const sp = await searchParams;
  return <ExploreClient initialQ={sp.q ?? ""} initialSubject={sp.subject ?? ""} />;
}
