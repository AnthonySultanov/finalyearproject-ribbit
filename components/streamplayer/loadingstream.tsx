import { Ellipsis } from "lucide-react";

interface VideoLoadingProps {
    label: string;
}

export const VideoLoading = ({ label }: VideoLoadingProps) => {
    return (
        <div className="h-full flex flex-col space-y-4 justify-center items-center">
          <Ellipsis className="h-10 w-10 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground capitalize">{label} </p>
        </div>
      );
}
