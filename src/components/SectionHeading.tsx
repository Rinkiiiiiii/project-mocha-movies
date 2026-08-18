export default function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4 flex items-baseline justify-between">
      <h2 className="text-lg font-bold text-white sm:text-xl">{title}</h2>
      {subtitle && <span className="text-xs text-slate-500">{subtitle}</span>}
    </div>
  );
}
