'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { processChatPlaysMessage } from '@/actions/chatplays';

export const ChatPlaysHandler = ({
  hostIdentity,
  isChatPlaysEnabled,
  isLive = false,
  isChatEnabled = true
}: {
  hostIdentity: string;
  isChatPlaysEnabled: boolean;
  isLive?: boolean;
  isChatEnabled?: boolean;
}) => {
  const [isListening, setIsListening] = useState(false);
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);
  const { user } = useUser();
  
  //this will simulate the key press
  const simulateKeyPress = (key: string) => {
    //this will set the pressed key
    setLastKeyPressed(key);
    
    //this will dispatch the event for the extension to pick up
    window.dispatchEvent(new CustomEvent('ribbit-chatplays', {
      detail: { key }
    }));
    
    //this will map the keys if needed
    let keyToPress = key;
    if (key === 'u') keyToPress = 'ArrowUp';
    if (key === 'd') keyToPress = 'ArrowDown';
    if (key === 'l') keyToPress = 'ArrowLeft';
    if (key === 'r') keyToPress = 'ArrowRight';
    
    try {
      //this will create and dispatch the keyboard events
      const keyDownEvent = new KeyboardEvent('keydown', {
        key: keyToPress,
        code: `Key${keyToPress.toUpperCase()}`,
        bubbles: true
      });
      
      document.dispatchEvent(keyDownEvent);
      
      
      setTimeout(() => {
        const keyUpEvent = new KeyboardEvent('keyup', {
          key: keyToPress,
          code: `Key${keyToPress.toUpperCase()}`,
          bubbles: true
        });
        document.dispatchEvent(keyUpEvent);
        
     
      }, 100);
    } catch (error) {
      console.error("Error simulating key press:", error);
    }
  };


  useEffect(() => {
    //this will check if the chat plays is enabled and the user is logged in or streaming
    if (!isChatPlaysEnabled || !user || !isLive || !isChatEnabled) {
      setIsListening(false);
      return;
    }
    
    setIsListening(true);
    toast.success('Chat Plays is active!');
    
  
    const handleChatMessage = async (event: CustomEvent) => {
      const { message, sender, key, allowedKeys } = event.detail;
      
    
      if (key) {
        console.log(`Chat Plays key ${key} triggered by ${sender}`);
        simulateKeyPress(key);
        return;
      }
      
 
      const result = await processChatPlaysMessage(message, hostIdentity);
      
      if (result.success && result.key) {
        console.log(`Chat Plays key ${result.key} triggered by ${sender}`);
        simulateKeyPress(result.key);
      }
    };
    

    const chatEventName = 'chat-message';
    

    window.addEventListener(chatEventName, handleChatMessage as unknown as EventListener);
    
    return () => {
      window.removeEventListener(chatEventName, handleChatMessage as unknown as EventListener);
      setIsListening(false);
    };
  }, [isChatPlaysEnabled, hostIdentity, user, isLive, isChatEnabled]);

  if (!isListening) return null;


  return (
    <div className="fixed bottom-4 left-4 bg-black/80 p-4 rounded-lg text-white z-50">
      <h3 className="text-sm font-bold">Chat Plays Active</h3>
      <div className="mt-2 text-center">
        <div className="text-2xl font-bold h-12 flex items-center justify-center">
          {lastKeyPressed ? lastKeyPressed.toUpperCase() : "..."}
        </div>
        <p className="text-xs mt-1">Last key pressed from chat</p>
      </div>
    </div>
  );
};
