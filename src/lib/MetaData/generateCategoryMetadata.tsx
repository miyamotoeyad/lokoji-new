import { Metadata } from "next";
import { CatMenu } from "@/lib/Menus/categoryMenu";

export type CategoryParams = Promise<{ slug: string }>;

export async function generateCategoryMetadata({
  params,
}: {
  params: CategoryParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.com";
  const canonical = `${siteUrl}/articles/category/${slug}`;

  const navTitle = CatMenu.find((item) => item.link.toString() === slug);
  if (!navTitle) return { title: "قسم غير موجود" };

  const title = `${navTitle.title}`;
  const desc = `دي صفحة تابعة لقسم ${navTitle.title}`;

  return {
    title,
    description: desc,
    alternates: { canonical },
    openGraph: {
      title,
      description: desc,
      url: canonical,
      siteName: "لوكوجي",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description: desc,
    },
  };
}
