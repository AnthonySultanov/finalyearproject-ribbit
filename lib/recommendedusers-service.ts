import { db } from "./db";

import {infouser} from "./services-fetchuser";



export const recommendedusers = async () => {
    let userId = null;

    try {
        const self = await infouser();
        if (self) {
            userId = self.id;
        }
    } catch {
        userId = null;
    }

    //for non-logged in users just show all streams
    if (!userId) {
        return await db.userlogged.findMany({
            include: {
                streaming: {
                    where: {
                        isLive: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
        });
    }

    let accounts = [];


    if (userId){
        accounts = await db.userlogged.findMany({where: {AND: [{NOT:{id: userId}},{NOT:{followedby: {some: {followerId: userId}}}}, {NOT: {blocking: {some: {blockedId: userId,}}}}],}, include: {streaming: {where: {isLive: true}}}, orderBy: {createdAt: "desc"}, });
    } else {
        accounts = await db.userlogged.findMany({include: {streaming: {where: {isLive: true}}}, orderBy: {createdAt: "desc"}, });
    }


     
   



    return accounts;

};


