import { Metadata } from "next";
import {
  RiCoinLine,
  RiFlashlightLine,
  RiDropLine,
  RiArrowUpSFill,
  RiArrowDownSFill,
  RiRefreshLine,
  RiGasStationLine,
  RiGovernmentLine,
} from "react-icons/ri";
import { getCommodities, type CommodityItem } from "@/lib/Data/commoditiesData";
import { generateStaticMetadata } from "@/lib/MetaData/generateStaticMetadata";

const title = "أسعار السلع";
const description = "تابع أسعار الذهب والفضة والنفط والوقود مقابل الجنيه المصري.";

export const metadata: Metadata = generateStaticMetadata({
  title,
  description,
  url: "/commodities",
});

const categoryConfig = {
  gold: {
    icon: RiCoinLine,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  silver: {
    icon: RiCoinLine,
    color: "text-muted-foreground",
    bg: "bg-muted",
    border: "border-border",
  },
  oil: {
    icon: RiDropLine,
    color: "text-primary-brand",
    bg: "bg-primary-brand/10",
    border: "border-primary-brand/20",
  },
  fuel: {
    icon: RiGasStationLine,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
};

function CommodityCard({ item }: { item: CommodityItem }) {
  const cfg = categoryConfig[item.category];
  const Icon = cfg.icon;
  const isUp = item.change >= 0;
  const isFuel = item.category === "fuel";

  return (
    <div className="bg-card border border-border rounded-3xl p-5 hover:border-primary-brand/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 space-y-4">
      {/* Top row: icon + change pill */}
      <div className="flex items-center justify-between">
        <div
          className={`w-10 h-10 rounded-2xl ${cfg.bg} border ${cfg.border} flex items-center justify-center ${cfg.color}`}
        >
          <Icon size={20} />
        </div>
        {isFuel ? (
          // Fuel prices are fixed by government — no % change
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-muted text-muted-foreground border border-border">
            <RiGovernmentLine size={11} />
            <span>سعر رسمي</span>
          </div>
        ) : (
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
              isUp
                ? "bg-green-500/10 text-green-500"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {isUp ? (
              <RiArrowUpSFill size={12} />
            ) : (
              <RiArrowDownSFill size={12} />
            )}
            <span dir="ltr">{Math.abs(item.change).toFixed(2)}%</span>
          </div>
        )}
      </div>

      {/* Name + symbol */}
      <div>
        <h3 className="font-black text-foreground text-sm leading-none mb-1">
          {item.nameAr}
        </h3>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {item.symbol} · {item.unit}
        </p>
      </div>

      {/* Prices */}
      <div className="space-y-1.5 pt-1 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-muted-foreground">
            بالجنيه
          </span>
          <span
            className="text-base font-black text-foreground tabular-nums"
            dir="ltr"
          >
            {item.priceEGP.toLocaleString()} ج.م
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-muted-foreground">
            بالدولار
          </span>
          <span
            className="text-xs font-bold text-muted-foreground tabular-nums"
            dir="ltr"
          >
            ${item.priceUSD.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  accentColor,
  title,
  badge,
}: {
  accentColor: string;
  title: string;
  badge: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`w-1 h-7 ${accentColor} rounded-full block shrink-0`} />
      <h2 className="text-xl font-black text-foreground">{title}</h2>
      <span className="text-xs font-black text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
        {badge}
      </span>
    </div>
  );
}

export default async function CommoditiesPage() {
  const commodities = await getCommodities();
  const now = new Date().toLocaleTimeString("ar-EG");

  const gold = commodities.filter((c) => c.category === "gold");
  const silver = commodities.filter((c) => c.category === "silver");
  const oil = commodities.filter((c) => c.category === "oil");
  const fuel = commodities.filter((c) => c.category === "fuel");

  const gold21 = gold.find((g) => g.id === "gold-21k");

  return (
    <main className="container mx-auto px-4 py-10 space-y-12" dir="rtl">
      {/* ── HEADER ── */}
      <div className="pb-8 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
              <RiCoinLine size={20} />
            </div>
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
              السلع والمعادن
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-2">
            أسعار السلع
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            أسعار الذهب والفضة والنفط والوقود مقابل الجنيه المصري.
          </p>
        </div>

        {/* Hero: Gold 21K pill */}
        {gold21 && (
          <div className="bg-card border border-border rounded-2xl px-6 py-4 shrink-0 space-y-1 h-fit">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              ذهب عيار 21 · الجرام
            </p>
            <p
              className="text-2xl font-black text-foreground tabular-nums"
              dir="ltr"
            >
              <span className="text-yellow-500">
                {gold21.priceEGP.toLocaleString()}
              </span>{" "}
              <span className="text-sm text-muted-foreground font-bold">
                ج.م
              </span>
            </p>
            <p
              className={`text-xs font-black flex items-center gap-1 ${
                gold21.change >= 0 ? "text-green-500" : "text-primary-brand"
              }`}
              dir="ltr"
            >
              {gold21.change >= 0 ? (
                <RiArrowUpSFill size={14} />
              ) : (
                <RiArrowDownSFill size={14} />
              )}
              {Math.abs(gold21.change).toFixed(2)}%
            </p>
          </div>
        )}
      </div>

      {/* ── GOLD ── */}
      <section className="space-y-5">
        <SectionHeader
          accentColor="bg-yellow-500"
          title="الذهب"
          badge="سعر الجرام"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gold.map((item) => (
            <CommodityCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* ── SILVER ── */}
      <section className="space-y-5">
        <SectionHeader
          accentColor="bg-muted-foreground/40"
          title="الفضة"
          badge="سعر الجرام"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {silver.map((item) => (
            <CommodityCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* ── OIL ── */}
      <section className="space-y-5">
        <SectionHeader
          accentColor="bg-primary-brand"
          title="النفط"
          badge="سعر البرميل"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {oil.map((item) => (
            <CommodityCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* ── FUEL ── */}
      <section className="space-y-5">
        <SectionHeader
          accentColor="bg-orange-500"
          title="الوقود"
          badge="سعر اللتر"
        />

        {/* Gov notice */}
        <div className="flex items-center gap-3 bg-orange-500/5 border border-orange-500/20 rounded-2xl px-5 py-3">
          <RiGovernmentLine size={16} className="text-orange-500 shrink-0" />
          <p className="text-xs font-bold text-orange-600 dark:text-orange-400">
            أسعار الوقود محددة بقرار لجنة التسعير المصرية · آخر تحديث: أغسطس
            2024
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {fuel.map((item) => (
            <CommodityCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* ── DISCLAIMER ── */}
      <div className="bg-card border border-border rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0 mt-0.5">
            <RiFlashlightLine size={18} />
          </div>
          <div>
            <p className="text-sm font-black text-foreground mb-1">
              مصادر البيانات
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              أسعار الذهب والفضة من{" "}
              <span className="font-bold text-foreground">
                metalpriceapi.com
              </span>{" "}
              · أسعار الصرف من{" "}
              <span className="font-bold text-foreground">open.er-api.com</span>{" "}
              · أسعار الوقود رسمية من لجنة التسعير المصرية · البيانات للأغراض
              الإعلامية فقط.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <RiRefreshLine size={11} className="text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground font-bold">
            آخر تحديث: {now}
          </span>
        </div>
      </div>
    </main>
  );
}
