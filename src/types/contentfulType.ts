import type { EntryFieldTypes, EntrySkeletonType } from "contentful";

// ── Author Schema ─────────────────────────────────────────────────────────────
export interface TypeAuthorsFields {
  name: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  description: EntryFieldTypes.Text;
  image: EntryFieldTypes.AssetLink;
  facebook?: EntryFieldTypes.Symbol;
  isFacebook?: EntryFieldTypes.Boolean;
  twitter?: EntryFieldTypes.Symbol;
  isTwitter?: EntryFieldTypes.Boolean;
  linkedin?: EntryFieldTypes.Symbol;
  isLinkedin?: EntryFieldTypes.Boolean;
}
export type AuthorSkeleton = EntrySkeletonType<TypeAuthorsFields, "authors">;

// ── Article Schema ────────────────────────────────────────────────────────────
export interface TypeArticlesFields {
  title: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  subtitle: EntryFieldTypes.Symbol; // ✅ added
  author: EntryFieldTypes.EntryLink<AuthorSkeleton>;
  category: EntryFieldTypes.Symbol<
    | "آراء"
    | "اتعلم اقتصاد"
    | "الاقتصاد العالمي"
    | "الاقتصاد المصري"
    | "السلع"
    | "الطاقة"
    | "العملات"
    | "تكنولوجيا"
    | "سندات"
    | "سياسة"
    | "شركات"
    | "صناديق الاستثمار"
    | "كريبتو"
  >;
  publicationDate: EntryFieldTypes.Date; // ✅ added
  image: EntryFieldTypes.AssetLink;
  tag: EntryFieldTypes.Array<EntryFieldTypes.Symbol>; // ✅ added
  content: EntryFieldTypes.RichText; // ✅ added
}
export type ArticleSkeleton = EntrySkeletonType<TypeArticlesFields, "articles">;
