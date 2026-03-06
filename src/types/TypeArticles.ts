import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeAuthorsSkeleton } from "./TypeAuthors";

export interface TypeArticlesFields {
    title: EntryFieldTypes.Text;
    slug: EntryFieldTypes.Text;
    subtitle: EntryFieldTypes.Text;
    author: EntryFieldTypes.EntryLink<TypeAuthorsSkeleton>;
    category: EntryFieldTypes.Symbol<"آراء" | "اتعلم اقتصاد" | "الاقتصاد العالمي" | "الاقتصاد المصري" | "السلع" | "الطاقة" | "العملات" | "تكنولوجيا" | "سندات" | "سياسة" | "شركات" | "صناديق الاستثمار" | "كريبتو">;
    image: EntryFieldTypes.AssetLink;
    tag: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
    content: EntryFieldTypes.RichText;
}

export type TypeArticlesSkeleton = EntrySkeletonType<TypeArticlesFields, "articles">;
export type TypeArticles<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeArticlesSkeleton, Modifiers, Locales>;
