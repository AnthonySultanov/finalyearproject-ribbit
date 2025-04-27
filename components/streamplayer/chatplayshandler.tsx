'use client';

import { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { processChatPlaysMessage } from '@/actions/chatplays';

//this will set the cooldown time for the key presses
const KEY_COOLDOWN_MS = 500;

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
  

  const lastKeyPressTimeRef = useRef<number>(0);
  const processedEventIds = useRef<Set<string>>(new Set());
  

  const processedTimestamps = useRef<Map<string, number>>(new Map());
  
 
  const simulateKeyPress = (key: string, sender: string, messageId: string) => {
    const currentTime = Date.now();
    
   
    const eventId = `${key}-${sender}-${messageId || currentTime}`;
    
    
    if (processedEventIds.current.has(eventId)) {
      console.log(`Skipping duplicate event: ${eventId}`);
      return;
    }
    
    //this will prevent the same key from being pressed too frequently
    const senderKey = `${sender}-${key}`;
    if (processedTimestamps.current.has(senderKey)) {
      const lastTime = processedTimestamps.current.get(senderKey) || 0;
      //3 second coolddown
      if (currentTime - lastTime < 3000) { 
        console.log(`Skipping too frequent key ${key} from ${sender}`);
        return;
      }
    }
    
    //here we update the timestamp
    processedTimestamps.current.set(senderKey, currentTime);
    
    //here we clean up the old entries
    if (processedTimestamps.current.size > 100) {
      const oldEntries = Array.from(processedTimestamps.current.entries())
        .filter(([_, time]) => currentTime - time > 10000);
      for (const [key] of oldEntries) {
        processedTimestamps.current.delete(key);
      }
    }
    
    
    processedEventIds.current.add(eventId);
    
  
    if (processedEventIds.current.size > 100) {
      const oldestEntry = processedEventIds.current.values().next().value;
      if (oldestEntry) {
        processedEventIds.current.delete(oldestEntry);
      }
    }
    
  //prevent rapid key presses
    if (currentTime - lastKeyPressTimeRef.current < KEY_COOLDOWN_MS) {
      console.log(`Skipping key press too soon after previous: ${key}`);
      return;
    }
    
   
    lastKeyPressTimeRef.current = currentTime;
    
   
    setLastKeyPressed(key);
    
    console.log(`Dispatching key: ${key} from ${sender} at ${new Date().toISOString()}`);
    
  
    try {
    
      let keyCode;
      let code;
      let char = key;
      
      //special keys
      switch (key) {
        case 'ArrowUp':
          keyCode = 38;
          code = 'ArrowUp';
          break;
        case 'ArrowDown':
          keyCode = 40;
          code = 'ArrowDown';
          break;
        case 'ArrowLeft':
          keyCode = 37;
          code = 'ArrowLeft';
          break;
        case 'ArrowRight':
          keyCode = 39;
          code = 'ArrowRight';
          break;
        case ' ':
          keyCode = 32;
          code = 'Space';
          char = ' ';
          break;
        default:
          //this is for regular keys
          keyCode = key.charCodeAt(0);
          code = key.length === 1 ? `Key${key.toUpperCase()}` : key;
          break;
      }
      
      
      const activeElement = document.activeElement as HTMLElement;
      const isTextInput = activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' || 
        activeElement.getAttribute('contenteditable') === 'true'
      );
      
    //this is for text inputs
      if (isTextInput) {
        console.log('Targeting text input:', activeElement.tagName);
        
   
        if (key.length === 1 || key === ' ') {
   
          if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
          
            const inputEl = activeElement as HTMLInputElement;
            const start = inputEl.selectionStart || 0;
            const end = inputEl.selectionEnd || 0;
            const value = inputEl.value;
            
            inputEl.value = value.substring(0, start) + char + value.substring(end);
            
            inputEl.selectionStart = inputEl.selectionEnd = start + 1;
            
            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
            inputEl.dispatchEvent(new Event('change', { bubbles: true }));
          } else if (activeElement.getAttribute('contenteditable') === 'true') {

            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              const textNode = document.createTextNode(char);
              range.deleteContents();
              range.insertNode(textNode);
              
              range.setStartAfter(textNode);
              range.setEndAfter(textNode);
              selection.removeAllRanges();
              selection.addRange(range);

              activeElement.dispatchEvent(new Event('input', { bubbles: true }));
            }
          }
        } else {
          //this is for special keys
          activeElement.dispatchEvent(new KeyboardEvent('keydown', {
            key: key,
            code: code,
            keyCode: keyCode,
            which: keyCode,
            bubbles: true,
            cancelable: true,
            composed: true
          }));
          
          setTimeout(() => {
            activeElement.dispatchEvent(new KeyboardEvent('keyup', {
              key: key,
              code: code,
              keyCode: keyCode,
              which: keyCode,
              bubbles: true,
              cancelable: true,
              composed: true
            }));
          }, 100);
        }
      } else {
        //this is for non text inputs
        document.dispatchEvent(new KeyboardEvent('keydown', {
          key: key,
          code: code,
          keyCode: keyCode,
          which: keyCode,
          bubbles: true,
          cancelable: true,
          composed: true
        }));
        
        setTimeout(() => {
          document.dispatchEvent(new KeyboardEvent('keyup', {
            key: key,
            code: code,
            keyCode: keyCode,
            which: keyCode,
            bubbles: true,
            cancelable: true,
            composed: true
          }));
        }, 100);
      }
    } catch (error) {
      console.error('Error simulating key press:', error);
    }
  };

  useEffect(() => {
    
    if (!isChatPlaysEnabled || !user || !isChatEnabled) {
      setIsListening(false);
      return;
    }
    
    setIsListening(true);
    toast.success('Chat Plays is active!');
    
    const handleChatMessage = async (event: CustomEvent) => {
      const { message, sender, key, allowedKeys, originalKey } = event.detail;
      
      if (key) {
        console.log(`Chat Plays key ${key} triggered by ${sender} (original: ${originalKey || key})`);
        simulateKeyPress(key, sender, Date.now().toString());
        return;
      }
      
      const result = await processChatPlaysMessage(message, hostIdentity);
      
      if (result.success && result.key) {
        console.log(`Chat Plays key ${result.key} triggered by ${sender}`);
        simulateKeyPress(result.key, sender, Date.now().toString());
      }
    };
    
 
    const chatEventName = 'chat-message';
    const extensionEventName = 'ribbit-chatplays';
    
    window.addEventListener(chatEventName, handleChatMessage as unknown as EventListener);
    window.addEventListener(extensionEventName, handleChatMessage as unknown as EventListener);

    window.dispatchEvent(new CustomEvent('chatplays-ready', { detail: { hostIdentity } }));
    
    return () => {
      window.removeEventListener(chatEventName, handleChatMessage as unknown as EventListener);
      window.removeEventListener(extensionEventName, handleChatMessage as unknown as EventListener);
      setIsListening(false);
    };
  }, [isChatPlaysEnabled, hostIdentity, user, isChatEnabled]);

  //this will check if chat plays is enabled
  if (!isChatPlaysEnabled) return null;

  //this will display the last key pressed
  const formatKeyDisplay = (key: string | null): string => {
    if (!key) return "...";
    
    switch (key) {
      case "ArrowUp": return "↑";
      case "ArrowDown": return "↓";
      case "ArrowLeft": return "←";
      case "ArrowRight": return "→";
      case "Enter": return "⏎";
      default: return key.toUpperCase();
    }
  };

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 p-4 rounded-lg text-white z-50">
      <h3 className="text-sm font-bold">Chat Plays Active</h3>
      <div className="mt-2 text-center">
        <div className="text-2xl font-bold h-12 flex items-center justify-center">
          {formatKeyDisplay(lastKeyPressed)}
        </div>
        <p className="text-xs mt-1">Last key pressed from chat</p>
      </div>
    </div>
  );
};
