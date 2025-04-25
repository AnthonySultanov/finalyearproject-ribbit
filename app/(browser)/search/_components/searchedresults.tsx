import { tosearch } from "@/lib/searching-service";
import {Skeleton} from "@/components/ui/skeleton";
import { StreamedResultCard, StreamedResultCardSkeleton } from "./streamedresultcard";

interface SearchedResultsProps {
    term?: string;
}

export const SearchedResults =  async ({ term }: SearchedResultsProps) => {
    
    const data =  await tosearch(term);

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">
                Results for &quot;{term}&quot;
            </h2>
            {data.length === 0 && (
        <p className="text-muted-foreground text-sm">
          Couldnt find what you were looking for.
        </p>
      )}
      <div className="flex flex-col gap-y-4">
        {data.map((result) => (
          <StreamedResultCard
            data={{
              id: result.id,
              title: result.name,
              thumbnail: result.thumbnailUrl,
              isLive: result.isLive,
              updatedAt: result.updatedAt,
              user: result.user
            }}
            key={result.id}
          />
        ))}
      </div> 
        </div>
    );
}


export const SearchedResultsSkeleton = () => {
    return (
        <div>
              <Skeleton className="h-8 w-[290px] mb-4" />
      <div className="flex flex-col gap-y-4">
        {[...Array(5)].map((_, i) => (
          <StreamedResultCardSkeleton key={i} />
        ))}
      </div>
        </div>
    );
}
