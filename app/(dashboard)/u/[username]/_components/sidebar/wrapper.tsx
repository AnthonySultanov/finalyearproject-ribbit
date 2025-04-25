"use client";


import { cn } from "@/lib/utils";
import { useEnableDashboardSidebar } from "@/storing/enable-dashboardpage-sidebar";


interface WrapperProps {
    children: React.ReactNode;
}


export const Wrapper = ({children}: WrapperProps) => {





    const {collapsed} = useEnableDashboardSidebar((state) => state);

    return (
        <aside className={cn("fixed left-0 flex flex-col w-[70px] lg:w-60 h-full bg-green-950 border-r border-green-900 z-50", collapsed && "lg:w-[70px]")}>
         {children}
         </aside>
     );
};
