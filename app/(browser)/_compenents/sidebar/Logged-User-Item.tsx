"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEnableSidebar } from "@/storing/enable-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { User } from "lucide-react";
import { UserPF } from "@/components/usericon";
import { LiveDotBadge } from "@/components/LiveDotBadge";




interface LoggedUserItemProps { 
    username: string;
    imageUrl: string;
    islive?: boolean;
};



export const LoggedUserItem = ({username,imageUrl,islive}: LoggedUserItemProps) => {
    const pathname = usePathname();
    const {collapsed} = useEnableSidebar((state) => state);
    const href = `/u/${username}`;
    const isActive = pathname === href;


    return (
       <Button asChild variant={"ghost"} className={cn("w-full h-12 ", collapsed ? "justify-center" : "justify-start", isActive && "bg-accent")} >
        <Link href={href}>
        <div className={cn("flex items-center gap-x-4", collapsed && "justify-center",)}>
        <UserPF imageUrl={imageUrl} username={username} isLive={islive}  />
        {!collapsed && (
            <p className="truncate">
                {username}
            </p>
        )}
        {!collapsed && islive &&(
            <LiveDotBadge className="ml-auto" />
        )}
        </div>
        </Link>
       </Button>
    );
};



export const LoggedUserItemSkeleton = () => {
    return (
      <li className="flex items-center gap-x-4 px-3 py-2">
            <Skeleton className="min-h-[32px] min-w-[32px] rounded-full" />
            <div className="flex-1">
            <Skeleton className="h-6" />
            </div>
        </li>
    );
};