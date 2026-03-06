"use client";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import {
  BLOCKS,
  INLINES,
  Document as RichTextDocument,
  Block,
  Inline,
} from "@contentful/rich-text-types";
import Image from "next/image";
import { ReactNode } from "react";
import { RiDoubleQuotesR } from "react-icons/ri";
import { Entry } from "contentful";
import { TypeArticlesSkeleton } from "@/types";
import { Asset, AssetFile } from "contentful";

// ── Typed renderer options ──
const renderOptions = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node: Block | Inline, children: ReactNode) => (
      <p className="mb-8 text-lg leading-[1.8] text-muted-foreground font-medium">
        {children}
      </p>
    ),

    [BLOCKS.QUOTE]: (_node: Block | Inline, children: ReactNode) => (
      <div className="relative my-12 p-8 bg-muted border-r-4 border-primary-brand rounded-3xl italic">
        <RiDoubleQuotesR
          className="absolute -top-4 right-6 text-primary-brand/20"
          size={60}
        />
        <div className="text-xl md:text-2xl text-foreground font-bold leading-relaxed relative z-10">
          {children}
        </div>
      </div>
    ),

    [BLOCKS.HEADING_2]: (_node: Block | Inline, children: ReactNode) => (
      <h2 className="text-3xl font-black mt-16 mb-6 text-foreground border-b border-border pb-4">
        {children}
      </h2>
    ),

    [BLOCKS.HEADING_3]: (_node: Block | Inline, children: ReactNode) => (
      <h3 className="text-2xl font-black mt-12 mb-4 text-foreground">
        {children}
      </h3>
    ),

    [INLINES.HYPERLINK]: (node: Block | Inline, children: ReactNode) => (
      <a
        className="text-primary-brand font-bold underline underline-offset-4 hover:text-primary-brand/70 transition-colors"
        href={(node as Inline).data.uri as string}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),

    [BLOCKS.EMBEDDED_ASSET]: (node: Block | Inline) => {
      const asset  = (node as Block).data.target as Asset;
      const file   = asset?.fields?.file as AssetFile | undefined;
      const title  = asset?.fields?.title as string | undefined;
      const imgUrl = file?.url ? `https:${file.url}` : null;

      if (!imgUrl) return null;

      return (
        <figure className="my-12">
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl shadow-lg">
            <Image
              src={imgUrl}
              alt={title ?? "Lokoji content image"}
              fill
              className="object-cover"
            />
          </div>
          {title && (
            <figcaption className="mt-4 text-center text-sm font-bold text-muted-foreground italic">
              — {title}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

// ── Component ──
interface ContentProps {
  articles: Entry<TypeArticlesSkeleton, undefined, string>;
}

export default function Content({ articles }: ContentProps) {
  return (
    <div className="article-content max-w-none text-right" dir="rtl">
      {documentToReactComponents(
        articles.fields.content as RichTextDocument,
        renderOptions
      )}
    </div>
  );
}