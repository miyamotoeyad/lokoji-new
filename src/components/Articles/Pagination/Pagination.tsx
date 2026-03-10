import Link from "next/link";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";

interface Props {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export function Pagination({ currentPage, totalPages, basePath = "/articles" }: Props) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) =>
    page === 1 ? basePath : `${basePath}?page=${page}`;

  // Build page number array with ellipsis: [1, ..., 4, 5, 6, ..., 10]
  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav
      className="flex items-center justify-center gap-2 mt-16"
      aria-label="pagination"
      dir="rtl"
    >
      {/* Prev */}
      <Link
        href={getPageUrl(currentPage - 1)}
        aria-disabled={currentPage === 1}
        className={`w-10 h-10 flex items-center justify-center rounded-2xl border border-border font-black transition-all
          ${currentPage === 1
            ? "pointer-events-none opacity-30"
            : "hover:border-primary-brand/40 hover:text-primary-brand hover:bg-primary-brand/5"
          }`}
      >
        <RiArrowRightSLine size={18} />
      </Link>

      {/* Pages */}
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="w-10 text-center text-muted-foreground text-sm">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-2xl border font-black text-sm transition-all
              ${page === currentPage
                ? "bg-primary-brand text-white border-primary-brand shadow-lg shadow-primary-brand/20"
                : "border-border hover:border-primary-brand/40 hover:text-primary-brand hover:bg-primary-brand/5"
              }`}
          >
            {page}
          </Link>
        )
      )}

      {/* Next */}
      <Link
        href={getPageUrl(currentPage + 1)}
        aria-disabled={currentPage === totalPages}
        className={`w-10 h-10 flex items-center justify-center rounded-2xl border border-border font-black transition-all
          ${currentPage === totalPages
            ? "pointer-events-none opacity-30"
            : "hover:border-primary-brand/40 hover:text-primary-brand hover:bg-primary-brand/5"
          }`}
      >
        <RiArrowLeftSLine size={18} />
      </Link>
    </nav>
  );
}