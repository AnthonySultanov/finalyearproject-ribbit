import { db } from "./db";

import {infouser} from "./services-fetchuser";


export const recommendedusers = async () => {
    const accounts = await db.userlogged.findMany({orderBy: {createdAt: "desc"}, });
   



    return accounts;

};


