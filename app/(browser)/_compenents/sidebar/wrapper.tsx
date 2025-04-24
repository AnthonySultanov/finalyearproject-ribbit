"use client";

import { cn } from "@/lib/utils";
import { useEnableSidebar } from "@/storing/enable-sidebar";
import { useState, useEffect } from "react";
import { ToggleSkeleton } from "./toggle";
import { RecommendedUsersSkeleton } from "./recommended-users";
import { FollowedUsersSkeleton } from "./followed-users";

interface WrapperObject {
children: React.ReactNode
};

export const Wrapper = ({children}: WrapperObject) => {
    const [isClient, becomeClient] = useState(false)
    const { collapsed} = useEnableSidebar((state) => state);

    useEffect(() => {
        becomeClient(true);
    }, []);

    if (!isClient) return (
        <aside className={cn("fixed left-0 flex flex-col w-[65px] lg:w-60 h-full bg-green-950 border-r border-green-900 z-50", collapsed && "w-[60px]")}>
        <ToggleSkeleton />
        <FollowedUsersSkeleton />
        <RecommendedUsersSkeleton />
        </aside>
    );


    return (
       <aside className={cn("fixed left-0 flex flex-col w-60 h-full bg-green-950 border-r border-green-900 z-50", collapsed && "w-[60px]")}>
        {children}
        </aside>
    );
};