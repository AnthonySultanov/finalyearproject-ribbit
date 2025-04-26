"use server";

import { db } from "@/lib/db";
import { infouser } from "@/lib/services-fetchuser";
import { AccessToken, RoomServiceClient, DataPacket_Kind } from "livekit-server-sdk";
import { streaming } from "@prisma/client";
import { revalidatePath } from "next/cache";    

//this initializes the LiveKit RoomServiceClient
const roomClient = new RoomServiceClient(
  process.env.LIVEKIT_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

//this is the interface for the updatestream function
interface UpdateStreamProps {
  name?: string;
  thumbnailUrl?: string | null;
  isChatEnabled?: boolean;
  isChatDelaymode?: boolean;
  isChatFollowersOnly?: boolean;
  isChatPlaysEnabled?: boolean;
  allowedChatKeys?: string;
}

export const updatestream = async (values: UpdateStreamProps) => {
   try {
    const self = await infouser();
    const selfstream = await db.streaming.findUnique({
        where: {
            userId: self.id
        }
    });
    
    if (!selfstream) {
        throw new Error("Stream not found");
    }

    const validdata = {
        name: values.name,
        isChatEnabled: values.isChatEnabled,
        isChatDelaymode: values.isChatDelaymode,
        isChatFollowersOnly: values.isChatFollowersOnly,
        thumbnailUrl: values.thumbnailUrl,
        isChatPlaysEnabled: values.isChatPlaysEnabled,
        allowedChatKeys: values.allowedChatKeys,
    };

    const updatedStream = await db.streaming.update({
        where: {id: selfstream.id},
        data: {
            ...validdata,
         
        }
    });

    //this will send the updated settings to the room
    if (
      values.isChatEnabled !== undefined ||
      values.isChatDelaymode !== undefined ||
      values.isChatFollowersOnly !== undefined
    ) {
      //this will create a data message with the updated settings
      const dataMessage = {
        type: "chat_settings_update",
        isChatEnabled: updatedStream.isChatEnabled,
        isChatDelaymode: updatedStream.isChatDelaymode,
        isChatFollowersOnly: updatedStream.isChatFollowersOnly,
      };
      
      try {
        //this will convert the data message to a JSON 
        const data = new TextEncoder().encode(JSON.stringify(dataMessage));
        
        //this will use the RoomServiceClient to send data to all participants in the room
        await roomClient.sendData(self.id, data, DataPacket_Kind.RELIABLE);
      } catch (err) {
        console.error("Failed to publish chat settings update:", err);
        
      }
    }

    revalidatePath(`/u/${self.username}/chat`);
    revalidatePath(`/u/${self.username}`);
    revalidatePath(`/${self.username}`);

return updatedStream;
   
   } catch (error) {
    throw new Error("Failed to update stream");
   }
}

