import { type NextPage } from "next";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuranicWord } from "../components/WordCard";
import WordList from "../components/WordList";
import WordSidebar from "../components/WordSidebar";
import Link from "next/link";
import { SignInButton, useUser, UserButton } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import { PageLayout } from "~/components/layout";
import type { Word } from "@prisma/client";
import { toast } from "react-hot-toast";

const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

const opt_button =
  "flex items-center justify-center p-4 cursor-pointer rounded-md";

function isWordInList(id: number, wordList: QuranicWord[]): boolean {
  for (let i = 0; i < wordList.length; i++) {
    if (wordList[i]?.id === id) {
      return true;
    }
  }
  return false;
}

// function getRandomWordIndex(words: Word[]): number {

//   return Math.floor(Math.random() * words.length);
// }

function getRandomWordList(words: Word[]): Word[] {
  const shuffled  = shuffleWords(words).slice(0, 5);
  console.log(shuffled);
  return shuffled;
}

function getRandomIncorrectAnswers(words: Word[], curr_word: Word): string[] {
  // Get all the translations except for the correct answer
  const translations = words
    .filter((word) => word.translation !== curr_word.translation)
    .map((word) => word.translation);
  // Shuffle the translations array
  const shuffledTranslations = shuffle(translations);
  // Return the first three elements of the shuffled array (i.e., three random incorrect answers)
  return shuffledTranslations.slice(0, 3);
}

function shuffle(a: string[]): string[] {
  const array = a.filter((word) => word !== undefined);

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]] as [string, string];
  }
  return array;
}

function shuffleWords(a: Word[]): Word[] {
  const array = a.filter((word) => word !== undefined);

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]] as [Word, Word];
  }
  return array;
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
        toast(`Unlearnt "${activeWord?.arabic}"`);
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
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState<Word>();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [randomWords, setRandomWords] = useState<Word[]>([]);
  const { user } = useUser();
  const userId = user?.id;
  const { data: userWords, isLoading: wordsLoading } =
    api.learn.userWords.useQuery({ userId: userId ?? "" });

  const handleNext = () => {
    if (selectedAnswer === currentWord?.translation) {
      setScore(score + 1);
    }
    setCurrentIndex(currentIndex + 1);
    setSelectedAnswer(null);
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
  };

  useEffect(() => {
    if (currentWord && userWords) {
      const wrongAnswers = getRandomIncorrectAnswers(userWords, currentWord);
      const opts = shuffle([...wrongAnswers, currentWord.translation]);
      setCurrentOptions(opts);
    }
  }, [currentWord, userWords]);

  useEffect(() => {
    if (userWords && currentIndex === 0) {
      const randUserWords = getRandomWordList(userWords);
      setRandomWords(randUserWords);
      //console.log(randomWords);
      //setCurrentWord(randUserWords[0]);
    } 
  }, [currentIndex, userWords]);

  useEffect(() => {
    if (randomWords.length>0 && currentIndex<randomWords.length) {
      console.log(randomWords);
      setCurrentWord(randomWords[currentIndex]);
      //setCurrentWord(randUserWords[0]);
    } 
  }, [currentIndex, randomWords]);
  

  // useEffect(() => {
  //   if (currentWord) {
  //     const wrongAnswers = getRandomIncorrectAnswers(userWords, currentWord);
  //   }
  // }, [userWords, currentWord]);

  if (wordsLoading)
    return (
      <div className="flex grow">
        <LoadingPage />
      </div>
    );

  if (userWords) {
    if (userWords.length < 5) {
      return <div className="mt-3 text-xl">Learn 5 words before taking the Quiz</div>;
    }

    if (currentIndex === 5) {
      return (
        <div className="mt-3 flex flex-col justify-center items-center text-center gap-2">
          <h1 className="text-xl">Quiz Complete!</h1>
          <p>
            Your score was {score} out of {5}
          </p>
        </div>
      );
    }
  }

  if (!userWords || !currentWord) {
    return (
      <div className="flex grow">
        <LoadingPage />
      </div>
    );
  }

  return (
    <div className="m-8 flex flex-col items-center justify-center gap-1 rounded">
      <div className="relative col-span-2 h-3 w-64 overflow-hidden rounded-full bg-slate-300">
        <motion.div
          className="absolute inset-0 bg-slate-800"
          style={{ originX: "left" }}
          animate={{ scaleX: currentIndex / 5 }}
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
              {currentWord.arabic}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center justify-center gap-4">
        <ul className="items grid grid-cols-2 gap-4 text-center ">
          {currentOptions.map((option) => (
            <li
              key={option}
              onClick={() => handleAnswer(option)}
              className={
                !!selectedAnswer
                  ? option === currentWord.translation
                    ? `${opt_button} bg-emerald-300   ${
                        selectedAnswer === option
                          ? "shadow-md ring-4 ring-emerald-600"
                          : ""
                      }`
                    : `${opt_button} bg-red-400  ${
                        selectedAnswer === option
                          ? "shadow-md ring-4 ring-red-600"
                          : ""
                      } `
                  : `${opt_button} bg-indigo-200 ring-2 ring-indigo-500 hover:bg-indigo-300 hover:shadow-md `
              }
            >
              {option}
            </li>
          ))}
        </ul>

        {!!selectedAnswer && (
          <button className="btn-gray" onClick={() => handleNext()}>
            {`${(currentIndex+1)<randomWords.length ? "Next": "Done" }`}
          </button>
        )}
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const [quiz, setQuiz] = useState(false);
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  api.learn.getAll.useQuery();
  api.learn.userWords.useQuery({ userId: user?.id ?? "" });

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
      <div className="flex flex-col items-center justify-center gap-4">
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

        {quiz && isSignedIn && <Quiz />}
        {quiz && !isSignedIn && (
          <div>
            <span>Sign in to use quiz feature</span>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Home;
