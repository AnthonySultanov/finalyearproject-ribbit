"use client";

import { whenblock, whenunblock } from "@/actions/block";
import { whenfollow, whenunfollow } from "@/actions/follow";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";


interface followactionprops {
   alreadyfollowing: boolean;
   userid: string;
   
};



export const Actions = ({ alreadyfollowing, userid }: followactionprops) => {


   const [isPending, startTransition] = useTransition();

   const handelingthefollowing = () => {
    startTransition(() => {
        whenfollow(userid).then((data) => toast.success(`Successfully followed ${data.following.username}`)).catch(() => toast.error("Failed to follow account"))
    });
   }

   const handelingtheunfollowing = () => {
      startTransition(() => {
          whenunfollow(userid).then((data) => toast.success(`Successfully unfollowed ${data.following.username}`)).catch(() => toast.error("ERRORERRORERROR"))
      });
     }
   



   const onClick = () => {
    if (alreadyfollowing) {
      handelingtheunfollowing();
    } else {
      handelingthefollowing();
    }
   }

   const handelingtheblocking = () => {
    startTransition(() => {
      whenblock(userid).then((data) => toast.success(`Successfully blocked ${data.blocked.username}`)).catch(() => toast.error("Failed to block account"))
    });
   }


   return (
    <>
    <Button variant="primary" onClick={onClick} disabled={isPending}>{alreadyfollowing ? "Unfollow" : "Follow"} </Button>
    <Button onClick={handelingtheblocking} disabled={isPending}>Block </Button>
    </>
   );
};



