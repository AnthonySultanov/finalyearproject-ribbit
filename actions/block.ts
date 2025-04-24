"use server";

import { blocktheuser, unblocktheuser } from "@/lib/blocking-service";
import { revalidatePath } from "next/cache";


export const whenblock = async (id: string) => {
    const blockedaccount = await blocktheuser(id);
    
    if (blockedaccount) {
        
        revalidatePath(`/${blockedaccount.blocked.username}`);
    }
    return blockedaccount;
};



export const whenunblock = async (id: string) => {
    const unblockedaccount = await unblocktheuser(id);
    
    if (unblockedaccount) {
        
        revalidatePath(`/${unblockedaccount.blocked.username}`);
    }
    return unblockedaccount;
};




