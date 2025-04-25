"use server";

import { unblocktheuser } from "@/lib/blocking-service";
import { infouser } from "@/lib/services-fetchuser";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const unbanByUsername = async (username: string) => {
  try {
    const self = await infouser();
    
    //this will find the user to unban
    const userToUnban = await db.userlogged.findUnique({
      where: { username }
    });

    if (!userToUnban) {
      throw new Error(`User ${username} not found`);
    }

    if (self.id === userToUnban.id) {
      throw new Error("You cannot unban yourself");
    }

    //this will check if the user is blocked
    const isBlocked = await db.blocking.findFirst({
      where: {
        blockerId: self.id,
        blockedId: userToUnban.id
      }
    });

    if (!isBlocked) {
      throw new Error(`${username} is not banned`);
    }

    //here we will unblock the user
    const unblockedUser = await unblocktheuser(userToUnban.id);
    
    revalidatePath(`/u/${self.username}/community`);
    
    return {
      success: true,
      message: `Successfully unbanned ${username}`,
      user: userToUnban
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to unban user",
      user: null
    };
  }
};
