interface ExchangeProps {
  first: string;
  second: string;
  num: string;
  slug: string;
}

export const ExchangeCard = ({ first, second, num, slug }: ExchangeProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-dlight/10 border border-slate-100 dark:border-dlight/20 rounded-2xl">
      <div className="flex flex-col">
        <span className="text-xs font-black text-primary uppercase">{first} / {second}</span>
        <span className="text-lg font-black text-slate-800 dark:text-white">{num}</span>
      </div>
      <div className="w-10 h-10 rounded-full bg-white dark:bg-dprimary flex items-center justify-center shadow-sm border border-slate-100 dark:border-dlight/20">
        <span className="text-[10px] font-bold">{first === "USD" ? "💵" : "💰"}</span>
      </div>
    </div>
  );
};