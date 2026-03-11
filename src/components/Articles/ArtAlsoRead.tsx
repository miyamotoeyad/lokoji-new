import Image from "next/image";
import Link from "next/link";
import { RiCalendar2Line, RiArrowLeftSLine } from "@remixicon/react";
import { Entry } from "contentful";
import { Asset, AssetFile } from "contentful";
import { TypeArticlesSkeleton } from "@/types";

interface ArtAlsoReadProps {
  data: Entry<TypeArticlesSkeleton, undefined, string>;
}

export default function ArtAlsoRead({ data }: ArtAlsoReadProps) {
  const { title, slug, image, category } = data.fields;

  const asset = image as Asset;
  const file = asset?.fields?.file as AssetFile | undefined;
  const rawUrl = file?.url ? `https:${file.url}` : null;
  const imageUrl = rawUrl
    ? `${rawUrl}?w=160&h=160&fm=webp&q=75&fit=fill`
    : "/no-image.png";

  const date = new Date(data.fields.publicationDate).toLocaleDateString(
    "ar-EG",
    {
      day: "numeric",
      month: "short",
    },
  );

  return (
    <Link
      href={`/post/${slug as string}`}
      className="group flex gap-3 p-3 rounded-2xl bg-card border border-border hover:border-primary-brand/30 hover:shadow-md transition-all duration-300"
      dir="rtl"
    >
      {/* ── THUMBNAIL ── */}
      <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-xl">
        <Image
          alt={title as string}
          src={imageUrl}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="80px"
        />
        {/* Mobile category badge */}
        <div className="absolute top-1 right-1 bg-primary-brand text-[8px] font-black text-white px-2 py-0.5 rounded-md lg:hidden">
          {category as string}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="flex flex-col justify-between py-1 grow min-w-0">
        <div>
          {/* Desktop category */}
          <span className="hidden lg:block text-[10px] font-black text-primary-brand uppercase tracking-widest mb-1">
            {category as string}
          </span>
          <h3 className="text-sm font-bold leading-snug text-foreground group-hover:text-primary-brand transition-colors duration-200 line-clamp-2">
            {title as string}
          </h3>
        </div>

        {/* ── FOOTER ── */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold">
            <RiCalendar2Line size={12} />
            <span>{date}</span>
          </div>
          <RiArrowLeftSLine
            size={16}
            className="text-primary-brand opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
          />
        </div>
      </div>
    </Link>
  );
}
