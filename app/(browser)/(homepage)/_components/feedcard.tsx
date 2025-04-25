import { StreamThumbnail } from "@/components/streamthumbnail";
import { UserIconSkeleton, UserPF } from "@/components/usericon";
import { streaming, userlogged } from "@prisma/client";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { StreamThumbnailSkeleton } from "@/components/streamthumbnail";

interface FeedCardProps {
    data: streaming & {user : userlogged}
}

export const FeedCard = ({data}: FeedCardProps) => {
    return (
        <Link href={`/${data.user.username}`}>
        <div className="h-full w-full space-y-4" >
            <StreamThumbnail 
            src={data.thumbnailUrl}
            fallback={data.user.imageUrl}
            isLive={data.isLive}
            username={data.user.username}
            />
             <div className="flex gap-x-3">
          <UserPF
            username={data.user.username}
            imageUrl={data.user.imageUrl}
            isLive={data.isLive}
           // showLiveDot={true}
          />
          
           <div className="flex flex-col text-sm overflow-hidden">
            <p className="truncate font-semibold hover:text-green-800">
              {data.name}
            </p>
            <p className="text-muted-foreground">{data.user.username}</p>
          </div>
            </div>
        </div >
        </Link>
    )
}


export const FeedCardSkeleton = () => {
    return (
        <div className="h-full w-full space-y-4">
        <StreamThumbnailSkeleton />
        <div className="flex gap-x-3">
          <UserIconSkeleton />
          <div className="flex flex-col gap-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="w-24 h-3" />
          </div>
        </div>
      </div>
    )
}
