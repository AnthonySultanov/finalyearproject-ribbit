import {db} from "@/lib/db";
import {infouser} from "./services-fetchuser";

export const tosearch = async (term?: string) => {
    try {
        //this will search for users by username directly
        const users = await db.userlogged.findMany({
            where: {
                username: {
                    contains: term || "",
                    mode: 'insensitive',
                },
            },
            include: {
                streaming: true,
            },
        });
        
        //this will transform to match the expected format for StreamedResultCard
        return users.map(user => ({
            id: user.id,
            name: user.username,
            thumbnailUrl: user.streaming?.thumbnailUrl || null,
            isLive: user.streaming?.isLive || false,
            updatedAt: user.updatedAt,
            user: user
        }));
    } catch (error) {
        console.error("Search error:", error);
        return [];
    }
}
