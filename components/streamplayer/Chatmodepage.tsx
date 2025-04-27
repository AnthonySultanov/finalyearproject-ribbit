"use client"

import { useState, useRef, useEffect } from "react";
import {cn} from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {Skeleton} from "@/components/ui/skeleton"
import { ChatInformation } from "./chatinfo";
import { PictureInPicture } from "lucide-react";
import { Hinting } from "@/components/hinting";

interface ChatModePageProps {
   value: string;
   onChange: (value: string) => void;
   onSubmit: () => void;
   isHidden: boolean;
   isFollowing: boolean;
  isFollowersOnly: boolean;
  isChatDelayed: boolean;
}

//this will create a global variable to store the PiP window reference
let pipWindowRef: Window | null = null;

export const ChatModePage = ({
  value,
  onChange,
  onSubmit,
  isHidden,
  isFollowing,
  isFollowersOnly,
  isChatDelayed
}: ChatModePageProps) => {
  const [isChatDelayedBlocked, setIsChatDelayedBlocked] = useState(false);
  const [isPipActive, setIsPipActive] = useState(false);

  const isFollowersnotFollowing = isFollowersOnly && !isFollowing;
  const isDisabled = isHidden || isChatDelayedBlocked || isFollowersnotFollowing;

  //this will check if the PiP window is still open
  useEffect(() => {
    if (isPipActive) {
      const checkWindowClosed = setInterval(() => {
        if (pipWindowRef && pipWindowRef.closed) {
          setIsPipActive(false);
          pipWindowRef = null;
          clearInterval(checkWindowClosed);
        }
      }, 1000);
      
      return () => clearInterval(checkWindowClosed);
    }
  }, [isPipActive]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!value || isDisabled) return;

    if (isChatDelayed && !isChatDelayedBlocked) {
      setIsChatDelayedBlocked(true);
      setTimeout(() => {
        setIsChatDelayedBlocked(false);
        onSubmit();
      }, 3000);  //this adds a 3 second delay
    } else {
      onSubmit();
    }
  };

  const togglePictureInPicture = () => {
    if (!isPipActive) {
      try {
     
        const baseUrl = window.location.origin;
        const pathParts = window.location.pathname.split('/');
        const username = pathParts[pathParts.length - 2] || pathParts[pathParts.length - 1];
        const pipUrl = `${baseUrl}/${username}/chat?pip=true`;
        
        console.log("Opening PiP chat window with URL:", pipUrl);
        
        
        pipWindowRef = window.open(pipUrl, 'StreamChat', 'width=350,height=500,resizable=yes');
        
        if (pipWindowRef) {
      
          window.pipChatWindow = pipWindowRef;
          setIsPipActive(true);
          

          window.dispatchEvent(new CustomEvent('pip-chat-opened'));
          
   
          pipWindowRef.onbeforeunload = () => {
            setIsPipActive(false);
            window.pipChatWindow = null;
          };
          
          //this will check if the window is still open
          const checkInterval = setInterval(() => {
            if (pipWindowRef && pipWindowRef.closed) {
              clearInterval(checkInterval);
              setIsPipActive(false);
              window.pipChatWindow = null;
            }
          }, 1000);
        } else {
          console.error("Failed to open PiP window");
        }
      } catch (error) {
        console.error("Error opening PiP window:", error);
      }
    } else if (pipWindowRef && !pipWindowRef.closed) {
      pipWindowRef.close();
      window.pipChatWindow = null;
      setIsPipActive(false);
    }
  };

  if (isHidden) {
    return null;
  }

  return (
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-y-4 p-3">
          <div className="w-full">
          <ChatInformation isDelayed={isChatDelayed} isFollowersOnly={isFollowersOnly} />
        <Input onChange={(e) => onChange(e.target.value)} value={value} disabled={isDisabled} placeholder="Send a message"className={cn("border-white/10",(isFollowersOnly ) && "rounded-t-none border-t-0")}/>
        </div>
        <div className="flex items-center justify-between w-full">
          <Hinting label="Picture in Picture">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={togglePictureInPicture}
              className={cn("text-muted-foreground", isPipActive && "text-primary")}
            >
              <PictureInPicture className="h-5 w-5" />
            </Button>
          </Hinting>
          <Button type="submit" variant="primary" size="sm" disabled={isDisabled}>
            Chat
          </Button>
        </div>
      </form>
  )
}

export const ChatModePageSkeleton = () => {
    return (
        <div className="flex flex-col items-center gap-y-4 p-3">
        <Skeleton className="w-full h-10" />
        <div className="flex items-center gap-x-2 ml-auto">
          <Skeleton className="h-7 w-7" />
          <Skeleton className="h-7 w-12" />
        </div>
      </div>
    );
}



