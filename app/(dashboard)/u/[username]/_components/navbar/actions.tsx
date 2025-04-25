import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";



import { Clapperboard, LogOut } from "lucide-react";
import Link from "next/link";


export const Actions = () => {



    return (
        <div className="flex items-center gap-x-2">

<Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" asChild>
<Link href="/">
<LogOut className="h-4 w-4 " />
exit
</Link>
</Button>
<UserButton 
afterSignOutUrl="/"
 />
        </div>
    );
};