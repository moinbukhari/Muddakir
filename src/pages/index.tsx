import { type NextPage } from "next";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import vocabModal from "../../assets/vocab.gif";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
  type DraggableProvided,
} from "react-beautiful-dnd";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";

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
import quranIcon from "../../public/quran.png";
import Image from "next/image";

type AWord = {
  id: string;
  content: string;
};

const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

const opt_button =
  "flex items-center justify-center p-4 cursor-pointer rounded-md w-32";

function isWordInList(id: number, wordList: QuranicWord[]): boolean {
  for (let i = 0; i < wordList.length; i++) {
    if (wordList[i]?.id === id) {
      return true;
    }
  }
  return false;
}

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

function shuffleList(a: AWord[]): AWord[] {
  const array = a.filter((word) => word !== undefined);

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]] as [AWord, AWord];
  }
  return array;
}

const WordFeed = () => {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  const userId = user?.id;
  const ctx = api.useContext();
  const { data, isLoading: wordsLoading } = api.learn.getAll.useQuery();
  const [activeWord, setActiveWord] = useState<QuranicWord | null>(null);
  const [totalFreq, setTotalFreq] = useState(0);
  const totalQuranicWords = 77430;
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

  useEffect(() => {
    if (userWords) {
      setTotalFreq(userWords.reduce((accum, cur) => accum + cur.frequency, 0));
    }
  }, [userWords]);

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
          <PopoverTrigger><Image src={quranIcon} width={32} height={32} alt="" /></PopoverTrigger>
          <PopoverContent>You have learnt <span className="font-semibold">{userWords ? userWords.length : 0}</span> words. These words make up about <span className="font-semibold">{((totalFreq * 100) / totalQuranicWords).toFixed(1)}%</span> of all the words in the Quran  </PopoverContent>
        </Popover>

        {/* <span className="text-center font-manrope font-semibold">
          {((data.reduce((accum, cur) => accum + cur.frequency, 0)*100)/totalQuranicWords).toFixed(1)}%
        </span> */}
      </div>

      <div
        key={activeWord?.id}
        className={
          activeWord
            ? "item-center hidden max-w-screen-md lg:flex lg:-translate-x-1/4 2xl:max-w-screen-lg "
            : "item-center mx-8 flex max-w-screen-md 2xl:max-w-screen-lg"
        }
      >
        <WordList
          list={data}
          learntList={userWords}
          currWord={activeWord}
          onWordSelect={setActiveWord}
        />
      </div>

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
    if (randomWords.length > 0 && currentIndex < randomWords.length) {
      setCurrentWord(randomWords[currentIndex]);
      //setCurrentWord(randUserWords[0]);
    }
  }, [currentIndex, randomWords]);

  if (wordsLoading)
    return (
      <div className="flex grow">
        <LoadingPage />
      </div>
    );

  if (userWords) {
    if (userWords.length < 5) {
      return (
        <div className="mt-3 text-center text-2xl">
          Learn 5 words before taking the Quiz
        </div>
      );
    }

    if (currentIndex === 5) {
      return (
        <div className="mt-14 flex flex-col items-center justify-center gap-5 text-center font-manrope">
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
};

const MockQuiz = () => {
  const unSignedInWords = [
    {
      id: 1,
      arabic: "مِن",
      transliteration: "min",
      translation: "from",
      frequency: 3226,
      wordType: "Preposition",
    },
    {
      id: 20,
      arabic: "قَوْم",
      transliteration: "qawm",
      translation: "people",
      frequency: 383,
      wordType: "Noun",
    },
    {
      id: 28,
      arabic: "يَوْم",
      transliteration: "yawm",
      translation: "day",
      frequency: 325,
      wordType: "Noun",
    },
    {
      id: 41,
      arabic: "قَبْل",
      transliteration: "qabl",
      translation: "before",
      frequency: 197,
      wordType: "Noun",
    },
    {
      id: 17,
      arabic: "أَرْض",
      transliteration: "ard",
      translation: "earth",
      frequency: 461,
      wordType: "Noun",
    },
    {
      id: 19,
      arabic: "إِذَا",
      transliteration: "itha",
      translation: "when",
      frequency: 405,
      wordType: "Time adverb",
    },
  ] as Word[];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState<Word>();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [randomWords, setRandomWords] = useState<Word[]>(unSignedInWords);

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
    if (currentWord) {
      const wrongAnswers = getRandomIncorrectAnswers(randomWords, currentWord);
      const opts = shuffle([...wrongAnswers, currentWord.translation]);
      setCurrentOptions(opts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWord]);

  useEffect(() => {
    if (currentIndex === 0) {
      const randUserWords = getRandomWordList(randomWords);
      setRandomWords(randUserWords);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  useEffect(() => {
    if (randomWords.length > 0 && currentIndex < randomWords.length) {
      setCurrentWord(randomWords[currentIndex]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  if (currentIndex === 5) {
    return (
      <div className="mt-14 flex flex-col items-center justify-center gap-5 text-center font-manrope">
        <h1 className="text-4xl">Quiz Complete!</h1>
        <p className="text-2xl">
          Your score was {score} out of {5}
        </p>

        <div className="flex flex-col items-center justify-center gap-2">
          <Link href={"/sign-in"}>
            <span className="btn-custom2">
              Sign In to Get Personalised Quizzes
            </span>
          </Link>
        </div>
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
};

const Apply = () => {
  const [answeredCorr, setAnswerCorr] = useState(false);
  const [chooseSurah, setChooseSurah] = useState(true);
  const [currVerse, setCurrVerse] = useState(0);
  const verses = [
    {
      arabic: ["بِسْمِ", "ٱللَّهِ", "ٱلرَّحْمَـٰنِ", "ٱلرَّحِيمِ"],
      english: [
        { id: "0", content: "In the Name" },
        { id: "1", content: "(of) Allah" },
        { id: "2", content: "the most compassionate" },
        { id: "3", content: "the most merciful" },
      ],
    },
    {
      arabic: ["ٱلْحَمْدُ", "لِلَّهِ", "رَبِّ", "ٱلْعَـٰلَمِينَ"],
      english: [
        { id: "0", content: "(All) Praise and gratitude" },
        { id: "1", content: "is for Allah" },
        { id: "2", content: "(the) Lord" },
        { id: "3", content: "of the Worlds" },
      ],
    },
    {
      arabic: ["ٱلرَّحْمَـٰنِ", "ٱلرَّحِيمِ"],
      english: [
        { id: "0", content: "the most compassionate" },
        { id: "1", content: "the most merciful" },
      ],
    },
    {
      arabic: ["مَـٰلِكِ", "يَوْمِ", "ٱلدِّينِ"],
      english: [
        { id: "0", content: "Master" },
        { id: "1", content: "of the Day" },
        { id: "2", content: "of Judgement" },
      ],
    },
    {
      arabic: ["إِيَّاكَ", "نَعْبُدُ", "وَ", "إِيَّاكَ", "نَسْتَعِينُ"],
      english: [
        { id: "0", content: "You alone" },
        { id: "1", content: "we worship" },
        { id: "2", content: "and" },
        { id: "3", content: "You alone" },
        { id: "4", content: "we ask for help" },
      ],
    },
    {
      arabic: ["ٱهْدِنَا", "ٱلصِّرَٰطَ", "ٱلْمُسْتَقِيمَ"],
      english: [
        { id: "0", content: "Guide us" },
        { id: "2", content: "(to) the straight" },
        { id: "1", content: "path" },
      ],
    },
    {
      arabic: [
        "صِرَٰطَ",
        "ٱلَّذِينَ",
        "أَنْعَمْتَ عَلَيْهِمْ",
        "غَيْرِ",
        "ٱلْمَغْضُوبِ عَلَيْهِمْ",
        "وَ",
        "لَا",
        "ٱلضَّآلِّينَ",
      ],
      english: [
        { id: "0", content: "(the) Path" },
        { id: "1", content: "of the ones who" },
        { id: "2", content: "you have blessed" },
        { id: "3", content: "not (of)" },
        { id: "4", content: "those you are disappointed with" },
        { id: "5", content: "and" },
        { id: "6", content: "not" },
        { id: "7", content: "those who have gone astray" },
      ],
    },
  ];

  const words = verses[currVerse]?.arabic;

  const items = verses[currVerse]?.english;

  const questions = shuffleList(items ?? []);
  const answers = [] as AWord[];
  const [questionRow, setQuestionRow] = useState(questions);
  const [answerRow, setAnswerRow] = useState(answers);

  const [winReady, setwinReady] = useState(false);
  useEffect(() => {
    setwinReady(true);
  }, []);
  useEffect(() => {
    const sentence = verses[currVerse]?.english;
    if (sentence) {
      setQuestionRow(sentence.sort(() => Math.random() - 0.5));
      setAnswerRow([] as AWord[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currVerse]);

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;

    const { source, destination } = result;

    if (
      (source.droppableId === "Answer" || source.droppableId === "Question") &&
      (destination.droppableId === "Answer" ||
        destination.droppableId === "Question")
    ) {
      if (source.droppableId !== destination.droppableId) {
        if (source.droppableId === "Question") {
          const sourceRow = [...questionRow];
          const destRow = [...answerRow];

          const [removed] = sourceRow.splice(source.index, 1);
          if (removed) {
            destRow.splice(destination.index, 0, removed);
          }
          setQuestionRow(sourceRow);
          setAnswerRow(destRow);
        } else {
          const sourceRow = [...answerRow];
          const destRow = [...questionRow];

          const [removed] = sourceRow.splice(source.index, 1);
          if (removed) {
            destRow.splice(destination.index, 0, removed);
          }
          setQuestionRow(destRow);
          setAnswerRow(sourceRow);
        }
      } else {
        if (source.droppableId === "Question") {
          const copiedRow = [...questionRow];
          const [removed] = copiedRow.splice(source.index, 1);
          if (removed) {
            copiedRow.splice(destination.index, 0, removed);
          }
          setQuestionRow(copiedRow);
        } else {
          const copiedRow = [...answerRow];
          const [removed] = copiedRow.splice(source.index, 1);
          if (removed) {
            copiedRow.splice(destination.index, 0, removed);
          }
          setAnswerRow(copiedRow);
        }
      }
    }
  }

  function handleItemClick(currentPosition: string, index: number) {
    if (currentPosition === "Question") {
      const sourceRow = [...questionRow];
      const destRow = [...answerRow];

      const [removed] = sourceRow.splice(index, 1);
      if (removed) {
        destRow.push(removed);
      }
      setQuestionRow(sourceRow);
      setAnswerRow(destRow);
    } else if (currentPosition === "Answer") {
      const sourceRow = [...answerRow];
      const destRow = [...questionRow];

      const [removed] = sourceRow.splice(index, 1);
      if (removed) {
        destRow.push(removed);
      }
      setQuestionRow(destRow);
      setAnswerRow(sourceRow);
    }
  }

  function handleCheck() {
    const res = answerRow.map((item) => item.content).join(" ");
    const answer = verses[currVerse]?.english
      .reduce((acc, curr) => {
        return acc + " " + curr.content;
      }, "")
      .trim();

    console.log("sentence is ", answer);
    console.log("res ", res);

    if (res === answer) {
      toast.success(`Correct🎉`);
      setAnswerCorr(true);
    } else {
      toast.error("Incorrect. Try Again");
    }
  }

  function handleNext() {
    setAnswerCorr(false);
    setCurrVerse(currVerse + 1);
  }

  function goBackToOpts() {
    setAnswerCorr(false);
    setCurrVerse(0);
    setChooseSurah(true);
  }

  function Option({
    item,
    provided,
  }: {
    item: AWord;
    provided: DraggableProvided;
  }) {
    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="inline-block h-10 w-fit rounded-lg bg-rose-100 px-4 py-2 shadow-lg"
        style={{
          userSelect: "none",
          ...provided.draggableProps.style,
        }}
      >
        {item.content}
      </div>
    );
  }

  if (chooseSurah) {
    return (
      <div className="flex w-full flex-col items-center gap-4">
        <p className="p-3 text-center font-manrope text-3xl font-extrabold">
          Translate passages from The Quran
        </p>
        <div className="flex w-full flex-col items-center gap-1">
          <button
            onClick={() => setChooseSurah(false)}
            className="h-fit w-5/6 rounded-lg bg-white px-5 py-5 text-center font-manrope text-2xl font-semibold shadow-md ring ring-transparent hover:ring-rose-300 md:w-4/6 lg:w-3/6"
          >
            Surah Al-Fatihah
          </button>
        </div>
      </div>
    );
  }
  if (currVerse === verses.length) {
    return (
      <div className="flex w-5/6 flex-col items-center gap-3 rounded-lg bg-white px-5 pb-10 pt-5 text-center shadow-md ring ring-transparent hover:ring-rose-300 lg:w-4/6">
        <p className="text-2xl">
          {" "}
          Congratulations you can now understand the meaning of Surah
          Al-Fatihah.
        </p>
        <p className="text-2xl">
          {" "}
          This Surah is recited a minimum of 17 times each day, just in the
          obligatory prayers.
        </p>
        <button className="btn-custom mt-5" onClick={() => goBackToOpts()}>
          Done
        </button>
      </div>
    );
  }
  return (
    <div className="flex w-full flex-col items-center gap-8 ">
      <div className="flex h-fit w-5/6 flex-col gap-1 rounded-lg bg-white  px-5 pb-10 pt-5 shadow-md ring ring-transparent hover:ring-rose-300 md:w-5/6 lg:w-4/6">
        <p className="text-center font-manrope text-xl font-bold text-gray-600 md:pb-5 md:text-4xl">
          Surah Al-Fatihah
        </p>
        <div className="flex flex-col flex-wrap items-center gap-8">
          <p className="mt-7 flex flex-row-reverse flex-wrap justify-center font-noton text-3xl leading-8 text-gray-600 sm:text-center md:text-6xl">
            {items &&
              words?.map((word, index) => {
                const itemId = items[index]?.id ?? -1;
                const answerLength = answerRow.length.toString() ?? "-1";
                console.log(answerLength);
                let className = "text-gray-300";
                if (
                  (answerLength === "-1" && index === 0) ||
                  itemId === answerLength
                ) {
                  className = "text-rose-400";
                } else if (itemId < answerLength) {
                  className = "text-gray-600";
                }

                return (
                  <span key={index} className={`${className} pb-3 md:pb-8`}>
                    {word}&nbsp;
                  </span>
                );
              })}
            <span className="pt-1 text-lg md:pt-3 md:text-4xl">{`(${String.fromCharCode(
              1632 + currVerse + 1
            )})`}</span>
          </p>
        </div>
        <DragDropContext onDragEnd={(result) => handleDragEnd(result)}>
          <div className="w-full ">
            <div className="">
              {winReady ? (
                <Droppable droppableId="Answer" direction="horizontal">
                  {(provided) => {
                    return (
                      <div
                        className="mb-2 flex w-full flex-wrap items-center gap-2 border-2 border-dotted py-4"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {answerRow.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided) => {
                                return (
                                  <div
                                    onClick={() =>
                                      handleItemClick("Answer", index)
                                    }
                                  >
                                    <Option item={item} provided={provided} />
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              ) : null}

              <hr className=" border-gray-300" />
              {/* <hr className=" border-gray-300" />
              <br />
              <hr className="mt-5 border-gray-300" /> */}
            </div>
            {winReady && questionRow.length != 0 ? (
              <Droppable droppableId="Question" direction="horizontal">
                {(provided) => {
                  return (
                    <div
                      className="mt-10 flex flex-wrap items-center gap-2"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {questionRow.map((item, index) => {
                        return (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided) => {
                              return (
                                <div
                                  onClick={() =>
                                    handleItemClick("Question", index)
                                  }
                                >
                                  <Option item={item} provided={provided} />
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            ) : null}
          </div>
        </DragDropContext>

        {answerRow.length === words?.length && (
          <div className="mt-10 flex justify-center md:mt-5">
            {!answeredCorr && (
              <button
                onClick={() => handleCheck()}
                className="rounded-lg bg-green-500 px-6 py-2 text-lg font-medium text-white shadow-lg  transition-all hover:bg-green-600 "
              >
                Check
              </button>
            )}
            {answeredCorr && (
              <button
                onClick={() => handleNext()}
                className="rounded-lg bg-green-500 px-6 py-2 text-lg font-medium text-white shadow-lg  transition-all hover:bg-green-600 "
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>

      {/* {!answeredCorr && (
            <button
              onClick={() => handleNext()}
              className="rounded-lg bg-[#58cc02] px-10 py-2 text-lg font-medium text-white shadow-lg  transition-all hover:bg-[#448d0d] "
            >
              Next
            </button>
          )} */}
    </div>
  );
};

const Home: NextPage = () => {
  const [opts, setOpts] = useState("vocab");
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  const [landingPage, setLandingPage] = useState(true);

  api.learn.getAll.useQuery();
  api.learn.userWords.useQuery({ userId: user?.id ?? "" });

  useEffect(() => {
    if (isSignedIn) {
      setLandingPage(false);
    }
  }, [isSignedIn]);

  if (!userLoaded && !landingPage) {
    return <LoadingPage />;
  }

  const handleQuiz = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpts(e.target.value);
  };

  const handleLanding = () => {
    setLandingPage(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHomePage = () => {
    setLandingPage(true);
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
            <Link
              href="/"
              className="-m-1.5 flex p-1.5 text-center"
              onClick={handleHomePage}
            >
              <span className="text-left font-manrope text-3xl font-bold ">
                Muddakir
              </span>
            </Link>
          </div>
          <div>
            {!isSignedIn && (
              // <Link href="/sign-in" className="-m-1.5 flex p-1.5 text-center ">
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
      {!landingPage && (
        <div className="flex flex-col items-center justify-center gap-8 pb-6">
          <div className="mt-3 flex flex-col items-center justify-center gap-8">
            <ul className="flex flex-wrap gap-4">
              <label className="cursor-pointer ">
                <input
                  type="radio"
                  name="option"
                  value="vocab"
                  className="peer sr-only"
                  onChange={handleQuiz}
                  checked={opts === "vocab"}
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
                  value="quiz"
                  className="peer sr-only"
                  onChange={handleQuiz}
                  checked={opts === "quiz"}
                />
                <div className="w-30 max-w-xl rounded-md bg-white p-5 text-gray-700 ring-2 ring-gray-200 hover:shadow-md peer-checked:bg-rose-300 peer-checked:ring-rose-500 peer-checked:ring-offset-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase text-gray-700">
                      Quiz
                    </p>
                  </div>
                </div>
              </label>
              <label className="cursor-pointer ">
                <input
                  type="radio"
                  name="option"
                  value="apply"
                  className="peer sr-only"
                  onChange={handleQuiz}
                  checked={opts === "apply"}
                />
                <div className="w-30 max-w-xl rounded-md bg-white p-5 text-gray-700 ring-2 ring-gray-200 hover:shadow-md peer-checked:bg-rose-300 peer-checked:ring-rose-500 peer-checked:ring-offset-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase">Apply</p>
                  </div>
                </div>
              </label>
            </ul>
          </div>
          <Dialog defaultOpen={true}>
            <DialogContent>
              <DialogHeader>
                <Tabs
                  defaultValue="vocab"
                  className="flex flex-col items-center justify-center gap-5"
                >
                  <TabsList>
                    <TabsTrigger value="vocab">Vocab</TabsTrigger>
                    <TabsTrigger value="quiz">Quiz</TabsTrigger>
                    <TabsTrigger value="apply">Apply</TabsTrigger>
                  </TabsList>
                  <TabsContent value="vocab">
                    The Vocab section is the place for you to learn the most
                    frequently occuring words in the Quran. The words are
                    arranged in descending order of frequency. Mark the words
                    you think you have learnt and you will be tested on those in
                    the Quiz.
                    <Image
                      src={vocabModal}
                      width={512}
                      height={512}
                      alt={"vocab demo"}
                      className="mt-5"
                    />
                  </TabsContent>
                  <TabsContent value="quiz">
                    The Quiz section tests you on a portion of the words that
                    you have marked as learnt.
                  </TabsContent>
                  <TabsContent value="apply">
                    The Apply section allows you to actively transalte passages
                    of the Quran ayah by ayah. This will include words you have
                    learnt as well as new words/phrases.
                  </TabsContent>
                </Tabs>
                {/* <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription> */}
              </DialogHeader>
            </DialogContent>
          </Dialog>

          {opts === "vocab" && <WordFeed />}

          {opts === "quiz" && isSignedIn && <Quiz />}
          {opts === "quiz" && !isSignedIn && <MockQuiz />}

          {opts === "apply" && <Apply />}
        </div>
      )}

      {landingPage && (
        <div className="flex w-full flex-col items-center justify-center">
          <div className="mx-8 my-12 flex max-w-screen-lg flex-col items-center justify-center gap-10 font-manrope">
            {/* <div className="flex flex-col gap-8 rounded-lg  bg-white p-5
      shadow-md ring ring-transparent hover:ring-rose-300"></div> */}

            <h1 className="text-center text-4xl font-extrabold leading-[1.1] text-slate-900 sm:text-7xl sm:leading-[1.1] md:text-7xl md:leading-[1.2]">
              Helping <span className="inline-block">Non-Arabic</span> Speakers
              Understand&nbsp;
              <span className="inline-block bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">
                The Quran
              </span>
            </h1>

            <div className="flex flex-col flex-wrap items-center gap-8">
              <div className="flex flex-col items-center gap-4 text-center font-manrope font-semibold sm:gap-8">
                <p className="text-xl leading-8 text-gray-600 sm:text-2xl sm:leading-8">
                  Learn the most frequent words, improve retention with
                  effective quizzes, and confidently translate Quranic passages
                </p>

                <p className="text-xl leading-8 text-gray-600 sm:text-2xl sm:leading-8 ">
                  All to make those future recitations more meaningful
                </p>
              </div>

              <button className="btn-custom2" onClick={handleLanding}>
                Try Now
              </button>
            </div>
            {/* </div> */}
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Home;
