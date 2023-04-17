"use client";

import type { QuranicWord } from "./WordCard";
import WordCard from "./WordCard";

export default function WordList({
    list,
    onWordSelect,
  }: {
    list: QuranicWord[];
    onWordSelect: (word: QuranicWord) => void;
  }) {
    
    return(
        <ul className="flex flex-wrap gap-6 justify-center items-center">
            {list.map((word) => {
              return (
                <WordCard
              key={word.id}
              word={word}
              onClick={() => onWordSelect(word)}
            />
              );
            })}
          </ul>
    )


  }