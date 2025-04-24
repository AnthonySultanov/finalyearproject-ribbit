import { db } from "@/lib/db";

export const getaccountusername = async (username: string) => {
    const account = await db.userlogged.findUnique({
        where: {
            username
        }
    });
    return account
};
