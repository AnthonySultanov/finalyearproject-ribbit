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
      //this will create a new window for PiP chat
      pipWindowRef = window.open('', 'StreamChat', 'width=350,height=500,resizable=yes');
      
      if (pipWindowRef) {
        pipWindowRef.document.write(`
          <html>
            <head>
              <title>Stream Chat</title>
              <style>
                body { 
                  background-color: #121212; 
                  color: white; 
                  font-family: sans-serif;
                  margin: 0;
                  padding: 0;
                  height: 100vh;
                  overflow: hidden;
                  display: flex;
                  flex-direction: column;
                }
                .header {
                  padding: 10px;
                  background-color: #1a1a1a;
                  border-bottom: 1px solid #333;
                  font-weight: bold;
                  text-align: center;
                }
                .chat-area {
                  flex: 1;
                  overflow-y: auto;
                  padding: 10px;
                  display: flex;
                  flex-direction: column-reverse;
                }
                .footer {
                  padding: 10px;
                  background-color: #1a1a1a;
                  border-top: 1px solid #333;
                  text-align: center;
                }
                .message {
                  margin-bottom: 8px;
                  display: flex;
                }
                .timestamp {
                  color: #666;
                  font-size: 12px;
                  margin-right: 8px;
                }
                .username {
                  font-weight: bold;
                  margin-right: 5px;
                }
                .content {
                  word-break: break-word;
                }
              </style>
            </head>
            <body>
              <div class="header">Stream Chat</div>
              <div class="chat-area" id="chatMessages"></div>
              <div class="footer">Picture-in-Picture Mode</div>
              <script>
                // Store chat messages to repopulate if needed
                let messages = [];
                
                // Function to add a message to the chat
                window.addMessage = function(timestamp, username, content, color) {
                  const msgDiv = document.createElement('div');
                  msgDiv.className = 'message';
                  
                  const timeSpan = document.createElement('span');
                  timeSpan.className = 'timestamp';
                  timeSpan.textContent = timestamp;
                  
                  const nameSpan = document.createElement('span');
                  nameSpan.className = 'username';
                  nameSpan.textContent = username + ':';
                  nameSpan.style.color = color || '#ffffff';
                  
                  const contentSpan = document.createElement('span');
                  contentSpan.className = 'content';
                  contentSpan.textContent = content;
                  
                  msgDiv.appendChild(timeSpan);
                  msgDiv.appendChild(nameSpan);
                  msgDiv.appendChild(contentSpan);
                  
                  document.getElementById('chatMessages').prepend(msgDiv);
                  
                  // Store message
                  messages.push({timestamp, username, content, color});
                };
                
                // Listen for messages from parent window
                window.addEventListener('message', function(event) {
                  if (event.data.type === 'chat-message') {
                    window.addMessage(
                      event.data.timestamp,
                      event.data.username,
                      event.data.content,
                      event.data.color
                    );
                  } else if (event.data.type === 'load-history') {
                    // Load existing messages from history
                    event.data.messages.forEach(msg => {
                      window.addMessage(
                        msg.timestamp,
                        msg.username,
                        msg.content,
                        msg.color
                      );
                    });
                  }
                });
              </script>
            </body>
          </html>
        `);
        
        
        setIsPipActive(true);
        //this will expose the window globally so chat.tsx can access it
        (window as any).pipChatWindow = pipWindowRef;
        
        //this will dispatch a custom event to notify chat component 
        window.dispatchEvent(new CustomEvent('pip-chat-opened'));
      }
    } else {
      //this will close the PiP window if it exists
      if (pipWindowRef && !pipWindowRef.closed) {
        pipWindowRef.close();
      }
      pipWindowRef = null;
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
