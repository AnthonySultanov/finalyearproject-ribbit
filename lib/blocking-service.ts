import { db } from "@/lib/db";
import { infouser } from "@/lib/services-fetchuser";


export const isblockedusers = async (id: string) => {
    try {
        const self = await infouser();
        const otheraccount = await db.userlogged.findUnique({
            where: {id}
        });

        if (!otheraccount) {
            throw new Error("No blocked users found");
        }
       

        if (otheraccount.id === self.id) {
            return false;
        }

//check if blocked
        const blockedusers = await db.blocking.findFirst({
            where: {
                blockerId: otheraccount.id,
                blockedId: self.id
            }
        });

        return !!blockedusers;

        

    } catch {
        return false;
    };
};




export const blocktheuser = async (id: string) => {
    const self = await infouser();

    if (self.id === id) {
        throw new Error("You cannot block yourself");
    }

    const otheraccount = await db.userlogged.findUnique({
        where: {id}
    });

    if (!otheraccount) {
        throw new Error("No user found");
    }

    const alreadyblocked = await db.blocking.findFirst({
        where: {
            blockerId: self.id,
            blockedId: otheraccount.id
        }
    });

    if (alreadyblocked) {
        throw new Error("You are already blocking this user");
    }
//this creates the block
    const blockthem = await db.blocking.create({
        data: {
            blockerId: self.id,
            blockedId: otheraccount.id
        },
        include: {
            blocked: true
        }
    });

    return blockthem;
};



export const unblocktheuser = async (id: string) => {
    const self = await infouser();

    if (self.id === id) {
        throw new Error("You cannot unblock yourself");
    }

    const otheraccount = await db.userlogged.findUnique({
        where: {id}
    });

    if (!otheraccount) {
        throw new Error("No user found");
    }

   const alreadyblocked = await db.blocking.findFirst({
    where: {
        blockerId: self.id,
        blockedId: otheraccount.id
    }
   });

   if (!alreadyblocked) {
    throw new Error("You are not blocking this user");
   }
//unblocks the user
   const unblockthem = await db.blocking.delete({
    where: {
        id: alreadyblocked.id
    },
    include: {
        blocked: true
    }
   });

   return unblockthem;
};












