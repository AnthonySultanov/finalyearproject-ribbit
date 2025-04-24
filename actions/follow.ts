"use server";
import { revalidatePath } from "next/cache";
//imports from the following-service.ts file
import { followtheuser, unfollowtheuser } from "@/lib/following-service";
//this is the function that follows a user
export const whenfollow = async (id: string) => {
   try {
    const followedaccount = await followtheuser(id);
    revalidatePath("/");
        if (followedaccount) {
          revalidatePath(`/${followedaccount.following.username}`);
        }
  return followedaccount;

   } catch (error) {
   throw new Error("Failed to follow user");
   }
}
//this is the function that unfollows a user
export const whenunfollow = async (id: string) => {
   try {
    const unfollowedaccount = await unfollowtheuser(id);
    revalidatePath("/");
    if (unfollowedaccount) {
      revalidatePath(`/${unfollowedaccount.following.username}`);
    }
    return unfollowedaccount;
   } catch (error) {
    throw new Error("Failed to unfollow user");
   }
}

