import { recommendedusers } from "@/lib/recommendedusers-service";
import { RecommendedUsers, RecommendedUsersSkeleton } from "./recommended-users";
import { Toggle } from "./toggle";
import { Wrapper } from "./wrapper";

export const Sidebar = async () => {

    const recommendedUsersAccount = await recommendedusers();


    return (
        <Wrapper>
            <Toggle />
            <div className="space-y-4 pt-4 lg:pt-0">
                 <RecommendedUsers data={recommendedUsersAccount} />
            </div>
        </Wrapper>
    );
};




export const SidebarSkeleton = () => {
    return (
        <aside className="fixed left-0 flex flex-col w-[70px] lg:w-60 h-full bg-background border-r border-green-800 z-50">
            <RecommendedUsersSkeleton />
        </aside>
    );
}