interface NavLink {
  title: string;
  link?: string;
  id: number;
  priority?: number;
  freq?: "daily" | "hourly" | "weekly" | "monthly";
  subLinks?: {
    title: string;
    link: string;
    id: number;
    priority?: number;
    freq?: "daily" | "hourly" | "weekly" | "monthly";
  }[];
}

export const NavLinks: NavLink[] = [
  {
    title: "الصفحة الرئيسية",
    link: "/",
    id: 1,
    priority: 1.0,
    freq: "daily",
  },
  {
    title: "الأسواق",
    id: 10,
    subLinks: [
      {
        title: "البورصة المصرية",
        link: "/eg-market",
        id: 8,
        priority: 0.9,
        freq: "hourly",
      },
      {
        title: "صناديق الاستثمار",
        link: "/etfs",
        id: 12,
        priority: 0.9,
        freq: "hourly",
      },
      {
        title: "السلع والمعادن",
        link: "/commodities",
        id: 13,
        priority: 0.9,
        freq: "hourly",
      },
      {
        title: "السوق العالمي",
        link: "/world-market",
        id: 14,
        priority: 0.9,
        freq: "hourly",
      },
      {
        title: "أسهم الشركات العالمية",
        link: "/world-stocks",
        id: 15,
        priority: 0.9,
        freq: "hourly",
      },
      {
        title: "أسعار العملات",
        link: "/exchange",
        id: 11,
        priority: 0.9,
        freq: "hourly",
      },
      {
        title: "العملات الرقمية",
        link: "/crypto",
        id: 9,
        priority: 0.8,
        freq: "hourly",
      },
    ],
  },
  {
    title: "المقالات",
    link: "/articles",
    id: 2,
    priority: 0.9,
    freq: "daily",
  },
  {
    title: "انفوجرافيك",
    link: "/infographics",
    id: 3,
    priority: 0.7,
    freq: "weekly",
  },
  {
    title: "احنا مين؟",
    link: "/about",
    id: 6,
    priority: 0.5,
    freq: "monthly",
  },
  {
    title: "اتواصل معانا",
    link: "/contact",
    id: 4,
    priority: 0.6,
    freq: "monthly",
  },
  {
    title: "ادعمنا",
    link: "/support",
    id: 5,
    priority: 0.5,
    freq: "monthly",
  },
];
