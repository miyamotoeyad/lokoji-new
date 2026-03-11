// app/infographics/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Asset, AssetFile } from "contentful";
import {
  RiCalendar2Line,
  RiArrowRightSLine,
  RiBarChartBoxLine,
  RiDownloadLine,
} from "@remixicon/react";
import {
  getInfographic,
  getInfographicSlugs,
  InfographicEntry,
} from "@/utils/Content/getInfograhic";
import ShareButton from "../ShareButton";

type Params = Promise<{ slug: string }>;

// ── Static paths ──
export async function generateStaticParams() {
  const slugs = await getInfographicSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ── Metadata ──
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getInfographic(slug);
  if (!data) return {};

  const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "http://localhost:3000";
  const firstImage = getImageUrl(data, 0);

  return {
    title: data.fields.title,
    description: data.fields.description as string,
    alternates: { canonical: siteUrl + "/infographics/" +slug },
    openGraph: {
      title: data.fields.title as string,
      description: data.fields.description as string,
      url: siteUrl + "/infographics/" +slug ,
      images:
        firstImage !== "/no-image.png"
          ? [{ url: firstImage, width: 1200, height: 630 }]
          : [],
    },
  };
}

// ── Helpers ──
function getImageUrl(
  entry: InfographicEntry,
  index: number,
  width = 1200,
): string {
  const images = entry.fields.images as unknown as Asset[];
  if (!images?.[index]) return "/no-image.png";
  const file = images[index]?.fields?.file as AssetFile | undefined;
  if (!file?.url) return "/no-image.png";
  return `https:${file.url}?w=${width}&fm=webp&q=80&fit=fill`;
}

// ── Page ──
export default async function InfographicPage({ params }: { params: Params }) {
  const { slug } = await params;
  const data = await getInfographic(slug);
  if (!data) return notFound();

  const images = data.fields.images as unknown as Asset[];
  const title = data.fields.title as string;
  const description = data.fields.description as string;
  const date = new Date(data.fields.publicationDate).toLocaleDateString(
    "ar-EG",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  // JSON-LD schema
  const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: title,
    description,
    url: `${siteUrl}/infographics/${slug}`,
    datePublished: data.fields.publicationDate,
    contentUrl: getImageUrl(data, 0),
  };

  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl" dir="rtl">
      {/* ── BREADCRUMB ── */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold mb-8">
        <Link href="/" className="hover:text-primary-brand transition-colors">
          الرئيسية
        </Link>
        <RiArrowRightSLine size={14} className="rotate-180" />
        <Link
          href="/infographics"
          className="hover:text-primary-brand transition-colors"
        >
          إنفوجرافيك
        </Link>
        <RiArrowRightSLine size={14} className="rotate-180" />
        <span className="text-foreground line-clamp-1">{title}</span>
      </nav>

      {/* ── HEADER ── */}
      <header className="space-y-5 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-brand/10 border border-primary-brand/20 text-primary-brand text-xs font-black">
          <RiBarChartBoxLine size={14} />
          <span>{data.fields.category as string}</span>{" "}
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-foreground leading-tight">
          {title}
        </h1>

        <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
          {description}
        </p>

        <div className="flex items-center justify-between flex-wrap gap-4 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-bold">
            <RiCalendar2Line size={16} className="text-primary-brand" />
            <span>{date}</span>
          </div>

          {/* Share / Download actions */}
          <div className="flex items-center gap-2">
            <ShareButton title={title} /> 
            <Link
              href={`${getImageUrl(data, 0, 2400)}`}
              download={`${slug}.webp`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary-brand text-white text-sm font-black hover:bg-primary-brand/90 transition-all"
            >
              <RiDownloadLine size={16} />
              <span className="hidden sm:inline">تحميل</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── IMAGES ── */}
      <div className="space-y-6">
        {images.map((_, index) => {
          const imgUrl = getImageUrl(data, index, 1200);
          const thumbUrl = getImageUrl(data, index, 48);
          if (imgUrl === "/no-image.png") return null;

          return (
            <div
              key={index}
              className="relative w-full overflow-hidden rounded-3xl border border-border shadow-lg bg-muted"
            >
              <Image
                src={imgUrl}
                alt={`${title} — صورة ${index + 1}`}
                width={1200}
                height={800}
                priority={index === 0} // only first image preloads
                placeholder="blur"
                blurDataURL={thumbUrl} // tiny Contentful thumbnail as blur placeholder
                sizes="(max-width: 768px) 100vw, 896px"
                className="w-full h-auto"
              />

              {/* Page number badge for multi-image infographics */}
              {images.length > 1 && (
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                  {index + 1} / {images.length}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── BACK LINK ── */}
      <div className="mt-14 pt-8 border-t border-border">
        <Link
          href="/infographics"
          className="inline-flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-primary-brand transition-colors"
        >
          <RiArrowRightSLine size={18} />
          العودة إلى كل الإنفوجرافيك
        </Link>
      </div>

      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
