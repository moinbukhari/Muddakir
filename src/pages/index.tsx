import { type NextPage } from "next";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuranicWord } from "../components/WordCard";
import WordList from "../components/WordList";
import WordSidebar from "../components/WordSidebar";
import Link from "next/link";
import { SignInButton, useUser, UserButton } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import { PageLayout } from "~/components/layout";
//import type { Word } from "@prisma/client";
import { toast } from "react-hot-toast";

const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

// type QuizProps = {
//   words: Word[];
// };
function isWordInList(id: number, wordList: QuranicWord[]): boolean {
  for (let i = 0; i < wordList.length; i++) {
    if (wordList[i]?.id === id) {
      return true;
    }
  }
  return false;
}

const WordFeed = () => {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  const userId = user?.id;
  const ctx = api.useContext();
  const { data, isLoading: wordsLoading } = api.learn.getAll.useQuery();
  const [activeWord, setActiveWord] = useState<QuranicWord | null>(null);
  const { mutate } = api.learn.learn.useMutation({
    onSuccess: () => {
      if (activeWord) {
        toast.success(`Learnt "${activeWord?.translation}" in Arabic`);
      }
      void ctx.learn.userWords.invalidate();
    },
    onError: () => {
      toast.error(`Failed! Try Again Later`);
    },
  });

  const { mutate: unlearn } = api.learn.unlearn.useMutation({
    onSuccess: () => {
      if (activeWord) {
        toast(`Unlearnt "${activeWord?.translation}" in Arabic`);
      }
      void ctx.learn.userWords.invalidate();
    },
    onError: () => {
      toast.error(`Failed! Try Again Later`);
    },
  });
  const { data: userWords } = api.learn.userWords.useQuery(
    { userId: userId ?? "" },
    { enabled: !!userId }
  );

  if (!userLoaded) {
    return <div>Something went wrong 1</div>;
  }

  console.log(userWords);
  if (wordsLoading || (isSignedIn && !userWords))
    return (
      <div className="flex grow">
        <LoadingPage />
      </div>
    );

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-20 lg:mr-5 lg:flex-row lg:gap-10">
      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          key={activeWord?.id}
          animate={{
            opacity: 1,
          }}
          initial={{ y: 16, opacity: 0 }}
          transition={{ type: "spring", damping: 30 }}
          className={
            activeWord
              ? "item-center hidden max-w-screen-md lg:flex"
              : "item-center flex max-w-screen-md"
          }
        >
          <WordList
            list={data}
            learntList={userWords}
            onWordSelect={setActiveWord}
          />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {activeWord && (
          <div className="flex flex-col items-center justify-center gap-2">
            <WordSidebar
              word={activeWord}
              onClose={() => setActiveWord(null)}
            />
            {user && userWords && !isWordInList(activeWord?.id, userWords) && (
              <button
                className={btn}
                onClick={() =>
                  mutate({ learntById: user.id, wordLearntId: activeWord.id })
                }
              >
                Learn Word
              </button>
            )}

            {user && userWords && isWordInList(activeWord?.id, userWords) && (
              <div className="flex flex-col gap-2 items-center justify-center">
                <span className="inline-flex items-center rounded-full border border-gray-300 bg-emerald-300 px-3 py-1.5 font-medium text-slate-800 shadow-sm ">
                  You Have Learnt This Word
                </span>
                <button
                  className={btn}
                  onClick={() =>
                    unlearn({ learntById: user.id, wordLearntId: activeWord.id })
                  }
                >
                  Unlearn Word
                </button>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Quiz = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data, isLoading: wordsLoading } = api.learn.getAll.useQuery();
  const words = data;

  if (wordsLoading)
    return (
      <div className="flex grow">
        <LoadingPage />
      </div>
    );
  if (!words) return <div>Something went wrong</div>;

  const handleNext = () => {
    if (currentIndex >= words.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="m-8 flex flex-col items-center justify-center gap-2 rounded">
      <div className="relative col-span-2 h-3 w-64 overflow-hidden rounded-full bg-slate-300">
        <motion.div
          className="absolute inset-0 bg-slate-800"
          style={{ originX: "left" }}
          animate={{ scaleX: currentIndex / words.length }}
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
              {words.at(currentIndex)?.arabic}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <button className="btn-gray" onClick={() => handleNext()}>
        Next
      </button>
    </div>
  );
};

const Home: NextPage = () => {
  const [quiz, setQuiz] = useState(false);

  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  api.learn.getAll.useQuery();

  if (!userLoaded) {
    return <LoadingPage />;
  }
  // const firstCuisine = api.learn.hasUserLearnt.useQuery({
  //   userId: "user_2OsognTRdyKnF8fkuX2kXzHyU6r",
  //   wordId: activeWord.id,
  // });
  // console.log(firstCuisine.data);

  const handleQuiz = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isTrueSet = e.target.value === "true";
    setQuiz(isTrueSet);
  };

  return (
    <PageLayout>
      {/* nav */}
      <div className="mb-6 px-6 pt-6 lg:px-8">
        <nav
          className="flex h-9 items-center justify-between "
          aria-label="Global"
        >
          <div className="flex lg:min-w-0 lg:flex-1" aria-label="Global">
            <Link href="/" className="-m-1.5 flex p-1.5 text-center ">
              <span className="text-left font-manrope text-3xl font-bold ">
                Muddakir
              </span>
            </Link>
          </div>
          <div>
            {!isSignedIn && (
              // <Link href="/sign-up" className="-m-1.5 flex p-1.5 text-center ">
              //   <span className="border-b-4 border-slate-400  hover:border-slate-600">
              //     Sign In
              //   </span>
              // </Link>
              <span className="border-b-4 border-slate-400  hover:border-slate-600">
                <SignInButton />
              </span>
            )}
            {isSignedIn && (
              <div className="flex flex-col items-center justify-center">
                <span className="font-manrope font-semibold">
                  Hi {user.firstName}
                </span>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: {
                        width: 48,
                        height: 48,
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* options */}
      <div className="mt-3 flex flex-col items-center justify-center gap-8">
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

      {!quiz && <WordFeed />}

      {quiz && <Quiz />}
    </PageLayout>
  );
};

export default Home;
