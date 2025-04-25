"use client";


import { useEffect, useRef, useState } from "react";
import { Participant, Track } from "livekit-client";
import { useTracks } from "@livekit/components-react";
import { useEventListener } from "usehooks-ts";
import { FullScreen } from "./fullscreen";
import { Volume } from "./volume";



interface LiveStreamProps {
    participant: Participant;
}


export const LiveStream = ({ participant}: LiveStreamProps) => {


    const videoreffrence = useRef<HTMLVideoElement>(null);
    const wrapperreffrence = useRef<HTMLDivElement>(null);

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [volumeon, setVolume] = useState(0);


    const onVolumeChange = (value: number) => {
        setVolume(+value);
        if (videoreffrence?.current) {
            videoreffrence.current.muted = value === 0;
            videoreffrence.current.volume = +value * 0.01;
        }
      };


    const toggleFullscreen = () => {
        if (isFullscreen) {
          document.exitFullscreen();
          
        } else if (wrapperreffrence?.current) {
            wrapperreffrence.current.requestFullscreen();
            
        }
      };

      const toggleMute = () => {
        const isMuted = volumeon === 0;
    
        setVolume(isMuted ? 50 : 0);
    
        if (videoreffrence?.current) {
            videoreffrence.current.muted = !isMuted;
            videoreffrence.current.volume = isMuted ? 0.5 : 0;
        }
      };

      useEffect(() => {
        onVolumeChange(0);
      }, []);


      const handleFullscreenChange = () => {
        const isCurrentlyFullscreen = document.fullscreenElement !== null;
        setIsFullscreen(isCurrentlyFullscreen);
      };

      useEventListener("fullscreenchange", handleFullscreenChange, wrapperreffrence);

    useTracks([Track.Source.Camera, Track.Source.Microphone])
    .filter((track) => track.participant.identity === participant.identity)
    .forEach((track) => {
      if (videoreffrence.current) {
        track.publication.track?.attach(videoreffrence.current);
      }
    });


    return (
        <div ref={wrapperreffrence} className="relative h-full flex">
      <video ref={videoreffrence} width="100%" />
      <div className="absolute top-0 h-full w-full opacity-0 hover:opacity-100 hover:transition-all">
        <div className="absolute bottom-0 flex h-14 w-full items-center justify-between bg-gradient-to-r from-neutral-900 px-4">
        <Volume value={volumeon} onChange={onVolumeChange} onToggle={toggleMute} />
            <FullScreen isFullscreen={isFullscreen} onToggle={toggleFullscreen } />
            
        </div>
        </div>
      </div>
    )
}

