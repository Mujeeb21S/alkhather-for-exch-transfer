import { createFileRoute } from "@tanstack/react-router";
import { getPublicHome } from "@/lib/server/fns";
import { useI18n } from "@/components/site/shell";
import { ServiceMenu } from "@/components/site/services-menu";
import { PageIntro } from "@/components/site/ui";

export const Route = createFileRoute("/services/")({
  loader: () => getPublicHome(),
  head: () => ({
    meta: [
      { title: "خدماتنا | الخضر للصرافة" },
      { name: "description", content: "خدمات الأفراد والشركات والمنظمات الإنسانية لدى الخضر للصرافة." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { services } = Route.useLoaderData();
  const { t } = useI18n();
  return (
    <div>
      <PageIntro
        kicker={t("ما نقدمه", "What we offer")}
        title={t("خدماتنا", "Our services")}
        body={t(
          "الخدمات كما تعتمدها الشركة. تحويل العملات وتتبع الحوالة والشكاوى تفتح أدواتها مباشرة، والتنفيذ المالي يبقى في نقطة الخدمة.",
          "Services as the company lists them. Currency conversion, transfer tracking, and complaints open their tools directly. The financial transaction stays at the service point.",
        )}
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <ServiceMenu services={services} />
      </div>
    </div>
  );
}
