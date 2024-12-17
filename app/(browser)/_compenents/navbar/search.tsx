"use client";


import qs from "query-string";
import { useState } from "react";
import {Search, X} from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SearchBar = () => {

    const router = useRouter();
    const [value, setvalue] = useState("");

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!value) {
            return;
        }

        const url = qs.stringifyUrl({
            url: "/searchedpage",
            query: { searched: value },
        }, { skipEmptyString: true, skipNull: true });
        

        
        router.push(url);
    };

    const onClear = () => {
        setvalue("");
        router.push("/");
    }




return (  
    <form className="relative w-full lg:w-[350px] flex items-center" onSubmit={onSubmit} >
        <Input value={value} onChange={(e) => setvalue(e.target.value)} placeholder="Search" className="rounded-r-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0" />
        {value && (
            <X className="absolute top-2 right-14 h-5 w-5 text-muted-foreground cursor-pointer hover:opacity-60 transition" onClick={onClear} />
        )}
        <Button type="submit" size="sm" variant="secondary" className="rounded-l-none">
            <Search className="h-4 w-4 text-muted-foreground" />
        </Button>
    </form>

)
}








