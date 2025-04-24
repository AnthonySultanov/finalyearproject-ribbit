"use client";

import { useEnableSidebar } from "@/storing/enable-sidebar";
import { following, userlogged } from "@prisma/client";
import { LoggedUserItem, LoggedUserItemSkeleton } from "./Logged-User-Item";

interface FollowedUsersProps { 
    data: (following & {following: userlogged})[];
 }

export const FollowedUsers = ({data}: FollowedUsersProps) => {
    const {collapsed} = useEnableSidebar((state) => state);

if (!data.length) {
    return null;
}


    return (
        <div>
           {!collapsed && (
            <div className="mb-6 pl-5">
               <p className="text-sm text-muted-foreground">Followed Users</p>
            </div>
           )}
           <ul className="px-3 space-y-3">
            {data.map((follow) => (
                <LoggedUserItem 
                 key={follow.id}
                 username={follow.following.username}
                 imageUrl={follow.following.imageUrl}
                //  islive={true}
                 />
            ))}

           </ul>

        </div>
    )
}




export const FollowedUsersSkeleton = () => {
    return (
        <ul className="px-3 space-y-3">
            {[...Array(5)].map((_, index) => (
                <LoggedUserItemSkeleton key={index} />
            ))}
        </ul>
    )
}



