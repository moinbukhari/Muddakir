import type { QuranicWord } from "./WordCard";
import WordCard from "./WordCard";

import { motion } from "framer-motion";
import { IconOnly } from "./icon";

export default function WordSidebar({
  word,
  onClose,
}: {
  word: QuranicWord;
  onClose: () => void;
}) {
  return (
    <motion.aside
      key={word.id}
      animate={{
        y: 0,
        opacity: 1,
      }}
      initial={{ y: 16, opacity: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className="sticky -top-8 flex h-fit max-h-[calc(100vh_-_192px)] w-[350px] flex-col gap-4 rounded-lg border border-slate-400 bg-slate-200 p-8 pb-4"
    >
      <button
        className="absolute -right-3 -top-3 rounded-full border border-slate-700 bg-slate-500 p-2 shadow-md hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-slate-900"
        onClick={onClose}
      >
        <IconOnly type="incorrect" />
      </button>
      <div className="flex items-center justify-center rounded-lg border border-slate-500 bg-slate-300 py-10 font-noton text-[8rem] font-medium shadow-lg">
        <div className="mt-4">{word.arabic}</div>
      </div>
      <h2 className="text-center text-xl font-bold">{word.transliteration}</h2>
      <h3 className="relative text-center font-manrope text-lg">
        <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-slate-600"></span>
        <span className="relative bg-slate-200 px-4 text-slate-700">
          Meaning
        </span>
      </h3>
      <h2 className="text-center text-3xl font-semibold">{word.translation}</h2>
    </motion.aside>
  );
}
