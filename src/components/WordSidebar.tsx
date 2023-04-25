import type { QuranicWord } from "./WordCard";
import { motion } from "framer-motion";
import IconOnly from "./icon";

export default function WordSidebar({
  word,
  onClose,
}: {
  word: QuranicWord;
  onClose: () => void;
}) {
  return (
    <motion.div
      layout
      key={word.id}
      animate={{
        y: 0,
        opacity: 1,
      }}
      initial={{ y: 16, opacity: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className="sticky flex h-fit w-56 md:w-96 flex-col gap-4 rounded-lg border border-slate-400 bg-slate-200 p-8 pb-4"
    >
      <button
        className="absolute -right-3 -top-3 rounded-full border border-slate-700 bg-slate-500 p-2 shadow-md hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-slate-900"
        onClick={onClose}
      >
        <IconOnly type="incorrect" />
      </button>
      <div className="flex flex-col items-center justify-center rounded-lg border border-slate-500 bg-slate-300 py-10 px-5 font-noton text-[3rem] md:text-[7rem] font-medium shadow-lg">
        <div className="mt-4">{word.arabic}</div>
        <h2 className="text-center text-xl font-mono font-medium">{word.transliteration}</h2>
      </div>
      
      <h3 className="relative text-center font-manrope text-1xl md:text-2xl">
        <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-slate-600"></span>
        <span className="relative bg-slate-200 px-4 font-bold text-slate-700">
          Meaning
        </span>
      </h3>
      <h2 className="text-center text-1xl md:text-2xl font-manrope text-slate-700 font-medium">{word.translation}</h2>
    </motion.div>
  );
}
