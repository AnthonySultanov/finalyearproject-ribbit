"use client";


import { userlogged } from "@prisma/client";
import { useEnableSidebar } from "@/storing/enable-sidebar";
import { LoggedUserItem, LoggedUserItemSkeleton } from "./Logged-User-Item";

interface RecommendedUsersProps {
    data: userlogged[];
}


export const RecommendedUsers = ({ data }: RecommendedUsersProps) => {
    const {collapsed} = useEnableSidebar((state) => state);
    //below test to see if reccoemnded users are being fetched
   // console.log(data.length);
    const showLabel = !collapsed && data.length > 0;


    return (
        <div>
            {showLabel && ( 
                <div className="pl-6 mb-4">
                    <p className="text-sm text-muted-foreground">
                    Recommended
                    </p>
                    </div>
                    )}
                    <ul className="space-y-2 px-2">
                        {data.map((userlogged) => ( <LoggedUserItem key={userlogged.id} username={userlogged.username} imageUrl={userlogged.imageUrl} islive={true} />
                    ))}
                    </ul>
        </div>
    )
}





export const RecommendedUsersSkeleton = () => {
    return (
        <ul className="px-2">
            {[...Array(3)].map((_, index) => (
               <LoggedUserItemSkeleton key={index}/>
           ))}
        </ul>
    );
}
