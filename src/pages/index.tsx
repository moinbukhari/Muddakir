import { type NextPage } from "next";
import { useState, useEffect } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import type { QuranicWord } from "../components/WordCard";
import WordList from "../components/WordList";
import WordSidebar from "../components/WordSidebar";
import Link from "next/link";

const quranicWords = [
  { id: 1, arabic: "هَذَا", transliteration: "haza", translation: "this" },
  { id: 2, arabic: "ذَٰلِكَ", transliteration: "dhalika", translation: "that" },
  {
    id: 3,
    arabic: "هَذِهِ",
    transliteration: "hadhihi",
    translation: "this (feminine)",
  },
  {
    id: 4,
    arabic: "تِلْكَ",
    transliteration: "tilka",
    translation: "that (feminine)",
  },
  {
    id: 5,
    arabic: "أُولَٰئِكَ",
    transliteration: "ulā'ika",
    translation: "those",
  },
  {
    id: 6,
    arabic: "ٱلَّذِي",
    transliteration: "alladhī",
    translation: "the one who (masculine)",
  },
  {
    id: 7,
    arabic: "ٱلَّتِي",
    transliteration: "allatī",
    translation: "the one who (feminine)",
  },
  {
    id: 8,
    arabic: "ٱلَّذِينَ",
    transliteration: "alladhīna",
    translation: "those who (plural)",
  },
  { id: 9, arabic: "كُلُّ", transliteration: "kullu", translation: "every" },
  { id: 10, arabic: "لَنْ", transliteration: "lan", translation: "never" },
  { id: 11, arabic: "لَمْ", transliteration: "lam", translation: "not" },
  { id: 12, arabic: "مَا", transliteration: "mā", translation: "what" },
  { id: 13, arabic: "لَيْسَ", transliteration: "laysa", translation: "not" },
  {
    id: 14,
    arabic: "لَيْسَتْ",
    transliteration: "laysat",
    translation: "not (feminine)",
  },
  { id: 15, arabic: "بَلَى", transliteration: "balā", translation: "yes" },
  { id: 16, arabic: "غَيْر", transliteration: "ghayr", translation: "except" },
  {
    id: 17,
    arabic: "دُونَ",
    transliteration: "dūna",
    translation: "less than",
  },
  { id: 18, arabic: "إِلَّا", transliteration: "illā", translation: "except" },
  { id: 19, arabic: "نَعَمْ", transliteration: "naʿam", translation: "yes" },
];

const Home: NextPage = () => {
  // array of the 30 most common Quranic Arabic words

  const [activeWord, setActiveWord] = useState<QuranicWord | null>(null);

  // const [learnedWords, setLearnedWords] = useState<QuranicWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quiz, setQuiz] = useState(false);

  // const handleLearnedWord = (id: number) => {
  //   const learnedWord = quranicWords.find(
  //     (word) => word.id === id
  //   ) as QuranicWord;
  //   if (learnedWord)
  //     setLearnedWords((prevWords) => [...prevWords, learnedWord]);
  // };

  const handleNext = () => {
    if (currentIndex >= quranicWords.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const handleQuiz = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isTrueSet = e.target.value === "true";
    setQuiz(isTrueSet);
  };

  useEffect(() => {
    console.log(activeWord);
  }, [activeWord]);

  return (
    <>
      <Head>
        <title>Muddakir</title>
        <meta name="description" content="created by Moin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" h-screen w-screen ">
        <div className="mb-6 px-6 pt-6 lg:px-8">
          <div>
            <nav
              className="flex h-9 items-center justify-between"
              aria-label="Global"
            >
              <div className="flex lg:min-w-0 lg:flex-1" aria-label="Global">
                <Link href="/" className="-m-1.5 flex p-1.5 text-center ">
                  <span className="text-left font-manrope text-3xl font-bold ">
                    Muddakir
                  </span>
                </Link>
              </div>
              {/* <button
                className="w-32 rounded border border-yellow-500 bg-transparent px-4 py-2 text-xs font-semibold text-yellow-700 hover:border-transparent hover:bg-yellow-500 hover:text-white sm:w-max sm:text-base"
              >
                Buy me a Protein Shake 🥤
              </button> */}
            </nav>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-8">
          <ul className="flex flex-wrap gap-4">
            <label className="cursor-pointer ">
              <input
                type="radio"
                name="option"
                value="false"
                className="peer sr-only"
                onChange={handleQuiz}
                checked={quiz === false}
              />
              <div className="w-30 max-w-xl rounded-md bg-white p-5 text-gray-700 ring-2 ring-gray-200 hover:shadow-md peer-checked:bg-rose-300 peer-checked:ring-rose-500 peer-checked:ring-offset-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase">Vocab</p>
                </div>
              </div>
            </label>
            <label className="cursor-pointer ">
              <input
                type="radio"
                name="option"
                value="true"
                className="peer sr-only"
                onChange={handleQuiz}
                checked={quiz === true}
              />
              <div className="w-30 max-w-xl rounded-md bg-white p-5 text-gray-700 ring-2 ring-gray-200 hover:shadow-md peer-checked:bg-rose-300 peer-checked:ring-rose-500 peer-checked:ring-offset-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase text-gray-700">
                    Quiz
                  </p>
                </div>
              </div>
            </label>
          </ul>
        </div>

        {quiz && (
          <div className="m-8 flex flex-col items-center justify-center gap-2 rounded">
            <div className="relative col-span-2 h-3 w-64 overflow-hidden rounded-full bg-slate-300">
              <motion.div
                className="absolute inset-0 bg-slate-800"
                style={{ originX: "left" }}
                animate={{ scaleX: currentIndex / quranicWords.length }}
                initial={{ scaleX: 0 }}
                transition={{ type: "spring", bounce: 0 }}
              />
            </div>

            <div className="flex h-64 w-64 items-center justify-center rounded border border-slate-500 bg-slate-300 px-8 py-10">
              <div className="relative mt-1 flex h-full w-full items-center overflow-hidden text-center font-noton text-7xl ">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={currentIndex}
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    exit={{ x: 300 }}
                    transition={{ duration: 0.8 }}
                    className="w-full text-center"
                  >
                    {quranicWords.at(currentIndex)?.arabic}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <button className="btn-gray" onClick={() => handleNext()}>
              Next
            </button>
          </div>
        )}

        {!quiz && (
          <div className="mt-10 flex flex-col items-center justify-center gap-20 md:flex-row md:gap-10 md:pr-10">
            {/* {!activeWord && (
              <AnimatePresence mode="popLayout">
                <motion.div
                  layout
                  className="item-center flex max-w-screen-md flex-wrap items-center justify-center px-10"
                >
                  <WordList list={quranicWords} onWordSelect={setActiveWord} />
                </motion.div>
              </AnimatePresence>
            )} */}
            {/* <AnimatePresence mode="popLayout"> */}
              <div
                className={
                  activeWord
                    ? "item-center hidden max-w-screen-md flex-wrap items-center justify-center px-10 lg:flex"
                    : "item-center flex max-w-screen-md flex-wrap items-center justify-center px-10"
                }
              >
                <WordList list={quranicWords} onWordSelect={setActiveWord} />
              </div>
            {/* </AnimatePresence> */}

            <AnimatePresence mode="popLayout">
              {activeWord && (
                <WordSidebar
                  word={activeWord}
                  onClose={() => setActiveWord(null)}
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
