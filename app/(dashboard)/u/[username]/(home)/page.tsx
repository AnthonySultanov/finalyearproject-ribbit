import { VideoPlayer } from "@/components/streamplayer/index";
import { getaccountusername } from "@/lib/account-service";
import { currentUser } from "@clerk/nextjs/server";
import { fetchusername } from "@/lib/services-fetchuser";


type Params = Promise<{ username: string }>;

interface DashboardPageProps {
    params: Params;
}

const DashboardPage = async ({params}: DashboardPageProps) => {
    const { username } = await params;
    const externaluser = await currentUser();
    const account = await getaccountusername(username);
    const user = await fetchusername(username);

    if (!user || user.externalUserId !== externaluser?.id || !user.streaming)  {
        throw new Error("not allowed");
    }

    return (
        <div className="h-full">
            <VideoPlayer 
                user={user} 
                stream={user.streaming} 
                isFollowing={false} 
            /> 
        </div>
    );
};

export default DashboardPage;
