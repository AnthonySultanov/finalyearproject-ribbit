"use client"

import { whenunblock } from "@/actions/block";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";




interface UnblockUserButtonProps {
    userId: string;
}

export const UnblockUserButton = ({ userId }: UnblockUserButtonProps) => {



    const [isPending, startTransition] = useTransition();
    const onClick = () => {
        startTransition(() => {
            whenunblock(userId)
            .then((result) =>
              toast.success(`User ${result.blocked.username} unblocked`)
            )
            .catch(() => toast.error("Something went wrong"));
        });
      };
    
    return (
        <Button disabled={isPending} onClick={onClick} variant="link" size="sm" className="text-green-500 w-full">
        Unblock
      </Button>
    )
}
