interface NavLink {
  title: string;
  link?: string;
  id: number;
  subLinks?: { title: string; link: string; id: number }[];
}

export const NavLinks: NavLink[] = [
  {
    title: "الصفحة الرئيسية",
    link: "/",
    id: 1,
  },
  {
    title: "الأسواق",
    id: 10,
    subLinks: [
      { title: "البورصة المصرية", link: "/eg-market", id: 8 },
      { title: "صناديق الاستثمار", link: "/etfs", id: 12 },
      { title: "السلع والمعادن", link: "/commodities", id: 13 },
      { title: "السوق العالمي", link: "/world-market", id: 14 },
      { title: "أسهم الشركات العالمية", link: "/world-stocks", id: 15 },
      { title: "أسعار العملات", link: "/exchange", id: 11 },
      { title: "العملات الرقمية", link: "/crypto", id: 9 },
    ],
  },
  {
    title: "المقالات",
    link: "/articles",
    id: 2,
  },
  {
    title: "انفوجرافيك",
    link: "/infographics",
    id: 3,
  },
  {
    title: "احنا مين؟",
    link: "/about",
    id: 6,
  },
  {
    title: "اتواصل معانا",
    link: "/contact",
    id: 4,
  },
  {
    title: "ادعمنا",
    link: "/support",
    id: 5,
  },
];
