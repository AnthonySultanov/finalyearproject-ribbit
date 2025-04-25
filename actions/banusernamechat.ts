
"use server";

import { blocktheuser } from "@/lib/blocking-service";
import { infouser } from "@/lib/services-fetchuser";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { RoomServiceClient } from "livekit-server-sdk";

const roomclient = new RoomServiceClient(
  process.env.LIVEKIT_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export const banByUsername = async (username: string) => {
  try {
    const self = await infouser();
    
    //here we will find the user to ban
    const userToBan = await db.userlogged.findUnique({
      where: { username }
    });

    if (!userToBan) {
      throw new Error(`User ${username} not found`);
    }

    if (self.id === userToBan.id) {
      throw new Error("You cannot ban yourself");
    }

    //here we will check if the user is already blocked
    const alreadyBlocked = await db.blocking.findFirst({
      where: {
        blockerId: self.id,
        blockedId: userToBan.id
      }
    });

    if (alreadyBlocked) {
      throw new Error(`${username} is already banned`);
    }

    //here we will block the user
    const blockedUser = await blocktheuser(userToBan.id);
    
    //here we will remove the user from the room if present
    try {
      await roomclient.removeParticipant(self.id, userToBan.id);
    } catch {
      
    }
    
    revalidatePath(`/u/${self.username}/community`);
    
    return {
      success: true,
      message: `Successfully banned ${username}`,
      user: userToBan
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to ban user",
      user: null
    };
  }
};

