import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeAuthorsFields {
    name: EntryFieldTypes.Symbol;
    description: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    image: EntryFieldTypes.AssetLink;
    facebook?: EntryFieldTypes.Symbol;
    isFacebook?: EntryFieldTypes.Boolean;
    isTwitter?: EntryFieldTypes.Boolean;
    twitter?: EntryFieldTypes.Symbol;
    isLinkedin?: EntryFieldTypes.Boolean;
    linkedin?: EntryFieldTypes.Symbol;
}

export type TypeAuthorsSkeleton = EntrySkeletonType<TypeAuthorsFields, "authors">;
export type TypeAuthors<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeAuthorsSkeleton, Modifiers, Locales>;
