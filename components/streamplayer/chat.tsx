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
import { v4 as uuidv4 } from "uuid";

import { ChatVariant, useEnablechatsidebar } from "@/storing/enable-chat-sidebar";
import { ChatsHeader, ChatsHeaderSkeleton } from "./chatsheader";
import { ChatModePage, ChatModePageSkeleton } from "./Chatmodepage";
import { Chatlist, ChatlistSkeleton } from "./chatlist";
import { Communitymode } from "./Communitymodepage";
import { format } from "date-fns";
import { stringToColor } from "@/lib/utils";
import { processChatPlaysMessage } from "@/actions/chatplays";

//this will declare the global window property for typescript
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

    //this will check if the user is online
    const isOnline = true; 
    
    //this will check if the chat is hidden
    const isHidden = !isChatEnabled;

    const [value, setValue] = useState("");
    const { chatMessages: messages, send } = useChat();
    
    
    const otherwaymessage = useMemo(() => {
      //sort messages by timestamp
      return messages.sort((a, b) => b.timestamp - a.timestamp);
    }, [messages]);

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
                    //this will update the settings
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

                //this will process all incoming chat messages for chat plays, regardless of source
                if (data.message && data.user) {
                    //this will process any message for Chat Plays
                    processChatPlaysMessage(data.message, hostIdentity)
                        .then((result) => {
                            if (result.success && result.key) {
                                console.log(`Chat Plays: ${result.key} pressed from ${data.user}`);
                                  
                                //this will dispatch event for Chat Plays handler to pick up
                                window.dispatchEvent(new CustomEvent('chat-message', {
                                    detail: {
                                        message: data.message,
                                        sender: data.user,
                                        key: result.key,
                                        allowedKeys: result.allowedKeys || "wasd"
                                    }
                                }));
                                
                                //this will also dispatch for extension
                                window.dispatchEvent(new CustomEvent('ribbit-chat-message', {
                                    detail: {
                                        key: result.key,
                                        message: data.message,
                                        sender: data.user,
                                        allowedKeys: result.allowedKeys || "wasd"
                                    }
                                }));
                            }
                        });
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
    //this will forward messages to PiP window
    const forwardMessagesToPip = () => {
      if (window.pipChatWindow && !window.pipChatWindow.closed) {
 
        window.pipChatWindow = window.pipChatWindow;
        
     
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

    //this will listen for PiP window open event
    window.addEventListener('pip-chat-opened', forwardMessagesToPip);
    
    //this will listen for PiP window ready event
    const handlePipReady = (event: MessageEvent) => {
      if (event.data.type === 'pip-ready') {
        forwardMessagesToPip();
      }
    };
    
    window.addEventListener('message', handlePipReady);
    
    return () => {
      window.removeEventListener('pip-chat-opened', forwardMessagesToPip);
      window.removeEventListener('message', handlePipReady);
    };
  }, [otherwaymessage]);

  //this will send new messages to PiP window
  useEffect(() => {
    if (messages.length > 0 && window.pipChatWindow && !window.pipChatWindow.closed) {
      try {
        //this will get the last message
        const lastMessage = messages[messages.length - 1];
        
        if (lastMessage) {
          console.log("Sending message to PiP:", lastMessage.message);
          
          window.pipChatWindow.postMessage({
            type: 'chat-message',
            timestamp: format(lastMessage.timestamp, "HH:mm"),
            username: lastMessage.from?.name || "Unknown",
            content: lastMessage.message,
            color: stringToColor(lastMessage.from?.name || "")
          }, '*');
        }
      } catch (error) {
        console.error("Error sending message to PiP:", error);
      }
    }
  }, [messages]);

  const onSubmit = () => {
    if (!send) return;

    if (value.startsWith("/")) {
     
    } else {

      send(value);
      
     
      if (window.pipChatWindow && !window.pipChatWindow.closed) {
        try {
          window.pipChatWindow.postMessage({
            type: 'chat-message',
            timestamp: format(new Date(), "HH:mm"),
            username: viewerName || "You",
            content: value,
            color: stringToColor(viewerName || "")
          }, '*');
        } catch (error) {
          console.error("Error sending direct message to PiP:", error);
        }
      }
      
    
    }
    
    setValue("");
  };

  const onChange = (value: string) => {
    setValue(value);
  };
    
    //this will process every chat message from any user
    useEffect(() => {
      if (!messages.length || !isChatEnabled) return;
      
      //this will process the most recent message (at index 0 after our sort)
      const latestMessage = messages[0];
      
   
      if (!latestMessage.from?.name || latestMessage.message.startsWith('System:')) {
        return;
      }
      
      //this will process for Chat Plays
      processChatPlaysMessage(latestMessage.message, hostIdentity)
        .then((result) => {
          if (result.success) {
            console.log(`Chat Plays: ${result.key} pressed from ${latestMessage.from?.name}`);
            
            //this will dispatch event for both handler and extension
            window.dispatchEvent(new CustomEvent('chat-message', {
              detail: {
                message: latestMessage.message,
                sender: latestMessage.from?.name,
                key: result.key,
                allowedKeys: result.allowedKeys
              }
            }));
            
     
            window.dispatchEvent(new CustomEvent('ribbit-chat-message', {
              detail: {
                key: result.key,
                message: latestMessage.message,
                sender: latestMessage.from?.name,
                allowedKeys: result.allowedKeys
              }
            }));
          }
        });
    }, [messages, hostIdentity, isChatEnabled]);

    
    const processedMessageIds = new Set<string>();


    const broadcastToExtension = (key: string, sender: string, message: string) => {
      try {
       
        const event = new CustomEvent('ribbit-chatplays', {
          detail: {
            key: key,
            sender: sender,
            message: message,
            messageId: Date.now().toString(),
            timestamp: Date.now()
          }
        });
        
    
        window.dispatchEvent(event);
        
        //this will use broadcast channel for cross tab communication
        if (window.BroadcastChannel) {
          try {
            const bc = new BroadcastChannel('ribbit-chatplays-channel');
            bc.postMessage({
              key: key,
              sender: sender,
              message: message,
              messageId: Date.now().toString(),
              timestamp: Date.now()
            });
          } catch (err) {
            console.error("BroadcastChannel error:", err);
          }
        }
      } catch (error) {
        console.error("Error broadcasting to extension:", error);
      }
    };


    const processChatPlaysMessageWithMapping = async (message: string, hostIdentity: string, sender: string, messageId: string) => {
      
      if (processedMessageIds.has(messageId)) {
        console.log(`Skipping already processed message: ${messageId}`);
        return;
      }
      
    
      processedMessageIds.add(messageId);
      
      //cleans up old entries
      if (processedMessageIds.size > 100) {
        const oldestEntry = processedMessageIds.values().next().value;
        if (oldestEntry !== undefined) {
          processedMessageIds.delete(oldestEntry);
        }
      }
      
      const currentTime = Date.now();
      
      try {
        const result = await processChatPlaysMessage(message, hostIdentity);
        
        if (result && typeof result === 'object' && result.success && result.key) {
          
          let mappedKey = result.key;
          if (mappedKey.toLowerCase() === 'i') mappedKey = 'ArrowUp';
          if (mappedKey.toLowerCase() === 'k') mappedKey = 'ArrowDown';
          if (mappedKey.toLowerCase() === 'j') mappedKey = 'ArrowLeft';
          if (mappedKey.toLowerCase() === 'l') mappedKey = 'ArrowRight';
          if (mappedKey.toLowerCase() === 'e') mappedKey = 'Enter';
          
          console.log(`Chat Plays: ${mappedKey} pressed from ${sender} (original: ${result.key})`);
          
          //this is the event that the extension will listen for
          window.dispatchEvent(new CustomEvent('ribbit-chatplays', {
            detail: {
              key: mappedKey,
              originalKey: result.key,
              sender: sender,
              timestamp: currentTime,
              messageId: messageId
            }
          }));
        }
      } catch (error) {
        console.error("Error processing chat plays message:", error);
      }
    };

   
    useEffect(() => {
      if (!messages.length || !isChatEnabled) return;

      //get the latest message
      const latestMessage = messages[messages.length - 1];
      if (!latestMessage || !latestMessage.message) return;
      
      //this will check if the message is from the host
      if (!latestMessage.from?.name || latestMessage.message.startsWith('System:')) {
        return;
      }
      
      //creates a unique message id
      const messageId = `${latestMessage.from?.name}-${latestMessage.message}-${Date.now()}`;
      
      //checks if the message has been processed
      if (processedMessageIds.has(messageId)) {
        console.log(`Skipping already processed message: ${messageId}`);
        return;
      }
      
      //this processes the message
      processChatPlaysMessage(latestMessage.message, hostIdentity)
        .then((result) => {
          if (result.success && result.key) {
            console.log(`Chat Plays key ${result.key} triggered by ${latestMessage.from?.name} at ${new Date().toISOString()}`);
            
           
            let mappedKey = result.key;
            
            //this will broadcast the event to the extension
            broadcastToExtension(mappedKey, latestMessage.from?.name || "Unknown", latestMessage.message);
            
            //this will dispatch event for both handler and extension
            window.dispatchEvent(new CustomEvent('chat-message', {
              detail: {
                message: latestMessage.message,
                sender: latestMessage.from?.name,
                key: mappedKey,
                allowedKeys: result.allowedKeys || "wasd",
                messageId: messageId,
                timestamp: Date.now()
              }
            }));
          }
        })
        .catch(error => {
          console.error("Error processing chat message:", error);
        });
    }, [messages, hostIdentity, isChatEnabled]);

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




































