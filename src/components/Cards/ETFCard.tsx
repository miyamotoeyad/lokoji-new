interface ETFProps {
  title: string;
  change: string;
  point: string;
  slug: string;
  positive: boolean;
}

export const ETFCard = ({ title, change, point, slug, positive }: ETFProps) => {
  return (
    <div className="p-4 bg-white dark:bg-dprimary border-2 border-slate-50 dark:border-dlight/10 rounded-[2rem] flex flex-col justify-between min-h-35">
      <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
        {title}
      </h3>
      <div className="mt-4">
        <div className="text-lg font-black text-slate-900 dark:text-white mb-1">{point}</div>
        <div className={`text-xs font-bold inline-block px-2 py-1 rounded-lg ${
          positive 
          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" 
          : "bg-rose-50 text-rose-600 dark:bg-rose-500/10"
        }`}>
          {change}
        </div>
      </div>
    </div>
  );
};