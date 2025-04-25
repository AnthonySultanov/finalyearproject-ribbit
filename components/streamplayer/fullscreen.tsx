"use client";

import { Maximize, Minimize } from "lucide-react";

import { Hinting } from "@/components/hinting";

interface FullScreenProps {
    isFullscreen: boolean;
    onToggle: () => void;
}

export const FullScreen = ({ isFullscreen, onToggle }: FullScreenProps) => {
    const  Icon = isFullscreen ? Minimize : Maximize;
    const label = isFullscreen ? "Exit fullscreen" : "Enter fullscreen";
    return (
        <div className="flex items-center justify-center gap-4">
        <Hinting label={label} asChild>
          <button onClick={onToggle} className="text-white p-1.5 hover:bg-white/10 rounded-lg">
            <Icon className="h-5 w-5" />
          </button>
        </Hinting>
      </div>
    )
}













