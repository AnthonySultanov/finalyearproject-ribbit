"use client";

import { useviewertoken } from "@/hooks/viewertoken";
import { userlogged, streaming } from "@prisma/client";
import { LiveKitRoom } from "@livekit/components-react";
import { Video } from "./video";
import { Volume } from "./volume";
import { useEnablechatsidebar } from "@/storing/enable-chat-sidebar";
import {cn} from "@/lib/utils";
import { Chat } from "./chat";
import { ToggleChat } from "./togglechat";  
import { VideoSkeleton } from "./video";

import { ChatSkeleton } from "./chat";
import { StreamHeader, StreamHeaderSkeleton } from "./streamheader";
import { AboutStream } from "./Aboutstream";
import { StreamBio } from "./streambio";
import { ChatPlaysHandler } from "./chatplayshandler";



type StreamCustomSettings = {
  name: string;
  isChatEnabled: boolean;
  isChatDelaymode: boolean;
  isChatFollowersOnly: boolean;
  isLive: boolean;
  id: string;
  thumbnailUrl: string | null;
  isChatPlaysEnabled: boolean;
};


type UserCustomSettings = {
  username: string;
  bio: string | null;
  streaming: StreamCustomSettings | null;
  imageUrl: string;
  _count: { followedby: number };
  id: string;
};



interface VideoPlayerProps {
  user: UserCustomSettings;
  stream: StreamCustomSettings;
  isFollowing: boolean;
}

export const VideoPlayer = ({ user, stream, isFollowing }: VideoPlayerProps) => {
  const { token, name, identity } = useviewertoken(user.id);
  const { collapsed } = useEnablechatsidebar((state) => state);

  //console.log(token, name, identity);

  if (!token || !name) {
    return <VideoPlayerSkeleton />;
  }

  return (
    <>
      {collapsed && (
        <div className="hidden lg:block fixed top-[100px] right-2 z-50">
          <ToggleChat />
        </div>
      )}
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
        className={cn("grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full", collapsed && "lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2")}>
        <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10">
          <Video hostName={user.username} hostIdentity={user.id} />
          <StreamHeader
            hostName={user.username}
            hostIdentity={user.id}
            viewerIdentity={identity}
            imageUrl={user.imageUrl}
            isFollowing={isFollowing}
            name={stream.name}
          />
          <AboutStream
            hostIdentity={user.id}
            viewerIdentity={identity}
            name={stream.name}
            thumbnailUrl={stream.thumbnailUrl}
          />
          <StreamBio 
            hostName={user.username}
            hostIdentity={user.id}
            viewerIdentity={identity}
            bio={user.bio}
            followedByCount={user._count.followedby}
          />
        </div>
        <div className={cn("col-span-1", collapsed && "hidden")}>
          <Chat
            viewerName={name}
            hostName={user.username}
            hostIdentity={user.id}
            isFollowing={isFollowing}
            isChatEnabled={true} 
            isChatDelayed={stream.isChatDelaymode}
            isChatFollowersOnly={stream.isChatFollowersOnly}
          />
        </div>
        
     
        <ChatPlaysHandler
          hostIdentity={user.id}
          isChatPlaysEnabled={stream.isChatPlaysEnabled || false}
          isLive={stream.isLive}
          isChatEnabled={true} 
        />
      </LiveKitRoom>
    </>
  );
};

export const VideoPlayerSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full">
      <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10">
        <VideoSkeleton />
        <StreamHeaderSkeleton />
      </div>
      <div className="col-span-1 bg-background">
        <ChatSkeleton /> 
      </div>
    </div>
  );
};


