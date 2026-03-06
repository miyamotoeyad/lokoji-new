import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthorCard } from "@/components/Cards";
import { AuthorDetailsCard } from "@/components/Articles/AuthorDetailsCard";
import { getAuthorBySlug } from "@/utils/Content/getAuthor";
import getArticles from "@/utils/Content/getArticles";
import { Entry } from "contentful";
import { TypeArticlesSkeleton } from "@/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug }    = await params;
  const authorEntry = await getAuthorBySlug(slug);
  if (!authorEntry) return { title: "الكاتب غير موجود" };
  return {
    title: `${authorEntry.fields.name as string} :: لوكوجي`,
    description: authorEntry.fields.description as string,
  };
}

export default async function AuthorDetailsPage({ params }: Props) {
  const { slug }    = await params;
  const authorEntry = await getAuthorBySlug(slug);
  if (!authorEntry) notFound();

  const allArticles: Entry<TypeArticlesSkeleton, undefined, string>[] = await getArticles();

  const authorArticles = allArticles.filter((art) => {
    const artAuthor = art.fields.author;
    return artAuthor && "fields" in artAuthor
      ? artAuthor.fields.name === authorEntry.fields.name
      : false;
  });

  return (
    <main
      className="max-w-7xl mx-auto px-4 py-10 grid gap-10 md:grid-cols-[320px_1fr]"
      dir="rtl"
    >
      {/* ── SIDEBAR ── */}
      <aside className="h-fit md:sticky md:top-32">
        <AuthorDetailsCard
          authorEntry={authorEntry}
          articleCount={authorArticles.length}
          variant="grid"
        />
      </aside>

      {/* ── ARTICLES ── */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
          <h2 className="text-2xl font-black text-foreground">مقالاته</h2>
          <span className="bg-primary-brand/10 text-primary-brand px-3 py-1 rounded-full text-xs font-black">
            {authorArticles.length}
          </span>
        </div>

        {authorArticles.length > 0 ? (
          <div className="space-y-3">
            {authorArticles.map((article) => (
              <AuthorCard
                key={article.sys.id}
                news={article}
                variant="list"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-3xl gap-3">
            <p className="text-4xl">✍️</p>
            <p className="text-muted-foreground font-bold text-sm">
              لا توجد مقالات منشورة لهذا الكاتب حالياً.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}