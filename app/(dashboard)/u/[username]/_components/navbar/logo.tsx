import Image from "next/image";
import {Poppins} from "next/font/google"
import {cn} from "@/lib/utils";
import Link from "next/link";



const font = Poppins({
    subsets: ['latin'],
    weight: ["200","300","400","500"]
})


export const Logo = () => {
    return (
        //old logo code that didnt work
        // <div>
        //     LOGO
        // </div>
        // <div className={cn("flex items-center")}>
        //     <Image src="/pepo-jam-pepe.svg" alt="logo" width={40} height={40} />
        //     <h1 className={cn("text-lg font-bold text-white ml-2",font)}>Next.js</h1>
        // </div>

        <Link href="/"> 
        <div className="flex items-center gap-x-4 hover:opacity-75 transition  ">
            <div className="bg-green-950 rounded-full p-1 mr-12 shrink-0 lg:mr-0 lg:shrink ">
                <Image src="/pepo-jam-pepe.svg" alt="Ribbit" width={45} height={45} />
            </div>


        <div className={cn("hidden lg:block", font.className)}>
            <p className="text-lg font-bold">
                Ribbit
            </p>
          
        </div>
        
        </div>
        </Link>




      
    );
};

