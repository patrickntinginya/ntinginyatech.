import { capabilities, engagementSteps } from "@/content/solutions";
import { ButtonLink } from "@/components/ui/Button";
import { ProcessRail } from "@/components/ui/ProcessRail";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SolutionsDetail() {
  return (
    <>
      <Section tone="paper" id="software">
        <SectionHeading
          title="Software and digital solutions"
          description="The technology side of Ntinginya Tech. These are the kinds of solutions we build with businesses and organizations."
        />
        <ul className="mt-14 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((item) => (
            <li key={item.id} id={item.id} className="scroll-mt-24 border-t border-deep/20 py-6">
              <h3 className="font-sans text-xl font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-deep/80">{item.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="mist" id="work-with-us">
        <SectionHeading
          title="How to work with Ntinginya Tech"
          description="Bring us a problem, not just a feature list. We will help work out what is worth building."
        />
        <ProcessRail steps={engagementSteps} className="mt-14" />
        <div className="mt-12">
          <ButtonLink href="/contact?subject=Work%20with%20Ntinginya%20Tech" variant="dark" size="lg">
            Work With Us
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
