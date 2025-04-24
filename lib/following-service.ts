import { db } from "@/lib/db";
import { infouser } from "@/lib/services-fetchuser";




export const getfollowedusers = async () => {
  try {
    const self = await infouser();

    const followedusers = await db.following.findMany({
      where: {
        followerId: self.id,
        following: {
          blocking: {
            none: {
              blockedId: self.id,
            },
          },
        },
      },
      include: {
        following: true,
      }
    });
    return followedusers;
      } catch {
    return[];
  }
};






export const followingtheuser = async (id: string) => {
    try {
       const self = await infouser();

       const otheraccount = await db.userlogged.findUnique({
        where: {
            id: id,
        },
       });

       if (!otheraccount) {
        throw new Error("No user found");
       }
//you will always follow yourself
       if (self.id === otheraccount.id) {
        return true;
       }

       const alreadyfollowing = await db.following.findFirst({
        where: {
            followerId: self.id,
            followingId: otheraccount.id,
        },
       });

       
       return !!alreadyfollowing;

    } catch  {
       return false;
    }
};
//follow the user function
export const followtheuser = async (id: string) => {
    const self = await infouser();

    const otheraccount = await db.userlogged.findUnique({
        where: {
            id: id,
        },
    });

    if (!otheraccount) {
        throw new Error("No user found");
    }

  if (self.id === otheraccount.id) {
    throw new Error("You cannot follow yourself");
  }

  const alreadyfollowing = await db.following.findFirst({
    where: {
        followerId: self.id,
        followingId: otheraccount.id,
    },
  });

  if (alreadyfollowing) {
    throw new Error("You are already following this user");
  }


  const following = await db.following.create({
    data: {
      followerId: self.id,
      followingId: otheraccount.id,
    },
    include: {
      follower: true,
      following: true,
    },
  });

  return following;
};

export const unfollowtheuser = async (id: string) => {
    const self = await infouser();
//find the user you want to unfollow
    const otheraccount = await db.userlogged.findUnique({
      where: {id, }
    });

    if (!otheraccount) {
        throw new Error("No user found");
    }

    if (self.id === otheraccount.id) {
        throw new Error("You cannot unfollow yourself");
    }
//check if you are following the user
    const alreadyfollowing = await db.following.findFirst({
        where: {
          followingId: otheraccount.id,
          followerId: self.id,
          
        },
    });
//if you are not following the user you cannot unfollow them
    if (!alreadyfollowing) {
        throw new Error("You are not following this user");
    }

    const followthem = await db.following.delete({
        where: {
            id: alreadyfollowing.id,
        },
        include: {
            
            following: true
        },
    });

    return followthem;


  }

