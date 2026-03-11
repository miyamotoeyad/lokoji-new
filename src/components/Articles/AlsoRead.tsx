// components/Articles/AlsoRead.tsx
import { Entry } from "contentful";
import { TypeArticlesSkeleton } from "@/types";
import { Asset, AssetFile } from "contentful";
import { RiBellLine } from "@remixicon/react";
import AlsoReadClient, { RelatedArticleData } from "@/app/post/AlsoReadClient";

interface AlsoReadProps {
  articles: Entry<TypeArticlesSkeleton, undefined, string>[];
  currentSlug: string;
  currentTags: string[];
}

function getImageUrl(image: unknown): string {
  const asset = image as Asset;
  const file = asset?.fields?.file as AssetFile | undefined;
  const rawUrl = file?.url ? `https:${file.url}` : null;
  return rawUrl ? `${rawUrl}?w=160&h=160&fm=webp&q=75&fit=fill` : "/no-image.png";
}

export default function AlsoRead({ articles, currentSlug, currentTags }: AlsoReadProps) {
  
  const related: RelatedArticleData[] = articles
    .filter((post) => (post.fields.slug as string) !== currentSlug)
    .map((post) => {
      const postTags = (post.fields.tag as string[]) ?? [];
      const relevanceScore = postTags.filter((tag) => currentTags.includes(tag)).length;
      return { post, relevanceScore };
    })
    .sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore)
        return b.relevanceScore - a.relevanceScore;
      return new Date(b.post.sys.createdAt).getTime() - new Date(a.post.sys.createdAt).getTime();
    })
    
    .map(({ post, relevanceScore }) => ({
      id: post.sys.id,
      slug: post.fields.slug as string,
      title: post.fields.title as string,
      category: post.fields.category as string,
      imageUrl: getImageUrl(post.fields.image),
      date: new Date(post.fields.publicationDate).toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "short",
      }),
      relevanceScore,
    }));

  return (
    <aside className="space-y-4" dir="rtl">
      <AlsoReadClient articles={related} />

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