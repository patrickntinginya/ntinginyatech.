import { CTASection } from "@/components/sections/CTASection";
import { MasterclassSection } from "@/components/sections/MasterclassSection";
import { PageHero } from "@/components/sections/PageHero";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Agriculture & Livestock Masterclass",
  description:
    "Masterclass ya Kilimo na Ufugaji: a future Ntinginya Tech learning platform for agricultural officers, livestock officers, large-scale farmers and livestock keepers.",
  path: "/masterclass",
});

export default function MasterclassPage() {
  return (
    <>
      <PageHero
        crumb="Masterclass"
        title="Agriculture & Livestock Masterclass"
        description="Masterclass ya Kilimo na Ufugaji: professional and practical education around modern agriculture, livestock management and agricultural technology."
      >
        <StatusBadge status="future" />
      </PageHero>
      <MasterclassSection />
      <CTASection title="Help shape the Masterclass" text="Tell us what you would want to learn and we will keep you informed as it develops." />
    </>
  );
}
