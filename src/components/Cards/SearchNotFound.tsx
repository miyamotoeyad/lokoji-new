import { RiSearch2Line, RiQuestionLine } from "react-icons/ri";

export default function SearchNotFound() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-50 dark:bg-dlight/5 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-dlight/10">
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-white dark:bg-dprimary rounded-full flex items-center justify-center shadow-sm">
          <RiSearch2Line size={40} className="text-slate-300 dark:text-slate-600" />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white border-4 border-slate-50 dark:border-dlight/5">
          <RiQuestionLine size={16} />
        </div>
      </div>
      
      <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">
        لم نجد نتائج تطابق بحثك
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed text-sm">
        جرّب البحث بكلمات مختلفة أو تأكد من كتابة اسم السهم أو العملة بشكل صحيح.
      </p>
      
      <div className="mt-8 flex gap-3">
        <div className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-[10px] font-bold opacity-50 uppercase">
          EGX30
        </div>
        <div className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-[10px] font-bold opacity-50 uppercase">
          USD / EGP
        </div>
        <div className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-[10px] font-bold opacity-50 uppercase">
          Gold
        </div>
      </div>
    </div>
  );
}