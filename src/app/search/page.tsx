import { search } from "@/lib/tmdb";
import TitleGrid from "@/components/TitleGrid";
import SectionHeading from "@/components/SectionHeading";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q?.trim() ?? "";
  const results = query ? await search(query) : [];

  return (
    <div className="container-page pt-8">
      <SectionHeading
        title={query ? `Results for "${query}"` : "Search"}
        subtitle={query ? `${results.length} found` : undefined}
      />
      {query ? (
        <TitleGrid titles={results} emptyMessage="No matches. Try a different title." />
      ) : (
        <p className="text-sm text-slate-500">
          Use the search bar above to find movies and TV shows.
        </p>
      )}
    </div>
  );
}
