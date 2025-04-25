import { useMemo } from "react";
import { Info } from "lucide-react";

import { Hinting } from "@/components/hinting";

interface ChatInformationProps {
    isDelayed: boolean;
    isFollowersOnly: boolean;
}



export const ChatInformation = ({isDelayed, isFollowersOnly}: ChatInformationProps) => {

const hinting = useMemo(() => { 
     if (isFollowersOnly && !isDelayed) {
    return "Followers Only chat";
  }

  if (isDelayed && !isFollowersOnly) {
    return "Please wait 3 seconds before sending a message";
  }

  if (isDelayed && isFollowersOnly) {
    return "Followers Only chat and slow mode";
  }

  return "";
}, [isDelayed, isFollowersOnly]);

const label = useMemo(() => {
  if (isFollowersOnly && !isDelayed) {
    return "Followers only";
  }

  if (isDelayed && !isFollowersOnly) {
    return "Slow mode";
  }

  if (isDelayed && isFollowersOnly) {
    return "Followers only and slow mode";
  }

  return "";
}, [isDelayed, isFollowersOnly]);

if (!isDelayed && !isFollowersOnly) {
  return null;
}



   return (
    <div className="p-2 text-muted-foreground bg-white/5 border border-white/10 w-full rounded-t-md flex items-center gap-x-2">
    <Hinting label={hinting} >
    <Info className="w-4 h-4" />
    </Hinting>
    <p className="text-sm">{label}</p>
  </div>
   )
}
