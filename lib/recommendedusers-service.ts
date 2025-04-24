import { db } from "./db";

import {infouser} from "./services-fetchuser";



export const recommendedusers = async () => {

    let userId;

    try {
        const self = await infouser();
        userId = self.id;
    }catch {
        userId = null;
    }


    let accounts = [];


    if (userId){
        accounts = await db.userlogged.findMany({where: {AND: [{NOT:{id: userId}},{NOT:{followedby: {some: {followerId: userId}}}}, {NOT: {blocking: {some: {blockedId: userId,}}}}],},orderBy: {createdAt: "desc"}, });
    } else {
        accounts = await db.userlogged.findMany({orderBy: {createdAt: "desc"}, });
    }


     
   



    return accounts;

};


