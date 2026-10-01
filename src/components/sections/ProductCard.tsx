import type { Product } from "@/content/products";
import { ButtonLink } from "@/components/ui/Button";
import { StatusBadges } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/cn";

function Facts({ product }: { product: Product }) {
  return (
    <dl className="space-y-5">
      <div>
        <dt className="font-sans text-sm font-semibold">Problem solved</dt>
        <dd className="mt-1 text-[0.9375rem] leading-relaxed text-deep/80">{product.problem}</dd>
      </div>
      <div>
        <dt className="font-sans text-sm font-semibold">Target users</dt>
        <dd className="mt-1 text-[0.9375rem] leading-relaxed text-deep/80">{product.users.join(", ")}</dd>
      </div>
    </dl>
  );
}

/**
 * Solid border = exists in some form (MVP / live).
 * Dashed border = proposed or future, not yet built.
 */
export function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const Icon = product.icon;
  const built = product.group !== "future";

  return (
    <article
      className={cn(
        "flex h-full rounded-2xl p-6 sm:p-8",
        built ? "border border-deep/20 bg-white" : "border border-dashed border-deep/40 bg-transparent",
        featured ? "flex-col gap-8 lg:flex-row lg:gap-14" : "flex-col",
      )}
    >
      <div className={cn("flex flex-col", featured && "lg:w-1/2")}>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "grid h-11 w-11 place-items-center rounded-lg",
              built ? "bg-deep text-white" : "border border-deep/30 text-deep",
            )}
          >
            <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
          </span>
          <p className="font-sans text-sm font-medium text-deep/75">{product.category}</p>
        </div>

        <h3 className="mt-6 font-sans text-2xl font-semibold leading-tight tracking-[-0.015em] text-balance">{product.name}</h3>
        <StatusBadges statuses={product.badges} className="mt-3" />
        <p className="mt-4 text-base leading-relaxed text-deep/80">{product.summary}</p>

        <div className="mt-auto pt-7">
          <ButtonLink href={`/products/${product.slug}`} variant={built ? "dark" : "outline"}>
            Learn More<span className="sr-only"> about {product.name}</span>
          </ButtonLink>
        </div>
      </div>

      <div className={cn(featured ? "lg:w-1/2 lg:border-l lg:border-deep/15 lg:pl-14" : "mt-7 border-t border-deep/15 pt-6")}>
        <Facts product={product} />
      </div>
    </article>
  );
}
