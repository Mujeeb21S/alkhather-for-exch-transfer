import type { ManagedPage } from "@/lib/domain";
import { useI18n } from "@/components/site/shell";
import { PageIntro } from "@/components/site/ui";

export function ManagedArticle({ page }: { page: ManagedPage }) {
  const { lang, t } = useI18n();
  return (
    <div>
      <PageIntro kicker={t("الخضر للصرافة", "Al Khadher")} title={lang === "ar" ? page.titleAr : page.titleEn} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <p className="whitespace-pre-wrap leading-8">{lang === "ar" ? page.bodyAr : page.bodyEn}</p>
      </article>
    </div>
  );
}
