import { StreamThumbnail, StreamThumbnailSkeleton } from "@/components/streamthumbnail";
import { userlogged, streaming } from "@prisma/client";
import Link from "next/link";
import { VerifiedCheckmark } from "@/components/verifiedcheckmark";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface StreamedResultCardProps {
    data: {
        id: string;
        title: string;
        thumbnail: string | null;
        isLive: boolean;
        updatedAt: Date;
        user: userlogged;
      };
}

export const StreamedResultCard = ({ data }: StreamedResultCardProps) => {
    return (
        <Link href={`/${data.user.username}`}>
            <div className="w-full flex gap-x-4">
        <div className="relative h-[9rem] w-[16rem]">
          <StreamThumbnail
            src={data.thumbnail}
            fallback={data.user.imageUrl}
            isLive={data.isLive}
            username={data.user.username}
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-x-2">
            <p className="font-bold text-lg cursor-pointer hover:text-blue-500">
              {data.user.username}
            </p>
            <VerifiedCheckmark />
          </div>
          <p className="text-sm text-muted-foreground">{data.title}</p>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(data.updatedAt)}
          </p>
        </div>
      </div>
        </Link>
    );
}



export const StreamedResultCardSkeleton = () => {
    return (
        <div className="w-full flex gap-x-4">
        <div className="relative h-[9rem] w-[16rem]">
          <StreamThumbnailSkeleton />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    )
}
