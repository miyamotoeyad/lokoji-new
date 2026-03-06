import { Entry } from "contentful";
import { TypeArticlesSkeleton } from "@/types";
import ArtAlsoRead from "./ArtAlsoRead";
import { RiBellLine } from "react-icons/ri";

interface AlsoReadProps {
  articles: Entry<TypeArticlesSkeleton, undefined, string>[];
  currentSlug: string;
  currentTags: string[];
}

type ScoredEntry = Entry<TypeArticlesSkeleton, undefined, string> & {
  relevanceScore: number;
};

export default function AlsoRead({ articles, currentSlug, currentTags }: AlsoReadProps) {

  const relatedArticles: ScoredEntry[] = articles
    .filter((post) => (post.fields.slug as string) !== currentSlug)
    .map((post) => {
      const postTags = (post.fields.tag as string[]) ?? [];
      const relevanceScore = postTags.filter((tag) => currentTags.includes(tag)).length;
      return { ...post, relevanceScore };
    })
    .sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore)
        return b.relevanceScore - a.relevanceScore;
      return new Date(b.sys.createdAt).getTime() - new Date(a.sys.createdAt).getTime();
    })
    .slice(0, 5);

  return (
    <aside className="space-y-4" dir="rtl">

      {/* ── RELATED ARTICLES ── */}
      <div className="flex flex-col gap-3">
        {relatedArticles.map((post) => (
          <ArtAlsoRead key={post.sys.id} data={post} />
        ))}
      </div>

      {/* ── ALERTS CTA ── */}
      <div className="p-5 bg-primary-brand/5 border border-primary-brand/15 rounded-3xl space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
            <RiBellLine size={14} />
          </div>
          <p className="text-sm font-black text-primary-brand">تغطية خاصة</p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          اشترك في تنبيهات لوكوجي لتصلك تقارير البورصة المصرية فور صدورها.
        </p>
      </div>

    </aside>
  );
}