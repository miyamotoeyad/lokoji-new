import { ContentImage } from "@/utils/ContentfulImage";
import { Document as RichTextDocument } from "@contentful/rich-text-types";

export type menLinks = {
    title: string,
    link: string,
    id: number
}

export interface Article {
    title: string;
    slug: string;
    subtitle: string;
    category: string;
    author: string;
    tag: Array<string>;
    content: RichTextDocument | null;
    image: ContentImage | null;
    sys: {
      id: string
      createdAt: string
      updatedAt: string
    }
  }

export type { TypeArticles, TypeArticlesFields, TypeArticlesSkeleton } from "./TypeArticles";
export type { TypeAuthors, TypeAuthorsFields, TypeAuthorsSkeleton } from "./TypeAuthors";
export type { Articles } from "./ArtCardsTypes"