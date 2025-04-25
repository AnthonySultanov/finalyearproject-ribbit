"use client";
import {Hinting} from "@/components/hinting";
import { Button } from "@/components/ui/button";
import { ArrowLeftFromLine, ArrowRightFromLine, MessageSquare, Users } from "lucide-react";
import { ChatVariant, useEnablechatsidebar } from "@/storing/enable-chat-sidebar";


export const ToggleVarient = () => {
    const { variant, onChangeVariant } = useEnablechatsidebar((state) => state);
    const theChat = variant === ChatVariant.CHAT;
  
    const Icon = theChat ? Users : MessageSquare;
    
    const onToggle = () => {
      const newVariant = theChat ? ChatVariant.COMMUNITY : ChatVariant.CHAT;
    onChangeVariant(newVariant);
    };
  
    const label = theChat ? "Community" : "Back to chat";
    return (
        <Hinting label={label} side="left" asChild>
        <Button onClick={onToggle} variant="ghost" className="h-auto p-2 hover:bg-white/10 hover:text-primary bg-transparent">
          <Icon className="h-4 w-4" />
        </Button>
      </Hinting>
    )
}

















