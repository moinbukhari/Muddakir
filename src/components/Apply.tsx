import { useState, useEffect } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
  type DraggableProvided,
} from "react-beautiful-dnd";

import { toast } from "react-hot-toast";

import {
  type Surah,
  type Verse,
  surahFatihah,
  surahNas,
  surahFalaq,
  surahIkhlas,
  surahMasad,
  surahNasr
} from "~/utils/surahs";

type AWord = {
  id: string;
  content: string;
};

function shuffleList(a: AWord[]): AWord[] {
  const array = a.filter((word) => word !== undefined);

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]] as [AWord, AWord];
  }
  return array;
}

function colourCurrentWord(arabicIndex:string, englishIndex:string ): boolean{
  if(arabicIndex===englishIndex){
    return true;
  }
  return false;
}

export default function Apply() {
  const [answeredCorr, setAnswerCorr] = useState(false);
  const [surahMenu, setSurahMenu] = useState(true);
  const [currVerse, setCurrVerse] = useState(0);
  const [verses, setVerses] = useState<Verse[]>(surahNas.verses);
  const [surahName, setSurahName] = useState("");

  const words = verses[currVerse]?.arabic;

  const eng_words = verses[currVerse]?.english;
  const arabic_order = verses[currVerse]?.arabic_order ?? [];

  const questions = shuffleList(eng_words ?? []);
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
      setQuestionRow([...sentence].sort(() => Math.random() - 0.5));
      setAnswerRow([] as AWord[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currVerse, verses]);

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
    setSurahMenu(true);
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

  const handleButtonClick = (surah: Surah) => {
    setSurahMenu(false);
    setSurahName(surah.name);
    setVerses(surah.verses);
  };


  if (surahMenu) {
    return (
      <div className="flex w-full flex-col items-center gap-4">
        <p className="p-3 text-center font-manrope text-3xl font-extrabold">
          Translate passages from The Quran
        </p>
        <div className="flex w-full flex-col items-center gap-4">
          <button
            onClick={() => handleButtonClick(surahFatihah)}
            className="h-fit w-5/6 rounded-lg bg-white px-5 py-5 text-center font-manrope text-2xl font-semibold shadow-md ring ring-transparent hover:ring-rose-300 md:w-4/6 lg:w-3/6"
          >
            {surahFatihah.name}
          </button>
          <button
            onClick={() => handleButtonClick(surahNas)}
            className="h-fit w-5/6 rounded-lg bg-white px-5 py-5 text-center font-manrope text-2xl font-semibold shadow-md ring ring-transparent hover:ring-rose-300 md:w-4/6 lg:w-3/6"
          >
            {surahNas.name}
          </button>
          <button
            onClick={() => handleButtonClick(surahFalaq)}
            className="h-fit w-5/6 rounded-lg bg-white px-5 py-5 text-center font-manrope text-2xl font-semibold shadow-md ring ring-transparent hover:ring-rose-300 md:w-4/6 lg:w-3/6"
          >
            {surahFalaq.name}
          </button>
          <button
            onClick={() => handleButtonClick(surahIkhlas)}
            className="h-fit w-5/6 rounded-lg bg-white px-5 py-5 text-center font-manrope text-2xl font-semibold shadow-md ring ring-transparent hover:ring-rose-300 md:w-4/6 lg:w-3/6"
          >
            {surahIkhlas.name}
          </button>
          <button
            onClick={() => handleButtonClick(surahMasad)}
            className="h-fit w-5/6 rounded-lg bg-white px-5 py-5 text-center font-manrope text-2xl font-semibold shadow-md ring ring-transparent hover:ring-rose-300 md:w-4/6 lg:w-3/6"
          >
            {surahMasad.name}
          </button>
          <button
            onClick={() => handleButtonClick(surahNasr)}
            className="h-fit w-5/6 rounded-lg bg-white px-5 py-5 text-center font-manrope text-2xl font-semibold shadow-md ring ring-transparent hover:ring-rose-300 md:w-4/6 lg:w-3/6"
          >
            {surahNasr.name}
          </button>
        </div>
      </div>
    );
  }
  if (currVerse === verses.length) {
    return (
      <div className="flex w-5/6 flex-col items-center gap-3 rounded-lg bg-white px-10 pb-10 pt-5 text-center shadow-md ring ring-transparent hover:ring-rose-300 lg:w-4/6 ">
        <p className="text-2xl">
          {" "}
          Congratulations you can now translate {surahName}!
        </p>
        {surahName === surahFatihah.name && (
          <p className="text-2xl">
            {" "}
            This Surah is recited a minimum of 17 times each day, just in the
            obligatory prayers.
          </p>
        )}
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
          {surahName}
        </p>
        <div className="flex flex-col flex-wrap items-center gap-8">
          <p className="mt-7 flex flex-row-reverse flex-wrap justify-center font-noton text-3xl leading-8 text-gray-600 sm:text-center md:text-6xl">
            {eng_words &&
              words?.map((word, index) => {
                const itemId = eng_words[answerRow.length]?.id ?? "-1";
                const wordPostion = arabic_order[index] ?? -1;
                let className = "text-gray-300";
                if (colourCurrentWord(index.toString(), itemId)) {
                  className = "text-rose-400";
                } else if (wordPostion < answerRow.length || eng_words.length === answerRow.length) {
            
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
}
