import { db } from "./db";
import { infouser } from "./services-fetchuser";

export const GetHomepageFeed = async () => {
    let userId;

    try {
      const self = await infouser();
      userId = self.id;
    } catch {
      userId = null;
    }

    let streamfeed = [];

    if (userId) {
        streamfeed = await db.streaming.findMany({
            where: {
                userId: {
                  notIn: await db.blocking.findMany({
                    where: {
                      blockedId: userId
                    },
                    select: {
                      blockerId: true,
                    }
                  }).then(blocks => blocks.map(block => block.blockerId))
                }
            },
            include: {
                user: true
            },
            orderBy: [
                {
                  isLive: "desc",
                },
                {
                  updatedAt: "desc",
                },
            ],
        });
    } else {
        streamfeed = await db.streaming.findMany({
          include: {
            user: true
          },
          orderBy: [
            {
              isLive: "desc",
            },
            {
              updatedAt: "desc",
            },
          ],
        });
    }

    return streamfeed;
}
