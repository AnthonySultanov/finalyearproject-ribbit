"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { use } from "react";

interface ChatMessage {
  timestamp: string;
  username: string;
  content: string;
  color: string;
}

export default function ChatPage({ params }: { params: Promise<{ username: string }> }) {
  const searchParams = useSearchParams();
  const isPip = searchParams.get("pip") === "true";
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  
  const { username } = use(params);
  
  useEffect(() => {
    if (!isPip) return;
    
    console.log("PiP chat initialized for", username);
    

    const addMessage = (timestamp: string, username: string, content: string, color: string) => {
      console.log("PiP received message:", { timestamp, username, content });
      setMessages(prev => [{ timestamp, username, content, color }, ...prev]);
    };
    
    
    const handleMessage = (event: MessageEvent) => {
      console.log("PiP received event:", event.data);
      
      if (event.data.type === 'chat-message') {
        addMessage(
          event.data.timestamp,
          event.data.username,
          event.data.content,
          event.data.color || "#ffffff"
        );
      } else if (event.data.type === 'load-history') {
       
        console.log("PiP loading history:", event.data.messages);
        setMessages(event.data.messages || []);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    
    if (window.opener) {
      console.log("PiP sending ready message to parent");
      window.opener.postMessage({ type: 'pip-ready' }, '*');
    }
    

    setTimeout(() => {
      addMessage(
        format(new Date(), "HH:mm"),
        "System",
        "Chat window initialized",
        "#00ff00"
      );
    }, 1000);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isPip, username]);
  
 
  if (!isPip) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Chat for {username}</h1>
        <p>This page is meant to be opened in Picture-in-Picture mode.</p>
        <a 
          href={`/${username}`} 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
        >
          Go to Stream
        </a>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="p-2 border-b border-gray-800 flex justify-between items-center">
        <h1 className="font-bold">{username}'s Chat</h1>
        <span className="text-xs text-gray-400">Picture-in-Picture Mode</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 flex flex-col-reverse">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center mt-4">
            No messages yet
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className="mb-2">
              <span className="text-gray-400 text-xs">{msg.timestamp}</span>{" "}
              <span style={{ color: msg.color }} className="font-semibold">{msg.username}</span>:{" "}
              <span>{msg.content}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}



