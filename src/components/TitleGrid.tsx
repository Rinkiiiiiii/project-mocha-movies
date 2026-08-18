import TitleCard, { type TitleCardData } from "@/components/TitleCard";

export default function TitleGrid({
  titles,
  emptyMessage = "Nothing here yet.",
}: {
  titles: TitleCardData[];
  emptyMessage?: string;
}) {
  if (titles.length === 0) {
    return (
      <div className="card-surface flex h-40 items-center justify-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {titles.map((title) => (
        <TitleCard key={`${title.mediaType}-${title.tmdbId}`} title={title} />
      ))}
    </div>
  );
}
