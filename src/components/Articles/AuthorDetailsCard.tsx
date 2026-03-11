import Image from "next/image";
import { Asset, Entry } from "contentful";
import { TypeAuthorsSkeleton } from "@/types";
import {
  RiFacebookCircleFill,
  RiTwitterXFill,
  RiLinkedinFill,
  RiArticleLine,
  RiArrowLeftLine,
} from "@remixicon/react";
import type { IconType } from "react-icons";
import Link from "next/link";

interface AuthorDetailsCardProps {
  authorEntry: Entry<TypeAuthorsSkeleton, undefined, string>;
  articleCount?: number;
  variant?: "list" | "grid";
}

export function AuthorDetailsCard({
  authorEntry,
  articleCount,
  variant = "list",
}: AuthorDetailsCardProps) {
  const {
    name,
    description,
    image,
    facebook,
    twitter,
    linkedin,
    isFacebook,
    isTwitter,
    isLinkedin,
    slug,
  } = authorEntry.fields;

  const authorImage = image as unknown as Asset<undefined, string>;
  const imageUrl = authorImage?.fields?.file?.url;

  const profileHref = `/author/${slug as string}`;

  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
      {/* Dark banner */}
      <div className="bg-dprimary relative h-24 overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-brand/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary-brand/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="relative w-20 h-20 -mt-10 mb-4 ring-4 ring-card rounded-full overflow-hidden bg-muted">
          {imageUrl && (
            <Image
              src={`https:${imageUrl}`}
              alt={name as string}
              fill
              className="object-cover"
            />
          )}
        </div>

        <h1 className="text-xl font-black text-foreground leading-tight mb-0.5">
          {name as string}
        </h1>
        <p className="text-primary-brand font-bold text-xs mb-4" dir="ltr">
          @{slug as string}
        </p>

        {articleCount !== undefined && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
              <RiArticleLine size={14} />
            </div>
            <span className="text-xs font-black text-muted-foreground">
              {articleCount} مقال منشور
            </span>
          </div>
        )}

        <p className="text-muted-foreground text-sm leading-relaxed border-t border-border pt-4 mb-5">
          {description as string}
        </p>

        <div className="flex justify-between items-center gap-2">
          {/* Social Links */}
          {(isFacebook || isTwitter || isLinkedin) && (
            <div className="flex gap-2">
              {isFacebook && facebook && (
                <SocialLink
                  href={facebook as string}
                  Icon={RiFacebookCircleFill}
                  hoverColor="hover:bg-blue-600/10 hover:text-blue-600 hover:border-blue-600/30"
                />
              )}
              {isTwitter && twitter && (
                <SocialLink
                  href={twitter as string}
                  Icon={RiTwitterXFill}
                  hoverColor="hover:bg-foreground/10 hover:text-foreground hover:border-foreground/30"
                />
              )}
              {isLinkedin && linkedin && (
                <SocialLink
                  href={linkedin as string}
                  Icon={RiLinkedinFill}
                  hoverColor="hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/30"
                />
              )}
            </div>
          )}
          {variant === "list" ? (
            <Link
              href={profileHref}
              className="group btn flex items-center justify-center gap-2 text-sm font-black"
            >
              <span>عرض الملف الشخصي</span>
              <RiArrowLeftLine
                size={16}
                className="transition-transform group-hover:-translate-x-1"
              />
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

function SocialLink({
  href,
  Icon,
  hoverColor,
}: {
  href: string;
  Icon: IconType;
  hoverColor: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground transition-all duration-200 ${hoverColor}`}
    >
      <Icon size={16} />
    </Link>
  );
}
