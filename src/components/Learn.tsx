import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/dialog";

import type { QuranicWord } from "../components/WordCard";
import WordList from "../components/WordList";
import WordSidebar from "../components/WordSidebar";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";

import { toast } from "react-hot-toast";
import quranIcon from "../../public/quran.png";
import Image from "next/image";
import Quiz from "./Quiz";
import MyModal from "./MyModal";

const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

function isWordInList(id: number, wordList: QuranicWord[]): boolean {
  for (let i = 0; i < wordList.length; i++) {
    if (wordList[i]?.id === id) {
      return true;
    }
  }
  return false;
}

export default function Learn() {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  const userId = user?.id;
  const ctx = api.useContext();
  const { data: allWords, isLoading: wordsLoading } =
    api.learn.getAll.useQuery();
  const [activeWord, setActiveWord] = useState<QuranicWord | null>(null);
  const [totalFreq, setTotalFreq] = useState(0);

  const [quiz, setQuiz] = useState(false);
  const totalQuranicWords = 77430;
  const { mutate } = api.learn.learn.useMutation({
    async onMutate(learnedWord) {
      await ctx.learn.userWords.cancel();

      const prevData = ctx.learn.userWords.getData({
        userId: learnedWord.learntById,
      });
      const word = allWords?.find((d) => d.id == learnedWord.wordLearntId);
      ctx.learn.userWords.setData(
        { userId: learnedWord.learntById },
        (prevData) => prevData && word && [...prevData, word]
      );

      return { prevData };
    },

    onSuccess: () => {
      if (activeWord) {
        toast.success(`Learnt "${activeWord?.translation}" in Arabic`);
      }
    },
    onError: () => {
      toast.error(`Failed! Try Again Later`);
    },

    onSettled: () => {
      void ctx.learn.userWords.invalidate();
    },
  });

  const { mutate: unlearn } = api.learn.unlearn.useMutation({
    async onMutate(unlearnWord) {
      await ctx.learn.userWords.cancel();

      const prevData = ctx.learn.userWords.getData({
        userId: unlearnWord.learntById,
      });
      console.log(prevData);
      const updatedData = prevData?.filter(
        (w) => w.id !== unlearnWord.wordLearntId
      );
      if (updatedData) {
        ctx.learn.userWords.setData({ userId: unlearnWord.learntById }, [
          ...updatedData,
        ]);
      }

      return { prevData };
    },

    onSuccess: () => {
      if (activeWord) {
        toast(`Unlearnt "${activeWord?.arabic}"`);
      }
    },
    onError: () => {
      toast.error(`Failed! Try Again Later`);
    },
    onSettled: () => {
      void ctx.learn.userWords.invalidate();
    },
  });

  const { data: userWords } = api.learn.userWords.useQuery(
    { userId: userId ?? "" },
    { enabled: !!userId }
  );

  const [wordIndex, setWordIndex] = useState(
    ((userWords ? Math.floor(userWords.length / 5) : 0) + 1) * 5
  );

  useEffect(() => {
    if (userWords) {
      setTotalFreq(userWords.reduce((accum, cur) => accum + cur.frequency, 0));
      setWordIndex(Math.ceil(userWords.length / 5) * 5);
    }
  }, [userWords]);

  function handleNewWords() {
    if (userWords?.length && userWords?.length < wordIndex) {
      toast(`You need to learn all ${wordIndex} words first.`, {
        icon: "🤨",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } else if (allWords && wordIndex < allWords?.length) {
      setQuiz(true);
      setWordIndex((i) => i + 5);
    }
  }

  if (!userLoaded) {
    return <div>Something went wrong 1</div>;
  }

  if (wordsLoading || (isSignedIn && !userWords))
    return (
      <div className="flex grow">
        <LoadingPage />
      </div>
    );

  if (!allWords) return <div>Something went wrong</div>;

  return (
    <div className="mx-10 flex w-full flex-col items-center justify-center gap-10">
      <div className="flex items-center justify-center gap-2">
        <div className="relative col-span-2 h-4 w-32 overflow-hidden  rounded-full bg-slate-300 lg:w-48">
          <motion.div
            className="absolute inset-0 bg-emerald-500"
            style={{ originX: "left" }}
            animate={{ scaleX: totalFreq / totalQuranicWords }}
            initial={{ scaleX: 0 }}
            transition={{ type: "spring", bounce: 0 }}
          />
        </div>

        <span className="text-center font-manrope font-semibold">
          {((totalFreq * 100) / totalQuranicWords).toFixed(1)}% of
        </span>

        <Popover>
          <PopoverTrigger>
            <Image src={quranIcon} width={32} height={32} alt="" />
          </PopoverTrigger>
          <PopoverContent>
            You have learnt{" "}
            <span className="font-semibold">
              {userWords ? userWords.length : 0}
            </span>{" "}
            words. These words make up about{" "}
            <span className="font-semibold">
              {((totalFreq * 100) / totalQuranicWords).toFixed(1)}%
            </span>{" "}
            of all the words in the Quran{" "}
          </PopoverContent>
        </Popover>

        {/* <span className="text-center font-manrope font-semibold">
            {((data.reduce((accum, cur) => accum + cur.frequency, 0)*100)/totalQuranicWords).toFixed(1)}%
          </span> */}
      </div>

      <div
        key={activeWord?.id}
        className={
          activeWord
            ? "item-center hidden max-w-screen-md lg:flex lg:-translate-x-1/4 2xl:max-w-screen-lg"
            : "item-center mx-8 flex max-w-screen-md 2xl:max-w-screen-lg"
        }
      >
        <WordList
          list={allWords}
          learntList={userWords}
          currWord={activeWord}
          onWordSelect={setActiveWord}
          wordIndex={wordIndex}
        />
      </div>

      <div
        className={
          activeWord
            ? "mx-8 hidden w-full max-w-screen-md lg:flex lg:-translate-x-1/4 lg:justify-center 2xl:max-w-screen-lg"
            : "mx-8 flex w-full max-w-screen-md justify-center 2xl:max-w-screen-lg"
        }
      >
        {wordIndex < allWords.length && (
          <button className={btn} onClick={handleNewWords}>
            Unlock More Words
          </button>
        )}

        {wordIndex >= allWords.length && (
          <button className={btn}>That{"'"}s All The Words For Now</button>
        )}
      </div>

      <MyModal open={quiz} onOpenChange={setQuiz}>
        <h1 className="mb-4 w-full text-center font-manrope text-3xl font-semibold">
          Progress Quiz
        </h1>
        <div className="h-full">
          <Quiz userWords={allWords.slice(0, wordIndex - 5)} />
        </div>
      </MyModal>

      <AnimatePresence mode="popLayout">
        {activeWord && (
          <div className="flex items-center justify-center lg:fixed lg:right-0 lg:top-24 lg:mr-10 lg:h-screen xl:mr-20 ">
            <div className="flex flex-col items-center justify-center gap-2">
              <WordSidebar
                word={activeWord}
                onClose={() => setActiveWord(null)}
              />
              {user &&
                userWords &&
                !isWordInList(activeWord?.id, userWords) && (
                  <button
                    className={btn}
                    onClick={() =>
                      mutate({
                        learntById: user.id,
                        wordLearntId: activeWord.id,
                      })
                    }
                  >
                    Mark As Learnt
                  </button>
                )}

              {user && userWords && isWordInList(activeWord?.id, userWords) && (
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-gray-300 bg-emerald-300 px-3 py-1.5 font-medium text-slate-800 shadow-sm ">
                    You Have Learnt This Word
                  </span>
                  <button
                    className={btn}
                    onClick={() =>
                      unlearn({
                        learntById: user.id,
                        wordLearntId: activeWord.id,
                      })
                    }
                  >
                    Mark As Unlearnt
                  </button>
                </div>
              )}

              {!user && (
                <div className="flex flex-col items-center justify-center gap-2">
                  <Link href={"/sign-in"}>
                    <span className="inline-flex items-center rounded-full border border-slate-400 bg-slate-300 px-3 py-1.5 font-medium text-slate-800 shadow-sm hover:bg-rose-400 ">
                      Sign In to Learn
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* <Dialog open={quiz} onOpenChange={setQuiz}>
        <DialogContent className="h-[600px]">
          <div className="flex flex-col gap-4">
            <h1 className="w-full text-center font-manrope text-3xl font-semibold">
              Progress Quiz
            </h1>
            <div className="h-full font-noton">
              {isSignedIn && userWords && <Quiz userWords={userWords} />}
              {!isSignedIn && (
                <Quiz userWords={allWords.slice(0, wordIndex - 5)} />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
