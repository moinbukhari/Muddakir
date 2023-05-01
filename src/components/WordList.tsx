import type { QuranicWord } from "./WordCard";
import WordCard from "./WordCard";

export default function WordList({
    list,
    learntList,
    onWordSelect,
  }: {
    list: QuranicWord[];
    learntList: QuranicWord[] | undefined;
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
              onClick={() => onWordSelect(word)}
            />
              );
            })}
          </ul>
    )


  }