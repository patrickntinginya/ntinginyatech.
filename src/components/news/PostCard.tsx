import Link from "next/link";
import type { PublicPost } from "@/lib/cms/public";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

export function PostCard({ post, featured = false }: { post: PublicPost; featured?: boolean }) {
  return (
    <article
      className={cn(
        "group flex overflow-hidden rounded-2xl border border-deep/15 bg-paper transition-colors hover:border-deep/40",
        featured ? "flex-col lg:flex-row" : "flex-col",
      )}
    >
      <Link
        href={`/news/${post.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className={cn("block shrink-0 bg-sage", featured ? "lg:w-1/2" : "")}
      >
        {post.featured_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.featured_image}
            alt=""
            loading="lazy"
            className={cn("w-full object-cover", featured ? "aspect-[16/10] lg:h-full lg:aspect-auto" : "aspect-[16/10]")}
          />
        ) : (
          <div className={cn("grid place-items-center bg-deep text-white/40", featured ? "aspect-[16/10] lg:h-full lg:aspect-auto" : "aspect-[16/10]")}>
            <span className="font-sans text-sm font-semibold tracking-widest">NTINGINYA TECH</span>
          </div>
        )}
      </Link>
      <div className={cn("flex flex-1 flex-col p-5 sm:p-6", featured && "lg:justify-center lg:p-10")}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-sm text-deep/75">
          {post.category ? (
            <Link
              href={`/news?category=${post.category.slug}`}
              className="rounded-md bg-field-100 px-2 py-1 text-xs font-semibold text-field-800 hover:bg-field-300"
            >
              {post.category.name}
            </Link>
          ) : null}
          <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
        </div>
        <h2
          className={cn(
            "mt-3 font-sans font-semibold leading-tight tracking-tight text-balance",
            featured ? "text-3xl lg:text-4xl" : "text-xl",
          )}
        >
          <Link href={`/news/${post.slug}`} className="hover:underline underline-offset-4">
            {post.title}
          </Link>
        </h2>
        {post.excerpt ? <p className="mt-3 text-base leading-relaxed text-deep/80">{post.excerpt}</p> : null}
        {post.author_name ? <p className="mt-4 font-sans text-sm text-deep/70">By {post.author_name}</p> : null}
      </div>
    </article>
  );
}
