import Image from "next/image";
import Link from "next/link";
import { RiCalendar2Line, RiArrowLeftUpLine } from "@remixicon/react";
import { Entry, Asset, AssetFile } from "contentful";
import { ArticleSkeleton } from "@/types/contentfulType";

interface ArtSquCardProps {
  article: Entry<ArticleSkeleton, undefined, string>;
  variant?: "hero" | "grid";
  priority?: boolean;
  sizes?: string;
}

export default function ArtSquCard({
  article,
  variant = "grid",
  priority = false,
  sizes
}: ArtSquCardProps) {
  if (!article || !article.fields) return null;

  const { title, slug, image, category } = article.fields;

  const asset = image as Asset;
  const file = asset?.fields?.file as AssetFile | undefined;
  const rawUrl = file?.url ? `https:${file.url}` : null;

  const imageUrl = rawUrl
    ? `${rawUrl}?w=${variant === "hero" ? 1200 : 800}&fm=webp&q=75&fit=fill`
    : "/no-image.png";

  const date = new Date(article.fields.publicationDate).toLocaleDateString(
    "ar-EG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );

  /* ── HERO VARIANT ── */
  if (variant === "hero") {
    return (
      <Link
        href={`/post/${slug as string}`}
        className="group block relative h-full min-h-130"
        dir="rtl"
      >
        <Image
          alt={(title as string) || "Article Image"}
          src={imageUrl}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes={sizes ?? "(max-width: 1024px) 100vw, 58vw"}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

        <div className="absolute bottom-0 right-0 left-0 p-8 z-10">
          {category && (
            <span className="inline-block text-[10px] font-black tracking-widest bg-primary-brand text-white px-3 py-1 rounded-full mb-4">
              {category as string}
            </span>
          )}
          <h2 className="text-white text-2xl font-black leading-snug line-clamp-3 group-hover:text-primary-brand transition-colors duration-300 mb-4">
            {title as string}
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/50 text-xs font-bold">
              <RiCalendar2Line size={13} />
              <span>{date}</span>
            </div>
            <div className="w-8 h-8 bg-white/10 hover:bg-primary-brand rounded-full flex items-center justify-center backdrop-blur-sm transition-colors">
              <RiArrowLeftUpLine size={16} className="text-white" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  /* ── GRID VARIANT ── */
  return (
    <Link
      href={`/post/${slug as string}`}
      className="group flex flex-col h-full bg-card rounded-3xl overflow-hidden border border-border hover:border-primary-brand/40 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg"
      dir="rtl"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          alt={(title as string) || "Article Image"}
          src={imageUrl}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute bottom-3 left-3 w-8 h-8 bg-white/90 dark:bg-card/90 rounded-full flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow">
          <RiArrowLeftUpLine size={16} className="text-primary-brand" />
        </div>
      </div>

      <div className="flex flex-col grow p-5 gap-3">
        <div className="flex items-center justify-between gap-2">
          {category && (
            <span className="text-[10px] font-black tracking-widest bg-primary-brand/10 text-primary-brand px-3 py-1 rounded-full">
              {category as string}
            </span>
          )}
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-bold shrink-0">
            <RiCalendar2Line size={13} />
            <span>{date}</span>
          </div>
        </div>

        <h2 className="text-base font-black leading-snug text-foreground group-hover:text-primary-brand transition-colors duration-300 line-clamp-2 grow">
          {title as string}
        </h2>

        <div className="flex items-center gap-1 text-primary-brand font-bold text-xs pt-1 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>اقرأ المزيد</span>
          <span>←</span>
        </div>
      </div>
    </Link>
  );
}
