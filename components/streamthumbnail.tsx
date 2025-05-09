import { Skeleton } from "./ui/skeleton";
import { UserPF } from "@/components/usericon";
import Image from "next/image";
import { LiveDotBadge } from "./LiveDotBadge";
interface StreamThumbnailProps {
    src: string | null;
    fallback: string;
    isLive: boolean;
    username: string;
}



export const StreamThumbnail = ({ src, fallback, isLive, username }: StreamThumbnailProps) => {
   let streamercontent;

    if (!src) {
        streamercontent = (
          <div className="bg-background flex flex-col items-center justify-center gap-y-4 h-full w-full transition-transform group-hover:translate-x-2 group-hover:-translate-y-2 rounded-md">
            <UserPF
              size="lg"
              showLiveDot
              username={username}
              imageUrl={fallback}
              isLive={isLive}
            />
          </div>
        );
      } else {
        streamercontent = (
          <Image
            src={src}
            fill
            alt="Thumbnail"
            className="object-cover transition-transform group-hover:translate-x-2 group-hover:-translate-y-2 rounded-md"
          />
        );
      }
    


    return (
      <div className="group aspect-video relative rounded-md cursor-pointer">
        <div className="rounded-md absolute inset-0 bg-green-900 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        
        
          </div>
          {streamercontent} 
          {isLive && src && (
        <div className="absolute top-2 left-2 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
          <LiveDotBadge />
        </div>
      )}

      </div>
  );
}



export const StreamThumbnailSkeleton = () => {
    return (
        <div className="group aspect-video relative rounded-xl cursor-pointer">
      <Skeleton className="h-full w-full" />
    </div>
    );
}
