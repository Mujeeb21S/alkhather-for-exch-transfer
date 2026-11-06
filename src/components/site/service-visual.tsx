import { Fa } from "@/components/site/fa";

const VISUAL: Record<string, { image: string; icon: string }> = {
  individuals: { image: "/media/services/individuals.jpg", icon: "user" },
  corporate: { image: "/media/services/corporate.jpg", icon: "building" },
  online: { image: "/media/services/online.jpg", icon: "mobile-screen" },
  "currency-convert": { image: "/media/services/currency-convert.jpg", icon: "right-left" },
  "track-transfer": { image: "/media/services/track-transfer.jpg", icon: "magnifying-glass" },
  suggestions: { image: "/media/services/suggestions.jpg", icon: "comment-dots" },
  humanitarian: { image: "/media/services/humanitarian.jpg", icon: "hands-helping" },
  "aid-cash": { image: "/media/services/aid-cash.jpg", icon: "money-bill-wave" },
  "aid-guarantor": { image: "/media/services/aid-guarantor.jpg", icon: "user-shield" },
  "aid-deposit": { image: "/media/services/aid-deposit.jpg", icon: "building-columns" },
};

export function ServiceGlyph({ slug, className = "h-11 w-11" }: { slug: string; className?: string }) {
  const icon = VISUAL[slug]?.icon ?? "hands-helping";
  return (
    <span className={`grid place-items-center rounded-2xl bg-primary text-gold-soft shadow-soft ${className}`}>
      <Fa name={icon} />
    </span>
  );
}

export function ServicePhoto({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const src = VISUAL[slug]?.image;
  if (!src) return null;
  return <img src={src} alt="" className={className ?? "aspect-[16/9] w-full object-cover"} />;
}
