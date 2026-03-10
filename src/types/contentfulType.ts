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
  subtitle: EntryFieldTypes.Symbol;
  author: EntryFieldTypes.EntryLink<AuthorSkeleton>;
  category: EntryFieldTypes.Symbol;
  publicationDate: EntryFieldTypes.Date;
  image: EntryFieldTypes.AssetLink;
  tag: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  content: EntryFieldTypes.RichText;
}
export type ArticleSkeleton = EntrySkeletonType<TypeArticlesFields, "articles">;
