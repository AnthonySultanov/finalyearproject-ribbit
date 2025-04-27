import { followingtheuser } from "@/lib/following-service";
import { Actions } from "./_components/actions";
import { isblockedusers } from "@/lib/blocking-service";
import { notFound } from "next/navigation";
import { LiveStream } from "@/components/streamplayer/livestream";
import { VideoPlayer } from "@/components/streamplayer";
import { fetchusername } from "@/lib/services-fetchuser";
import { ChatPlaysHandler } from "@/components/streamplayer/chatplayshandler";


type Params = Promise<{ username: string }>;

interface AccountPageProps {
    params: Params;
}

const AccountPage = async ({ params }: AccountPageProps) => {

    const { username } = await params;
    
    const user = await fetchusername(username);
    
    if (!user || !user.streaming) {
      return notFound();
    }
    
    const BlockingUser = await isblockedusers(user.id);
    const FollowingUser = await followingtheuser(user.id);
    
    if (BlockingUser) {
      return notFound();
    }

    return (
      <>
        <VideoPlayer user={user} stream={user.streaming} isFollowing={FollowingUser} />
      </>
    );
}

export default AccountPage; 