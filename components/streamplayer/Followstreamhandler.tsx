"use client";

import { toast } from "sonner";
import { Heart } from "lucide-react";
import { useTransition } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { whenfollow, whenunfollow } from "@/actions/follow";

interface FollowStreamHandlerProps {
    isFollowing: boolean;
    hostIdentity: string;
    isHost: boolean;

    
  }
  
  
  export const FollowStreamHandler = ({ isFollowing, hostIdentity, isHost }: FollowStreamHandlerProps) => {

    const { userId } = useAuth();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const FollowStream = () => {
        startTransition(() => {
          whenfollow(hostIdentity)
            .then((data) =>
              toast.success(`Following ${data.following.username}`)
            )
            .catch(() => toast.error("Error"));
        });
      };

      const UnFollowStream = () => {
        startTransition(() => {
          whenunfollow(hostIdentity)
            .then((data) =>
              toast.success(`Unfollowed ${data.following.username}`)
            )
            .catch(() => toast.error("Error"));
        });
      };
   

const AllowedToFollowStream = () => {
    if (!userId) {
      return router.push("/sign-in");
    }

    if (isHost) return;

    if (isFollowing) {
      UnFollowStream();
    } else {
      FollowStream();
    }
  };


    return (
        <Button disabled={isPending || isHost} onClick={AllowedToFollowStream} variant="primary" size="sm" className="w-full lg:w-auto">
        <Heart className={cn("h-4 w-4 mr-2", isFollowing ? "fill-white" : "fill-none")}/>
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    )
}



export const FollowStreamHandlerSkeleton = () => {
    return <Skeleton className="h-10 w-full lg:w-24" />;
}
