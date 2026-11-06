export function HeadOfficeFigure({
  caption,
  address,
  alt,
  priority = false,
}: {
  caption: string;
  address: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <figure className="mx-auto max-w-6xl px-4">
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <img
          src="/media/head-office.jpg"
          alt={alt}
          width={1600}
          height={963}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          className="aspect-[16/9] w-full object-cover object-center"
        />
        <figcaption className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-4">
          <p className="font-display text-2xl">{caption}</p>
          <p className="text-sm text-muted">{address}</p>
        </figcaption>
      </div>
    </figure>
  );
}
