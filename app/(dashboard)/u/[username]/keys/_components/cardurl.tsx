import { Input } from "@/components/ui/input";
import { AutoCopyButton } from "./autocopybutton";


interface TheUrlCardProps {
    value: string | null;
}



export const TheUrlCard  = ({value}: TheUrlCardProps) => {
  
    return (
        <div className="bg-muted rounded-xl p-6">
            <div className="flex items-center gap-x-10">
                <p className="font-semibold shrink-0">Server URL</p>
               <div className="space-y-2 w-full">
                <div className="w-full flex items-center gap-x-2">
                <Input placeholder="Server URL" value={value || ""} disabled/>
                <AutoCopyButton value={value || ""}/>
               </div>
               </div>

            </div>
        </div>
    )
}
