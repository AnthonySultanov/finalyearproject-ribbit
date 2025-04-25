import { fetchusername } from "@/lib/services-fetchuser";
import { redirect } from "next/navigation";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import { Container } from "./_components/container";
interface dashboardLayoutProps {
    children: React.ReactNode;
    params: {
        username: string;
    };
}


const dashboardLayout = async ({children, params}: dashboardLayoutProps) => {
   
    const { username } = await params;
    const user = await fetchusername(username);

    if (!user) {
        redirect("/");
    }

    return (
        <>
            <Navbar />
            <div className="flex h-full pt-20">
                <Sidebar />
                <Container>
            {children}
            </Container>
            </div>
        </>
    )
}

export default dashboardLayout;