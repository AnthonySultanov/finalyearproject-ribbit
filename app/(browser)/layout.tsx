import { Sidebar, SidebarSkeleton } from "./_compenents/sidebar";
import { Navbar } from "./_compenents/navbar";
import { Container } from "./_compenents/container";
import { Suspense } from "react";

const BrowserLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return( 
        <>
        <Navbar />
           <div className="flex h-full pt-20">
            <Suspense fallback={<SidebarSkeleton />}>
            <Sidebar /> 
            </Suspense>
            <Container>
           {children}
           </Container>
            </div>
        </>
    ); 
}
export default BrowserLayout;