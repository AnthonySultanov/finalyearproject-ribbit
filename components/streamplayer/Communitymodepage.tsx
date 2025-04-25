"use client";

import { useParticipants } from "@livekit/components-react";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useMemo } from "react";
import { LocalParticipant, RemoteParticipant } from "livekit-client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommunityInformation } from "./communityinfo";


interface CommunitymodeProps {
    viewerName: string;
    hostName: string;
    isHidden: boolean;
}





export const Communitymode = ({ viewerName, hostName, isHidden }: CommunitymodeProps) => {
   
    const participants = useParticipants();
    const [value, setValue] = useState("");
    const debouncedValue = useDebounceValue<string>(value, 500);

    const onChange = (newValue: string) => {
        setValue(newValue);
      };
    

      const filteredchatters = useMemo(() => {
        const seentwice = participants.reduce((acc, participant) => {
          const hostasviewer = `Host-${participant.identity}`;
          if (!acc.some((p) => p.identity === hostasviewer)) {
            acc.push(participant);
          }
          return acc;
        }, [] as (RemoteParticipant | LocalParticipant)[]);

    return seentwice.filter((participant) => {
        return participant.name
          ?.toLowerCase()
          .includes(debouncedValue[0].toLowerCase());
      });
    }, [participants, debouncedValue]);
  
    if (isHidden) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">Community not enabled</p>
        </div>
      );
    }
    

    return (
        <div className="p-4">
          <Input onChange={(e) => onChange(e.target.value)} placeholder="Search user" className="border-white/10"/>  
          <ScrollArea className="gap-y-2 mt-4">
          <p className="text-center text-sm text-muted-foreground hidden last:block p-2">
          No results
        </p>
        {filteredchatters.map((participant) => (
          <CommunityInformation key={participant.identity} hostName={hostName} viewerName={viewerName} participantName={participant.name} participantIdentity={participant.identity}/>
        ))}
        </ScrollArea>
        </div>
    )
}

