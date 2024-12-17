import { Navbar } from "./_compenents/navbar";

const BrowserLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return( 
        <>
        <Navbar />
           <div className="flex h-full pt-20">
            {children}
            </div>
        </>
    ); 
}
export default BrowserLayout;