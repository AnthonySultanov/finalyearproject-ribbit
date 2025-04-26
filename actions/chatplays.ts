"use server";

import { infouser } from "@/lib/services-fetchuser";
import { db } from "@/lib/db";


export const processChatPlaysMessage = async (message: string, hostIdentity: string) => {
  try {

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
    

    const key = message.trim().toLowerCase().charAt(0);

    let isKeyAllowed = false;
    
    switch (allowedKeys) {
      case "wasd":
        isKeyAllowed = ["w", "a", "s", "d"].includes(key);
        break;
      case "arrows":
        //this will map common text inputs to arrow keys
        isKeyAllowed = ["up", "down", "left", "right", "u", "d", "l", "r"].includes(key);
        break;
      case "1234":
        isKeyAllowed = ["1", "2", "3", "4"].includes(key);
        break;
      case "space":
        isKeyAllowed = [" ", "space"].includes(key);
        break;
      case "alphabet":
        isKeyAllowed = /^[a-z]$/.test(key);
        break;
      case "custom":
        //this will need custom parsing logic here
        isKeyAllowed = true;
        break;
      default:
        isKeyAllowed = false;
    }
    
    if (isKeyAllowed) {
      return { 
        success: true, 
        key: key,
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
