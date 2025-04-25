import {Tooltip,TooltipContent,TooltipProvider,TooltipTrigger } from "@/components/ui/tooltip";




interface HintingProps {
    label: string;
    children: React.ReactNode;
    asChild?: boolean;
    side?: "left" | "right" | "top" | "bottom";
    align?: "start" | "center" | "end";
};

export const Hinting = ({ label, children, asChild, side, align }: HintingProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent className="text-green-300 bg-grey" side={side} align={align}>
                    <p className="font-bold">
                        {label}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};


