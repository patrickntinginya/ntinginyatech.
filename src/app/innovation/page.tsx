import { CTASection } from "@/components/sections/CTASection";
import { InnovationSection } from "@/components/sections/InnovationSection";
import { PageHero } from "@/components/sections/PageHero";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Global AgriTech Innovation Hub",
  description:
    "The Global AgriTech Innovation Hub is a future Ntinginya Tech platform to discover, analyze, test, adapt and deploy agricultural innovation for Tanzania.",
  path: "/innovation",
});

export default function InnovationPage() {
  return (
    <>
      <PageHero
        crumb="Innovation"
        title="Global AgriTech Innovation Hub"
        description="A future platform for studying how the world farms, and for testing what could work in Tanzania."
      >
        <StatusBadge status="future" />
      </PageHero>
      <InnovationSection full ctaHref="#countries" />
      <CTASection title="Interested in agricultural innovation?" text="Researchers, innovators and agribusinesses are welcome to get in touch." />
    </>
  );
}
