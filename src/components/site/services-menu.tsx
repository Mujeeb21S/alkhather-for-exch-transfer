import { Link } from "@tanstack/react-router";
import type { Service } from "@/lib/domain";
import { ServiceGlyph, ServicePhoto } from "@/components/site/service-visual";
import { useI18n } from "@/components/site/shell";

const MAIN = ["individuals", "corporate"] as const;
const AID = ["aid-cash", "aid-guarantor", "aid-deposit"] as const;

export function ServiceMenu({ services }: { services: Service[] }) {
  const { lang, t } = useI18n();
  const text = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const by = new Map(services.map((service) => [service.slug, service]));
  const main = MAIN.map((slug) => by.get(slug)).filter((service): service is Service => Boolean(service));
  const aid = AID.map((slug) => by.get(slug)).filter((service): service is Service => Boolean(service));
  const parent = by.get("humanitarian");

  return (
    <div className="grid gap-10">
      <div className="grid gap-4 md:grid-cols-2">
        {main.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
      {parent || aid.length ? (
        <div className="grid gap-4">
          <div>
            <h3 className="font-display text-3xl">
              {parent ? text(parent.titleAr, parent.titleEn) : t("خدمات المنظمات الإنسانية", "Humanitarian organizations")}
            </h3>
          </div>
          {parent ? <ServiceCard service={parent} wide /> : null}
          <div className="grid gap-4 md:grid-cols-3">
            {aid.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ServiceCard({ service, wide = false }: { service: Service; wide?: boolean }) {
  const { lang, t } = useI18n();
  const text = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const covers = (lang === "ar" ? service.coversAr : service.coversEn).slice(0, wide ? 4 : 3);
  return (
    <Link
      to="/services/$slug"
      params={{ slug: service.slug }}
      className="soft-card lift block overflow-hidden"
    >
      <div className="relative">
        <ServicePhoto slug={service.slug} className={wide ? "aspect-[21/8] w-full object-cover" : "aspect-[16/9] w-full object-cover"} />
        <span className="absolute bottom-3 start-3">
          <ServiceGlyph slug={service.slug} />
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-2xl">{text(service.titleAr, service.titleEn)}</h3>
        <p className="mt-2 text-sm text-muted">{text(service.summaryAr, service.summaryEn)}</p>
        {covers.length ? (
          <ul className="mt-3 grid gap-1.5 text-sm">
            {covers.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-gold" aria-hidden>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-4 text-sm text-primary">{t("تفاصيل الخدمة", "Service details")}</p>
      </div>
    </Link>
  );
}
