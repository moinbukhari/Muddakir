import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";

import type { Word } from "@prisma/client";

const opt_button =
  "flex items-center justify-center p-4 cursor-pointer rounded-md w-32";


function getRandomWordList(words: Word[]): Word[] {
  const shuffled = shuffleWords(words).slice(0, 5);
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

export default function Quiz({userWords}: {userWords: Word[]}){
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState<Word>();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [randomWords, setRandomWords] = useState<Word[]>([]);

  // const { user } = useUser();
  // const userId = user?.id;
  // const { data: userWords, isLoading: wordsLoading } =
  //   api.learn.userWords.useQuery({ userId: userId ?? "" });

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
    if (randomWords.length > 0 && currentIndex < randomWords.length) {
      setCurrentWord(randomWords[currentIndex]);
      //setCurrentWord(randUserWords[0]);
    }
  }, [currentIndex, randomWords]);

  // if (wordsLoading)
  //   return (
  //     <div className="flex grow">
  //       <LoadingPage />
  //     </div>
  //   );

  if (userWords) {
    if (userWords.length < 5) {
      return (
        <div className="mt-3 text-center text-2xl font-manrope">
          Learn 5 words before taking the Quiz
        </div>
      );
    }

    if (currentIndex === 5) {
      return (
        <div className="flex flex-col h-full items-center justify-center gap-5 text-center font-manrope">
          <h1 className="text-4xl">Quiz Complete!</h1>
          <p className="text-2xl">
            Your score was {score} out of {5}
          </p>
        </div>
      );
    }
  }

  if (!userWords && !currentWord) {
    return (
      <div className="flex grow">
        <LoadingPage />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded">
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
              {currentWord?.arabic}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center justify-center gap-4">
        <ul className="items grid grid-cols-2 gap-4 text-center">
          {currentOptions.map((option) => (
            <li
              key={option}
              onClick={() => handleAnswer(option)}
              className={
                !!selectedAnswer
                  ? option === currentWord?.translation
                    ? `${opt_button} bg-emerald-300   ${
                        selectedAnswer === option
                          ? "shadow-md ring-4 ring-emerald-600"
                          : ""
                      }`
                    : `${opt_button}   ${
                        selectedAnswer === option
                          ? "bg-red-300 shadow-md ring-4 ring-red-600"
                          : "bg-red-400"
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
            {`${currentIndex + 1 < randomWords.length ? "Next" : "Done"}`}
          </button>
        )}
      </div>
    </div>
  );
}
