import Image from "next/image";
import {Poppins} from "next/font/google"
import {cn} from "@/lib/utils";



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
        <div className="flex flex-col items-center gap-y-5">
            <div className="bg-white rounded-full ">
                <Image src="/pepo-jam-pepe.svg" alt="Ribbit" width={60} height={60} />
                </div>
                        <div className={cn("flex flex-col items-center", font.className)}>
                                <p className= "text-4xl font-bold black">
                                    Ribbit
                                </p> 
                        </div>
                </div>
    );
};

