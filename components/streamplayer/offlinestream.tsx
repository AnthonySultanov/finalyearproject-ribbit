import { Unplug } from "lucide-react";

interface VideoOfflineProps {
    username: string;
}

export const VideoOffline = ({ username }: VideoOfflineProps) => {
    return (
        <div className="h-full flex flex-col space-y-4 justify-center items-center">
          <Unplug className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">{username} is offline</p>
        </div>
      );
}
