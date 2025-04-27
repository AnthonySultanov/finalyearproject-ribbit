"use server";

import { infouser } from "@/lib/services-fetchuser";
import { db } from "@/lib/db";

export interface ChatPlaysResult {
  success: boolean;
  message: string;
  key?: string;
  allowedKeys?: string;
  senderMessage?: string;
}

//this will cache processed messages
const processedMessages = new Map<string, number>();
//set to 5 seconds
const DUPLICATE_PREVENTION_MS = 5000; 

export const processChatPlaysMessage = async (message: string, hostIdentity: string): Promise<ChatPlaysResult> => {
  try {
    //timestamp 
    const messageId = `${message.trim().toLowerCase()}-${hostIdentity}-${Date.now()}`;
    const now = Date.now();
    
    
    for (const [key, timestamp] of processedMessages.entries()) {
      if (key.startsWith(`${message.trim().toLowerCase()}-${hostIdentity}`) && 
          now - timestamp < DUPLICATE_PREVENTION_MS) {
        console.log(`Skipping duplicate message: ${message} for host: ${hostIdentity}`);
        return { success: false, message: "Duplicate message" };
      }
    }
    
    //this updates the processed messages cache
    processedMessages.set(messageId, now);
    
    //this checks old entries from the cache 10 seconds
    for (const [key, timestamp] of processedMessages.entries()) {
      if (now - timestamp > 10000) {
        processedMessages.delete(key);
      }
    }

    const hostUser = await db.userlogged.findUnique({
      where: { id: hostIdentity },
      include: {
        streaming: true,
      },
    });

    if (!hostUser || !hostUser.streaming || !hostUser.streaming.isChatPlaysEnabled) {
      return { success: false, message: "Chat Plays is not enabled" };
    }

    const allowedKeys = hostUser.streaming.allowedChatKeys || "wasd";
    
    //this will get the first character of the message
    const key = message.trim().toLowerCase().charAt(0);

    let isKeyAllowed = false;
    let mappedKey = key;
    
    //special keys i set
    if (allowedKeys === "arrows") {
      
      isKeyAllowed = ["i", "j", "k", "l", "s"].includes(key);
      
     
      if (key === "i") mappedKey = "ArrowUp";
      if (key === "j") mappedKey = "ArrowLeft";
      if (key === "k") mappedKey = "ArrowDown";
      if (key === "l") mappedKey = "ArrowRight";
      if (key === "s") mappedKey = " "; 
    } else if (allowedKeys === "alphabet") {
     
      isKeyAllowed = /^[a-z]$/.test(key);
    }
    
    if (isKeyAllowed) {
      return { 
        success: true, 
        key: mappedKey,
        allowedKeys: allowedKeys,
        message: `Key ${key} is valid for Chat Plays`,
        senderMessage: message
      };
    } else {
      return { success: false, message: "Invalid key for Chat Plays" };
    }
    
  } catch (error) {
    console.error("Chat plays error:", error);
    return { success: false, message: "Error processing Chat Plays command" };
  }
};
