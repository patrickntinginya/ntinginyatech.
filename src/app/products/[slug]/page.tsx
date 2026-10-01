import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { StatusBadges } from "@/components/ui/StatusBadge";
import { PageHero } from "@/components/sections/PageHero";
import { getProduct, products } from "@/content/products";
import { buildMetadata } from "@/lib/metadata";

type Params = { slug: string };
type Props = { params: Promise<Params> };

export function generateStaticParams(): Params[] {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return buildMetadata({ title: product.name, description: product.summary, path: `/products/${product.slug}` });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const others = products.filter((p) => p.slug !== product.slug);

  return (
    <>
      <PageHero crumb="Products" title={product.name} description={product.summary}>
        <p className="font-sans text-sm text-deep/75">{product.category}</p>
        <StatusBadges statuses={product.badges} className="mt-3" />
      </PageHero>

      <section className="bg-paper py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-7">
            <div>
              <h2 className="font-sans text-2xl font-semibold tracking-tight">Problem it solves</h2>
              <p className="mt-3 text-lg leading-relaxed text-deep/85">{product.problem}</p>
            </div>
            <div>
              <h2 className="font-sans text-2xl font-semibold tracking-tight">Who it is for</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {product.users.map((u) => (
                  <li key={u} className="rounded-md border border-deep/25 px-3 py-1.5 font-sans text-sm font-medium">
                    {u}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-sans text-2xl font-semibold tracking-tight">
                {product.group === "mvp" ? "What it covers" : "Areas we want to explore"}
              </h2>
              <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {product.scope.map((s) => (
                  <li key={s} className="border-t border-deep/15 pt-3 font-sans text-base font-medium">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-dashed border-deep/40 p-6 sm:p-8">
              <h2 className="font-sans text-xl font-semibold tracking-tight">Status</h2>
              <p className="mt-3 text-base leading-relaxed text-deep/85">{product.statusNote}</p>
              <ButtonLink
                href={`/contact?subject=${encodeURIComponent(product.interestSubject)}`}
                variant="dark"
                className="mt-6 w-full sm:w-auto"
              >
                {product.group === "mvp" ? "Ask about this product" : "Register your interest"}
              </ButtonLink>
            </div>
          </aside>
        </Container>
      </section>

      <section className="bg-mist py-16">
        <Container>
          <h2 className="font-sans text-2xl font-semibold tracking-tight">Other products</h2>
          <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {others.map((p) => (
              <li key={p.slug} className="border-t border-deep/20 pt-3">
                <Link href={`/products/${p.slug}`} className="font-sans text-lg font-semibold underline-offset-4 hover:underline">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
