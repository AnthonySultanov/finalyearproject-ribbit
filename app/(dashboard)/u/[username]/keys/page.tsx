import { Button } from "@/components/ui/button";
import { TheUrlCard } from "./_components/cardurl";
import { infouser } from "@/lib/services-fetchuser";
import { getstreamid } from "@/lib/streaming-service";
import { TheKeyCard } from "./_components/cardkey";
import { ConnectingModel } from "./_components/connctingmodel";


const keyspage = async () => {

    const self = await infouser();
    const stream = await getstreamid(self.id);

    if(!stream) {
       throw new Error("No stream found");
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Keys and url</h1>
                <ConnectingModel />
            </div>
            <div className="space-y-4">
                <TheUrlCard value={stream.serverUrl} />
                <TheKeyCard value={stream.streamingKey} />

            </div>
        </div>
    )
}

export default keyspage;
