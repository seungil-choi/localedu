import { ExploreClient } from "./_components/ExploreClient";

export const metadata = {
  title: "지도 탐색 | 학원지도",
};

export default function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; subject?: string }>;
}) {
  return <ExploreClient searchParamsPromise={searchParams} />;
}
