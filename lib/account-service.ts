import { db } from "@/lib/db";

export const getaccountusername = async (username: string) => {
    const account = await db.userlogged.findUnique({
        where: {
            username
        },
        select: {
            id: true,
            externalUserId: true,
            username: true,
            bio: true,
            imageUrl: true,
            streaming: {
              select: {
                id: true,
                isLive: true,
                isChatDelaymode: true,
                isChatEnabled: true,
                isChatFollowersOnly: true,
                thumbnailUrl: true,
                name: true,
              }
            },
            _count: {
              select: {
                followedby: true,
              }
            }
        }
    });
    return account

    
};

export const getaccountid = async (id: string) => {
 const account = await db.userlogged.findUnique({
    where: { id },
    select: {
      id: true,
      externalUserId: true,
      username: true,
      bio: true,
      imageUrl: true,
      streaming: {
        select: {
          id: true,
          isLive: true,
          isChatDelaymode: true,
          isChatEnabled: true,
          isChatFollowersOnly: true,
          thumbnailUrl: true,
        }
      }
  }
 })
 return account
}
