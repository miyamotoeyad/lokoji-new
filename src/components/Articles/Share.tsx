"use client";

import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
} from "next-share";

import { useState } from "react";
import {
  RiCheckLine,
  RiFacebookCircleFill,
  RiLinkedinBoxFill,
  RiLinksLine,
  RiTelegramFill,
  RiTwitterXFill,
  RiWhatsappLine,
  RiShareForwardLine,
} from "react-icons/ri";

import { cn } from "@/lib/utils";

interface ShareProps {
  articles: {
    slug: string;
    title: string;
    subtitle?: string;
  };
}

const shareButtons = [
  { Button: FacebookShareButton, Icon: RiFacebookCircleFill, label: "فيسبوك",  color: "hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]/30" },
  { Button: TwitterShareButton,  Icon: RiTwitterXFill,       label: "تويتر",   color: "hover:bg-foreground/10 hover:text-foreground hover:border-border" },
  { Button: TelegramShareButton, Icon: RiTelegramFill,       label: "تيليجرام", color: "hover:bg-[#26A5E4]/10 hover:text-[#26A5E4] hover:border-[#26A5E4]/30" },
  { Button: WhatsappShareButton, Icon: RiWhatsappLine,       label: "واتساب",  color: "hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30" },
  { Button: LinkedinShareButton, Icon: RiLinkedinBoxFill,    label: "لينكدإن", color: "hover:bg-[#0077B5]/10 hover:text-[#0077B5] hover:border-[#0077B5]/30" },
] as const;

export default function Share({ articles }: ShareProps) {
  const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL ?? "https://lokoji.com";
  const [copied, setCopied] = useState(false);
  const fullUrl = `${siteUrl}/post/${articles.slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div className="py-8 border-b border-border" dir="rtl">

      {/* ── HEADER ── */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
          <RiShareForwardLine size={16} />
        </div>
        <h2 className="text-base font-black text-foreground">مشاركة هذا التقرير</h2>
      </div>

      {/* ── BUTTONS ── */}
      <div className="flex flex-wrap gap-3">
        {shareButtons.map(({ Button, Icon, label, color }) => (
          <Button
            key={label}
            url={fullUrl}
            title={articles.title}
            {...(Button === FacebookShareButton ? { hashtag: "#لوكوجي" } : {})}
          >
            <div
              title={label}
              className={cn(
                "cursor-pointer flex items-center justify-center w-11 h-11 rounded-2xl",
                "bg-muted border border-border text-muted-foreground",
                "transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
                color
              )}
            >
              <Icon size={20} />
            </div>
          </Button>
        ))}

        {/* ── COPY LINK ── */}
        <div className="relative">
          <button
            onClick={handleCopyLink}
            title="نسخ الرابط"
            className={cn(
              "cursor-pointer flex items-center justify-center w-11 h-11 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
              copied
                ? "bg-green-500/10 border-green-500/30 text-green-500"
                : "bg-muted border-border text-muted-foreground hover:bg-primary-brand/10 hover:border-primary-brand/30 hover:text-primary-brand"
            )}
          >
            {copied ? <RiCheckLine size={20} /> : <RiLinksLine size={20} />}
          </button>

          {/* Tooltip */}
          {copied && (
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-card border border-border text-foreground text-[10px] font-black rounded-xl whitespace-nowrap shadow-lg animate-in fade-in zoom-in slide-in-from-bottom-2">
              تم النسخ ✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
}