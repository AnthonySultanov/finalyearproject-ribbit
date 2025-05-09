"use client";

import { UserIconSkeleton, UserPF } from "@/components/usericon";
import { VerifiedCheckmark } from "@/components/verifiedcheckmark";
import { useRemoteParticipant } from "@livekit/components-react";
import { useParticipants } from "@livekit/components-react";
import { UserIcon } from "lucide-react";
import { FollowStreamHandler, FollowStreamHandlerSkeleton } from "./Followstreamhandler";
import { Skeleton } from "../ui/skeleton";

interface StreamHeaderProps {
 
  viewerIdentity: string;
  isFollowing: boolean;
  imageUrl: string;
  hostName: string;
  hostIdentity: string;
  name: string;
}


export const StreamHeader = ({ viewerIdentity, isFollowing, imageUrl, hostName, hostIdentity, name }: StreamHeaderProps) => { 

    const participants = useParticipants();
    const participant = useRemoteParticipant(hostIdentity);
  
    const isLive = !!participant;
   //we do -1 because we dont want to count the host
    const participantCount = participants.length - 1;
  
    const hostAsViewer = `Host-${hostIdentity}`;
    const isHost = viewerIdentity === hostAsViewer;
    return (
        <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 items-start justify-between px-4">
            <div className="flex items-center gap-x-3">
            <UserPF imageUrl={imageUrl} username={hostName} size="lg" isLive={isLive} showLiveDot />
            <div className="space-y-1">
          <div className="flex items-center gap-x-2">
            <h2 className="text-lg font-semibold">
                {hostName}
            </h2>
            <VerifiedCheckmark />
            </div>
            <p className="text-sm font-semibold">
                {name}
            </p>
            {isLive ? (
            <div className="font-semibold flex gap-x-1 items-center text-xs text-rose-500">
              <UserIcon className="h-4 w-4" />
              <p>
                {participantCount}{" "}
                {participantCount === 1 ? "viewer" : "viewers"}
              </p>
            </div>
          ) : (
            <p className="font-semibold text-xs text-muted-foreground">
              Offline
            </p>
          )}
            </div>
            </div>
            <FollowStreamHandler isFollowing={isFollowing} hostIdentity={hostIdentity} isHost={isHost}/>    
        </div>

    )
}

export const StreamHeaderSkeleton = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 items-start justify-between px-4">
          <div className="flex items-center gap-x-2">
            <UserIconSkeleton size="lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <FollowStreamHandlerSkeleton />
        </div>
      );
    }

