import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SearchedResults, SearchedResultsSkeleton } from "./_components/searchedresults";


type SearchParams = Promise<{
    term?: string;
}>;

interface PageSearchProps {
    searchParams: SearchParams;
}

const PageSearch = async ({ searchParams }: PageSearchProps) => {

    const resolvedSearchParams = await searchParams;
    
    if (!resolvedSearchParams.term) {
        redirect("/");
    }

    return (
        <div className="h-full p-8 max-w-screen-2xl mx-auto">
            <Suspense fallback={<SearchedResultsSkeleton />}>
                <SearchedResults term={resolvedSearchParams.term} />
            </Suspense>
        </div>
    );
}

export default PageSearch;
