"use client";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Fullscreen,KeyRound,MessageSquare,Users } from "lucide-react";
import { NavItem, NavItemSkeleton } from "./navitem";



export const Navagation = () => {

const pathname = usePathname();
const {user} = useUser();


const routes = [
    //this is the dashboard route
    {
        label: "Dashboard",
        href: `/u/${user?.username}`,
        icon: Fullscreen,
       
    },
    //this is the keys route
    {
        label: "Keys",
        href: `/u/${user?.username}/keys`,
        icon: KeyRound,
    },

    {
        label: "Community",
        href: `/u/${user?.username}/community`,
        icon: Users,
    },
    //this is the chat route
    {
        label: "Chat",
        href: `/u/${user?.username}/chat`,
        icon: MessageSquare,
    },
    
]

if (!user?.username) {
    return (
        <ul className="space-y-2 ">
            {[...Array(4)].map((_,i) => (
                <NavItemSkeleton key={i} />
            ))}
        </ul>
    )
}



    return (
        <ul className="space-y-2 px-2 pt-4 lg:pt-0">
            {routes.map((route) => (
               <NavItem key={route.href} label={route.label} href={route.href} icon={route.icon} isActive={pathname === route.href} />
            ))}
        </ul>
    )
}



