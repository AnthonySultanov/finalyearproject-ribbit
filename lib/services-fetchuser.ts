import { currentUser } from "@clerk/nextjs/server";
import { db, withRetry } from "./db";

export const infouser = async () => {
    const self = await currentUser();

    if (!self || !self.username) {
        throw new Error("Notallowed");
    }

    //this will find the user in the database
    const user = await withRetry(() => 
        db.userlogged.findUnique({
            where: {externalUserId: self.id,},
        })
    );

    if (!user) {
        throw new Error("Not found");
    }

    return user;
};

export const fetchusername = async (username: string) => {
  //this will try to find the user in the database
    const user = await withRetry(() => 
        db.userlogged.findUnique({
            where: {
                username
            },
            include: {
                streaming: true,
                _count: {
                    select: {
                        followedby: true
                    }
                }
            }
        })
    );
  
    return user;
}
