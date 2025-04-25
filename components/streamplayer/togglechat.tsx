"use client";
import {Hinting} from "@/components/hinting";
import { Button } from "@/components/ui/button";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import { useEnablechatsidebar } from "@/storing/enable-chat-sidebar";


export const ToggleChat = () => {
    const { collapsed, onExpand, onCollapse } = useEnablechatsidebar((state) => state);

    const Icon = collapsed ? ArrowLeftFromLine : ArrowRightFromLine;
  
    const onToggle = () => {
      if (collapsed) {
        onExpand();
      } else {
        onCollapse();
      }
    };
  
    const label = collapsed ? "Expand" : "Collapse";
    return (
        <Hinting label={label} side="left" asChild>
        <Button onClick={onToggle} variant="ghost" className="h-auto p-2 hover:bg-white/10 hover:text-primary bg-transparent">
          <Icon className="h-4 w-4" />
        </Button>
      </Hinting>
    )
}

















