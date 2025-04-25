"use client";


import { Volume1, Volume2, VolumeX } from "lucide-react";
import { Hinting } from "@/components/hinting";
import { Slider } from "@/components/ui/slider";


interface VolumeProps {
    value: number;
    onChange: (value: number) => void;
    onToggle: () => void;
}


export const Volume = ({ value, onChange, onToggle }: VolumeProps) => {

    const isfullymuted = value === 0;
    const volumehalf = value > 50;
  
    let Icon = Volume1;
  
    if (isfullymuted) {
      Icon = VolumeX;
    } else if (volumehalf) {
      Icon = Volume2;
    }
  
    const label = isfullymuted ? "Unmute" : "Mute";
  
    const handleChange = (value: number[]) => {
      onChange(value[0]);
    };

    return (
        <div className="flex items-center gap-2">
          <Hinting label={label} asChild>
            <button
              onClick={onToggle}
              className="text-white hover:bg-white/10 p-1.5 rounded-lg"
            >
              <Icon className="h-6 w-6" />
            </button>
          </Hinting>
          <Slider
            className="w-[8rem] cursor-pointer"
            onValueChange={handleChange}
            value={[value]}
            max={100}
            step={1}
          />
        </div>
      );



}












