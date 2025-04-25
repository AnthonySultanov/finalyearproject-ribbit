

import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SearchedResults, SearchedResultsSkeleton } from "./_components/searchedresults";

interface PageSearchProps {
    searchParams: {
        term?: string;
    };
}

const PageSearch = ({ searchParams }: PageSearchProps) => {
    if (!searchParams.term) {
        redirect("/");
    }

    return (
        <div className="h-full p-8 max-w-screen-2xl mx-auto">
            <Suspense fallback={<SearchedResultsSkeleton />}>
                <SearchedResults term={searchParams.term} />
            </Suspense>
        </div>
    );
}

export default PageSearch;
