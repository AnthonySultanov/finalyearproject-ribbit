import { Suspense } from "react";
import { Feed, FeedSkeleton, } from "./_components/streamfeed";

export default function Homepage() {
  return (


<div className="h-full p-8 mx-auto max-w-screen-2xl">
<Suspense fallback={<FeedSkeleton />}>
<Feed />
</Suspense>


</div>

  );
}



