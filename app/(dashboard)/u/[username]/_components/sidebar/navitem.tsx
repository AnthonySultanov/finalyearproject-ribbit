"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useEnableDashboardSidebar } from "@/storing/enable-dashboardpage-sidebar";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface NavItemProps {
    label: string;
    href: string;
    icon: LucideIcon;
    isActive: boolean;
};

export const NavItem = ({label,href,icon: Icon,isActive}: NavItemProps) => {
    const {collapsed} = useEnableDashboardSidebar((state) => state);
    return (
        <Button variant="ghost" asChild className={cn("w-full h-12",collapsed ? "justify-center" : "justify-start", isActive && "bg-accent")}>
            <Link href={href}>
               <div className="flex items-center gap-x-4">
                <Icon className={cn("w-4 h-4", collapsed ? "mr-0" : "mr-2")} />
                {!collapsed && (
                    <span>
                        {label}
                    </span>
                )}
               </div>
            </Link>
        </Button>
    );
};




export const NavItemSkeleton = () => {
    return (
        <li className="flex items-center gap-x-4 px-3 py-28" >
            <Skeleton className="min-h-[48px] rounded" />
            <div className="flex-1 hidden lg:block">
                <Skeleton className="h-6" />
            </div>
            </li>

    );
};
