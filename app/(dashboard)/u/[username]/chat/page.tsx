import { infouser } from "@/lib/services-fetchuser";
import { getstreamid } from "@/lib/streaming-service";
import { ToggleCard } from "./_components/togglecard";
import { ChatPlaysCard } from "./_components/chatplayscard";

const chatspage = async() => {
    const self = await infouser();
    const stream = await getstreamid(self.id);

    if (!stream) {
        throw new Error("No stream found");
    }

    return (
        <div className="p-6">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">Chat Settings</h1>
            </div>
            <div className="space-y-4">
                <ToggleCard field="isChatEnabled" label="Enable Chat" value={stream.isChatEnabled} />
                <ToggleCard field="isChatDelaymode" label="Delay Mode" value={stream.isChatDelaymode} />
                <ToggleCard field="isChatFollowersOnly" label="Followers Only" value={stream.isChatFollowersOnly} />
                <ChatPlaysCard isEnabled={stream.isChatPlaysEnabled || false} allowedKeys={stream.allowedChatKeys || "wasd"} />
            </div>
        </div>
    )
}

export default chatspage;
