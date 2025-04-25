"use client";


import { ConnectionState, Track } from "livekit-client";
import {useConnectionState,useRemoteParticipant,useTracks,} from "@livekit/components-react";
import { VideoOffline } from "./offlinestream";
import { VideoLoading } from "./loadingstream";
import { LiveStream } from "./livestream";
import { Skeleton } from "../ui/skeleton";



interface VideoProps {
    hostName: string;
    hostIdentity: string;
  }


  export const Video = ({ hostName, hostIdentity }: VideoProps) => {
    const connectionState = useConnectionState();
    const remoteParticipant = useRemoteParticipant(hostIdentity);
    const tracks = useTracks([
        Track.Source.Camera,
        Track.Source.Microphone,
      ]).filter((track) => track.participant.identity === hostIdentity);

      let content;

      if (!remoteParticipant && connectionState === ConnectionState.Connected) {
        content = <VideoOffline  username={hostName} />
      } else if (!remoteParticipant || tracks.length === 0) {
        content = <VideoLoading label={connectionState} />
      } else  {
        content = <LiveStream participant={remoteParticipant} />
      }

    return (
        <div className="aspect-video border-b group relative" >
           {content}
        </div>
    )
}



export const VideoSkeleton = () => {
  return (
    <div className="aspect-video border-x border-background">
      <Skeleton className="h-full w-full rounded-none" />
    </div>
  );
}
