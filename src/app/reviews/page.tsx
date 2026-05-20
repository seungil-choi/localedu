import { ReviewsClient } from "./_components/ReviewsClient";

export const metadata = {
  title: "후기",
  robots: { index: false, follow: false },
};

export default function ReviewsPage() {
  return <ReviewsClient />;
}
