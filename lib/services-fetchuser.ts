import { currentUser } from "@clerk/nextjs/server";

import { db } from "./db";




export const infouser = async () => {


    const self = await currentUser();

    if (!self || !self.username) {
        throw new Error("You must be signed in");
    }

    const user = await db.userlogged.findUnique({
        where: {externalUserId: self.id,},
    });


    if (!user) {
        throw new Error("User not found");
    }

    return user;


};


