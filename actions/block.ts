"use server";

import { blocktheuser, unblocktheuser } from "@/lib/blocking-service";
import { infouser } from "@/lib/services-fetchuser";
import { RoomServiceClient } from "livekit-server-sdk";
import { revalidatePath } from "next/cache";


const roomclient = new RoomServiceClient(process.env.LIVEKIT_URL!, process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!)

export const whenblock = async (id: string) => {
    
    const self = await infouser();
   
    let blocktheaccount;
    
    try {
      blocktheaccount = await blocktheuser(id);
    } catch {
     //user is guest account
    }

    try {
        await roomclient.removeParticipant(self.id, id);
      } catch {
        //user not in the room
      }
    
    revalidatePath(`/u/${self.username}/community`);
    return blocktheaccount;
};



export const whenunblock = async (id: string) => {
    const unblockedaccount = await unblocktheuser(id);
    
    if (unblockedaccount) {
        
        revalidatePath(`/${unblockedaccount.blocked.username}`);
    }
    return unblockedaccount;
};




