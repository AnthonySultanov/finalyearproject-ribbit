import {db} from "@/lib/db";

export const getstreamid = async (userId: string) => {
    const stream = await db.streaming.findUnique({
        where: {
            userId,
        },
    });

    return stream;
};
