import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Articles/Header";
import Content from "@/components/Articles/Content";
import Share from "@/components/Articles/Share";
import Tag from "@/components/Articles/Tag";
import AlsoRead from "@/components/Articles/AlsoRead";
import GoogleNews from "@/components/Articles/GoogleNews";
import { client } from "@/utils/contentful";
import { TypeArticlesSkeleton, TypeAuthorsSkeleton } from "@/types";
import getArticles, { getArticle } from "@/utils/Content/getArticles";
import { Asset, AssetFile, Entry } from "contentful";
import { AuthorDetailsCard } from "@/components/Articles/AuthorDetailsCard";

type Params = Promise<{ slug: string }>;

// ── Helper: safely extract image URL from a Contentful Asset field ──
function getImageUrl(image: unknown): string {
  if (image && typeof image === "object" && "fields" in image) {
    const asset = image as Asset<undefined, string>;
    const file = asset.fields.file as AssetFile | undefined;
    return file?.url ? `https:${file.url}` : "/no-image.png";
  }
  return "/no-image.png";
}

// ── Static paths ──
export const generateStaticParams = async () => {
  const res = await client.getEntries<TypeArticlesSkeleton>({
    content_type: "articles",
  });
  return res.items.map((item) => ({ slug: item.fields.slug }));
};

// ── Metadata ──
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getArticle(slug);
  const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL ?? "https://lokoji.com";

  if (!data) return notFound();

  const imageUrl = getImageUrl(data.fields.image);

  return {
    title: data.fields.title as string,
    description: (data.fields.subtitle as string) ?? "",
    alternates: { canonical: `${siteUrl}/post/${data.fields.slug}` },
    keywords: data.fields.tag as string[],
    openGraph: {
      title: data.fields.title as string,
      description: (data.fields.subtitle as string) ?? "",
      type: "article",
      url: `${siteUrl}/post/${data.fields.slug}`,
      publishedTime: data.sys.createdAt,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: data.fields.title as string,
      images: [imageUrl],
    },
  };
}

// ── Page ──
export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const [data, allArticles] = await Promise.all([
    getArticle(slug),
    getArticles(),
  ]);
  const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL ?? "https://lokoji.com";

  if (!data) return notFound();

  const imageUrl = getImageUrl(data.fields.image);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: data.fields.title,
    image: [imageUrl],
    datePublished: data.sys.createdAt,
    dateModified: data.sys.updatedAt,
    author: [{ "@type": "Organization", name: "لوكوجي", url: siteUrl }],
  };

  const isAuthorResolved = data.fields.author && "fields" in data.fields.author;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:py-16" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* ── MAIN ARTICLE ── */}
        <article className="lg:col-span-8 space-y-10">
          {/* Header */}
          <header>
            <Header articles={data} />
          </header>

          {/* Body */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-black prose-headings:text-foreground
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-primary-brand prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-primary-brand prose-blockquote:text-muted-foreground
            prose-strong:text-foreground prose-img:rounded-3xl prose-img:shadow-lg"
          >
            <Content articles={data} />
          </div>

          {/* Footer actions */}
          <div className="border-t border-border pt-8 space-y-8">
            <Share articles={data.fields} />
            <Tag articles={data} />
            {isAuthorResolved ? (
              <AuthorDetailsCard
                authorEntry={
                  data.fields.author as Entry<
                    TypeAuthorsSkeleton,
                    undefined,
                    string
                  >
                }
              />
            ) : (
              <div className="p-4 bg-muted rounded-xl text-center text-sm">
                أسرة تحرير لوكوجي
              </div>
            )}
            <GoogleNews />
          </div>
        </article>

        {/* ── SIDEBAR ── */}
        <aside className="lg:col-span-4">
          <div className="sticky top-28 space-y-6">
            {/* Also Read */}
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1 h-6 bg-primary-brand rounded-full block" />
                <h3 className="text-lg font-black text-foreground">
                  اقرأ أيضاً
                </h3>
              </div>
              <AlsoRead
                articles={allArticles}
                currentSlug={data.fields.slug as string}
                currentTags={(data.fields.tag as string[]) ?? []}
              />
            </div>

            {/* Newsletter CTA */}
            <div className="bg-dprimary rounded-3xl p-6 text-white relative overflow-hidden">
              <div className="absolute -top-8 -left-8 w-28 h-28 bg-primary-brand/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-3">
                <div className="w-8 h-1 bg-primary-brand rounded-full" />
                <h4 className="font-black text-base">لا تفوت التحديثات</h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  اشترك في نشرتنا البريدية ليصلك جديد الاقتصاد المصري كل صباح.
                </p>
                <Link
                  href="/#newsletter"
                  className="inline-flex items-center gap-1 text-xs font-black text-primary-brand hover:gap-2 transition-all duration-200"
                >
                  اشترك الآن ←
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
