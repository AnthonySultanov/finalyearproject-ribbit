"use client"

import { Button } from "@/components/ui/button";
import { CheckCheck, Copy } from "lucide-react";
import { useState } from "react";


interface AutoCopyButtonProps {
    value?: string;
}

export const AutoCopyButton = ({value}: AutoCopyButtonProps) => {

    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    }


    const Icon = isCopied ? CheckCheck : Copy;



    return (
        <Button onClick={handleCopy} disabled={!value} variant="ghost" size="sm">
            <Icon className="w-4 h-4"/>
        </Button>
    )
}




