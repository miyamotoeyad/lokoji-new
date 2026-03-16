interface FooterLink {
  label: string;
  href?: string;
  priority?: number;
  freq?: "daily" | "hourly" | "weekly" | "monthly";
}

export const footerLinks: FooterLink[] = [
  { href: "/about", label: " إحنا مين؟", priority: 0.8, freq: "hourly" },
  { href: "/privacy-policy", label: "سياسة الخصوصية", priority: 0.8, freq: "hourly" },
  { href: "/terms", label: "شروط الاستخدام", priority: 0.8, freq: "hourly" },
  { href: "/disclaimer", label: "إخلاء المسؤولية", priority: 0.8, freq: "hourly" },
];
