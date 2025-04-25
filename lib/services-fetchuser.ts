import { currentUser } from "@clerk/nextjs/server";

import { db } from "./db";




export const infouser = async () => {


    const self = await currentUser();

    if (!self || !self.username) {
        throw new Error("Notallowed");
    }

    const user = await db.userlogged.findUnique({
        where: {externalUserId: self.id,},
    });


    if (!user) {
        throw new Error("Not found");
    }

    return user;


};



export const fetchusername = async (username: string) => {

   

    const user = await db.userlogged.findUnique({
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
    });

  
    return user;
}




