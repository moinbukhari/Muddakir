import { motion } from "framer-motion";

export interface QuranicWord {
  id: number;
  arabic: string;
  transliteration: string;
  translation: string;
  frequency: number;
  wordType: string;
}

function isWordInList(
  id: number,
  wordList: QuranicWord[] | undefined
): boolean {
  if (id && wordList) {
    for (let i = 0; i < wordList.length; i++) {
      if (wordList[i]?.id === id) {
        return true;
      }
    }
  }

  return false;
}

const WordCard = ({
  word,
  learntList,
  currWord,
  ...props
}: {
  word: QuranicWord;
  learntList: QuranicWord[] | undefined;
  currWord: QuranicWord | null;
} & Omit<React.ComponentPropsWithoutRef<"button">, "href">) => {
  return (
    <li>
      <button
        className={
          isWordInList(word.id, learntList)
            ? `flex h-28 w-28 items-center justify-center overflow-hidden  rounded-md border border-slate-400 bg-emerald-400 text-4xl font-medium hover:border-emerald-600 hover:bg-gradient-to-b hover:from-emerald-600 hover:to-emerald-300 focus:outline-none focus-visible:border-2 focus-visible:border-emerald-800 ${
                currWord?.id === word.id ? "shadow-md ring-4 ring-rose-400" : ""
              }`
            : `flex h-28 w-28 items-center justify-center overflow-hidden  rounded-md border border-slate-400 bg-slate-200 text-4xl font-medium hover:border-slate-500 hover:bg-gradient-to-b hover:from-slate-400 hover:to-slate-200 focus:outline-none focus-visible:border-2 focus-visible:border-slate-800 ${
                currWord?.id === word.id ? "shadow-md ring-4 ring-rose-400" : ""
              }`
        }
        {...props}
      >
        <motion.span
          className="absolute inset-0 bg-slate-400"
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
