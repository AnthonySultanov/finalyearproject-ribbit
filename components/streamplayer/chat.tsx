"use client";

import { useEffect, useMemo, useState } from "react";
import { ConnectionState, DataPacket_Kind, RoomEvent } from "livekit-client";
import { useMediaQuery } from "usehooks-ts";
import {
  useChat,
  useConnectionState,
  useRemoteParticipant,
  useRoomContext,
} from "@livekit/components-react";

import { ChatVariant, useEnablechatsidebar } from "@/storing/enable-chat-sidebar";
import { ChatsHeader, ChatsHeaderSkeleton } from "./chatsheader";
import { ChatModePage, ChatModePageSkeleton } from "./Chatmodepage";
import { Chatlist, ChatlistSkeleton } from "./chatlist";
import { Communitymode } from "./Communitymodepage";
import { format } from "date-fns";
import { stringToColor } from "@/lib/utils";

//this will declare the global window property for TypeScript
declare global {
  interface Window {
    pipChatWindow?: Window | null;
  }
}

interface ChatProps {
    viewerName: string;
    hostName: string;
    hostIdentity: string;
    isFollowing: boolean;
    isChatEnabled: boolean;
    isChatDelayed: boolean;
    isChatFollowersOnly: boolean;
}

export const Chat = ({ 
  viewerName, 
  hostName, 
  hostIdentity, 
  isFollowing, 
  isChatEnabled: initialChatEnabled, 
  isChatDelayed: initialChatDelayed, 
  isChatFollowersOnly: initialChatFollowersOnly 
}: ChatProps) => {
    const matches = useMediaQuery("(max-width: 1024px)");
    const { variant, onExpand } = useEnablechatsidebar((state) => state);
    const connectionState = useConnectionState();
    const remoteParticipant = useRemoteParticipant(hostIdentity);
    const room = useRoomContext();

    //this will create state variables for chat settings that can be updated in real time
    const [isChatEnabled, setIsChatEnabled] = useState(initialChatEnabled);
    const [isChatDelayed, setIsChatDelayed] = useState(initialChatDelayed);
    const [isChatFollowersOnly, setIsChatFollowersOnly] = useState(initialChatFollowersOnly);

    const isOnline = remoteParticipant && connectionState === ConnectionState.Connected;

    const isHidden = !isChatEnabled || !isOnline;

    const [value, setValue] = useState("");
    const { chatMessages: messages, send } = useChat();

    //this will listen for data messages from the host
    useEffect(() => { 
        if (!room) return;

        //this will handle data messages for chat settings
        const handleDataReceived = (payload: Uint8Array, _: any, kind?: DataPacket_Kind) => {
            try {
                //this will decode the message
                const dataString = new TextDecoder().decode(payload);
                const data = JSON.parse(dataString);
                
                //this will check if it's a chat settings update
                if (data.type === 'chat_settings_update') {
                    //this will update the local state with the new settings
                    if (data.isChatEnabled !== undefined) {
                        setIsChatEnabled(data.isChatEnabled);
                    }
                    if (data.isChatDelaymode !== undefined) {
                        setIsChatDelayed(data.isChatDelaymode);
                    }
                    if (data.isChatFollowersOnly !== undefined) {
                        setIsChatFollowersOnly(data.isChatFollowersOnly);
                    }
                }
            } catch (error) {
                console.error('Error parsing data message:', error);
            }
        };

        //this will subscribe to data messages
        room.on(RoomEvent.DataReceived, handleDataReceived);

        //this will cleanup on unmount
        return () => {
            room.off(RoomEvent.DataReceived, handleDataReceived);
        };
    }, [room]);

  useEffect(() => {
    if (matches) {
      onExpand();
    }
  }, [matches, onExpand]);

  //this will handle the PiP chat window
  useEffect(() => {
    //this will forward new messages to PiP window if open
    const forwardMessagesToPip = () => {
      if (window.pipChatWindow && !window.pipChatWindow.closed) {
        //this will send existing messages when PiP opens
        const formattedMessages = otherwaymessage.map(msg => ({
          timestamp: format(msg.timestamp, "HH:mm"),
          username: msg.from?.name || "Unknown",
          content: msg.message,
          color: stringToColor(msg.from?.name || "")
        }));
        
        window.pipChatWindow.postMessage({
          type: 'load-history',
          messages: formattedMessages
        }, '*');
      }
    };

    //this will listen for PiP window opening
    window.addEventListener('pip-chat-opened', forwardMessagesToPip);
    
    return () => {
      window.removeEventListener('pip-chat-opened', forwardMessagesToPip);
    };
  }, [messages]);

  //this will send new messages to PiP window
  useEffect(() => {
    if (messages.length > 0 && window.pipChatWindow && !window.pipChatWindow.closed) {
      const lastMessage = messages[0]; // Most recent message
      
      window.pipChatWindow.postMessage({
        type: 'chat-message',
        timestamp: format(lastMessage.timestamp, "HH:mm"),
        username: lastMessage.from?.name || "Unknown",
        content: lastMessage.message,
        color: stringToColor(lastMessage.from?.name || "")
      }, '*');
    }
  }, [messages]);

  const otherwaymessage = useMemo(() => {
    //sort messages by timestamp
    return messages.sort((a, b) => b.timestamp - a.timestamp);
  }, [messages]);

  const onSubmit = () => {
    if (!send) return;

    //this will check if it's a ban command
    if (value.startsWith('/ban ')) {
      //this will only allow the streamer/host to use the ban command
      if (viewerName === hostName) {
        const username = value.substring(5).trim();
        if (username) {
          //this will show a system message in chat - only visible to the host
          send(`Attempting to ban user: ${username}...`);
          
          //this will call the ban action
          import('@/actions/banusernamechat').then(({ banByUsername }) => {
            banByUsername(username).then((result: { success: boolean, message: string }) => {
              if (result.success) {
                send(`System: ${result.message}`);
              } else {
                send(`System: Failed to ban ${username}. ${result.message}`);
              }
            });
          });
        } else {
          send("System: Invalid ban command. Use /ban username");
        }
      } else {
        //this will send a message if the user is not the host
        send("System: Only the streamer can use the /ban command");
      }
    } 
    //this will check if it's an unban command
    else if (value.startsWith('/unban ')) {
      //this will only allow the streamer/host to use the unban command
      if (viewerName === hostName) {
        const username = value.substring(7).trim();
        if (username) {
          //this will show a system message in chat - only visible to the host
          send(`Attempting to unban user: ${username}...`);
          
          //this will call the unban action
          import('@/actions/unbanusernamechat').then(({ unbanByUsername }) => {
            unbanByUsername(username).then((result: { success: boolean, message: string }) => {
              if (result.success) {
                send(`System: ${result.message}`);
              } else {
                send(`System: Failed to unban ${username}. ${result.message}`);
              }
            });
          });
        } else {
          send("System: Invalid unban command. Use /unban username");
        }
      } else {
        //this will send a message if the user is not the host
        send("System: Only the streamer can use the /unban command");
      }
    } else {
      //this will send a normal message
      send(value);
    }
    
    setValue("");
  };

  const onChange = (value: string) => {
    setValue(value);
  };
    
    return (
        <div className="flex flex-col bg-background border-l border-b pt-0 h-[calc(100vh-80px)]">
      <ChatsHeader />

      {variant === ChatVariant.CHAT && (
        <>
        <Chatlist messages={otherwaymessage} isHidden={isHidden} />
        <ChatModePage 
              onSubmit={onSubmit}
              onChange={onChange}
              value={value}
              isHidden={isHidden}
              isFollowersOnly={isChatFollowersOnly}
              isFollowing={isFollowing}
              isChatDelayed={isChatDelayed}
        />
        </>
      )}
      {variant === ChatVariant.COMMUNITY && (
        <>
        <Communitymode viewerName={viewerName} hostName={hostName} isHidden={isHidden}/>
        </>
      )}
      </div>
    );
};

export const ChatSkeleton = () => {
  return (
    <div className="flex flex-col border-l border-b pt-0 h-[calc(100vh-80px)] border-2">
      <ChatsHeaderSkeleton />
      <ChatlistSkeleton />
      <ChatModePageSkeleton />
    </div>
  );
};


















