import { getblockedusers } from "@/lib/blocking-service";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { format } from "date-fns";

interface PageProps {
    params: {
        username: string;
    }
}

const DashboardCommunityPage = async ({ params }: PageProps) => {
    const { username } = await params;
    const blockedaccounts = await getblockedusers();

    //this will handle the case where there are no blocked accounts
    const formattedData = blockedaccounts?.map((block) => ({
        ...block,
        userId: block.blocked.id,
        imageUrl: block.blocked.imageUrl,
        username: block.blocked.username,
        createdAt: format(new Date(block.blocked.createdAt), "dd/MM/yyyy"),
    })) || [];

    return (
        <div className="p-6">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">
                    Community Settings
                </h1>
            </div>
            <DataTable columns={columns} data={formattedData} />
        </div>
    );
}

export default DashboardCommunityPage;