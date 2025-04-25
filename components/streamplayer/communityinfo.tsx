"use client";


import { Hinting } from "@/components/hinting";
import { whenblock } from "@/actions/block";
import { toast } from "sonner";
import { useTransition } from "react";
import { MinusCircle } from "lucide-react";
import { cn, stringToColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";



interface CommunityInformationProps {
    hostName: string;
    viewerName: string;
    participantName?: string;
    participantIdentity: string;
  }

  export const CommunityInformation = ({ hostName, viewerName, participantName, participantIdentity }: CommunityInformationProps) => {
    const [isPending, startTransition] = useTransition();

  const isself = participantName === viewerName;
  const ishosting = viewerName === hostName;



  const handleBlock = () => {
    if (!participantName || isself || !ishosting) return;

    startTransition(() => {
      whenblock(participantIdentity)
        .then(() => toast.success(`Blocked ${participantName}`))
        .catch(() => toast.error("error while blocking"));
    });
  };

    return (
        <div
        className={cn(
          "group flex items-center justify-between w-full p-2 rounded-md text-sm hover:bg-white/5", isPending && "opacity-50 pointer-events-none")}>
            
            {participantName}
           { ishosting && !isself && (
            <Hinting label="Block">
                <Button variant="ghost" disabled={isPending} onClick={handleBlock} className="h-auto w-auto p-1 opacity-0 group-hover:opacity-100 transition">
                    <MinusCircle className="h-4 w-4 text-muted-foreground"  />
                </Button>
            </Hinting>
           )}
         </div>
    )
}
  
