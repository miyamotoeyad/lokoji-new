import Link from "next/link";
import Image from "next/image";
import { Asset, Entry } from "contentful";
import { TypeArticlesSkeleton } from "@/types";
import { RiArrowLeftSLine, RiTimeLine } from "@remixicon/react";

interface AuthorCardProps {
  news: Entry<TypeArticlesSkeleton, undefined, string>;
  variant?: "list" | "grid";
}

export function AuthorCard({ news, variant = "list" }: AuthorCardProps) {
  const fields = news.fields as Record<string, unknown>;
  const slug = fields.slug as string;
  const title = fields.title as string;
  const excerpt = fields.excerpt as string | undefined;
  const date = news.sys.createdAt;

  const imgAsset = fields.image as unknown as Asset<undefined, string>;
  const imgUrl = imgAsset?.fields?.file?.url
    ? `https:${imgAsset.fields.file.url}`
    : "/no-image.png";

  const formatted = new Date(date).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const href = `/post/${slug}`;

  if (variant === "grid") {
    return (
      <Link
        href={href}
        className="group block bg-card border border-border rounded-3xl overflow-hidden hover:border-primary-brand/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
      >
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imgUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        </div>
        <div className="p-5 space-y-2">
          <h3 className="font-black text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary-brand transition-colors">
            {title}
          </h3>
          <p className="text-[11px] text-muted-foreground font-bold flex items-center gap-1">
            <RiTimeLine size={11} />
            {formatted}
          </p>
        </div>
      </Link>
    );
  }

  // ── LIST VARIANT (author page) ──────────────────────────────────────────
  return (
    <Link
      href={href}
      className="group flex items-center gap-5 bg-card border border-border rounded-2xl p-4 hover:border-primary-brand/30 hover:bg-primary-brand/5 transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-muted">
        <Image
          src={imgUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <h3 className="font-black text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary-brand transition-colors">
          {title}
        </h3>
        {excerpt && (
          <p className="text-xs text-muted-foreground line-clamp-1 font-medium">
            {excerpt}
          </p>
        )}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground font-bold flex items-center gap-1">
            <RiTimeLine size={11} />
            {formatted}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <RiArrowLeftSLine
        size={20}
        className="shrink-0 text-muted-foreground/40 group-hover:text-primary-brand transition-colors"
      />
    </Link>
  );
}
