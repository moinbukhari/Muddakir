/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

const doBackfill = async () => {
    const formattedWords = quranicWords.map((p) => ({
        id: p.id,
        arabic: p.arabic,
        translation: p.translation,
        transliteration: p.transliteration,
    }));

    // console.log("formattedData", formattedCuisine);

    const creation = await prisma.word.createMany({
        data: formattedWords ,
    });

    console.log("Creation?", creation);
    
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
doBackfill();