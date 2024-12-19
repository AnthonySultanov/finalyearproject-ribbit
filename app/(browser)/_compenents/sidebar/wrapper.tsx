"use client";

import { cn } from "@/lib/utils";
import { useEnableSidebar } from "@/storing/enable-sidebar";

interface WrapperObject {
children: React.ReactNode
};

export const Wrapper = ({children}: WrapperObject) => {

    const { collapsed} = useEnableSidebar((state) => state);


    return (
       <aside className={cn("fixed left-0 flex flex-col w-60 h-full bg-green-950 border-r border-green-900 z-50", collapsed && "w-[60px]")}>
        {children}
        </aside>
    );
};