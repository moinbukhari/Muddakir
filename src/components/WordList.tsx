import type { QuranicWord } from "./WordCard";
import WordCard from "./WordCard";

export default function WordList({
    list,
    learntList,
    currWord,
    onWordSelect,
  }: {
    list: QuranicWord[];
    learntList: QuranicWord[] | undefined;
    currWord: QuranicWord | null;
    onWordSelect: (word: QuranicWord) => void;
  }) {
    
    return(
        <ul className="flex flex-wrap gap-6 justify-center items-center">
            {list.map((word) => {
              return (
                <WordCard
              key={word.id}
              word={word}
              learntList= {learntList}
              currWord = {currWord}
              onClick={() => onWordSelect(word)}
            />
              );
            })}
          </ul>
    )


  }