import { motion } from "framer-motion";

export interface QuranicWord {
  id: number;
  arabic: string;
  transliteration: string;
  translation: string;
}



const WordCard = ({
    word,

    ...props
  }: {
    word: QuranicWord;
  } & Omit<React.ComponentPropsWithoutRef<"button">, "href">) => {

  return (
    <li>
      <button
        className="bg-slate-200 border-slate-400 hover:border-slate-600 hover:from-slate-500 hover:to-slate-300 focus-visible:border-slate-800  flex h-28 w-28 items-center justify-center overflow-hidden rounded-md border text-4xl font-medium hover:bg-gradient-to-b focus:outline-none focus-visible:border-2"
        {...props}
        >
        <motion.span
          className="bg-slate-400 absolute inset-0"
          style={{ originY: "bottom" }}
          initial={{ scaleY: 0 }}
          transition={{ type: "spring", damping: 20 }}
        />
        <span className="relative font-noton">{word.arabic}</span>
      </button>
    </li>
  );
};

export default WordCard;
