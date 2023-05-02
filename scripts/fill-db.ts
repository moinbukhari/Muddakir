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

const quranicWords2 = [
  { id: 1, arabic: "هَذَا", transliteration: "haza", translation: "this", frequency: 317 },
  { id: 2, arabic: "ذَٰلِكَ", transliteration: "dhalika", translation: "that", frequency: 520 },
  { id: 3, arabic: "مِن", transliteration: "min", translation: "from", frequency: 3226 },
  { id: 4, arabic: "ٱللَّه", transliteration: "Allah", translation: "Allah", frequency: 2699 },
  { id: 5, arabic: "فِى", transliteration: "fi", translation: "in", frequency: 1701 },
  { id: 6, arabic: "إِنّ", transliteration: "inna", translation: "verily", frequency: 1682 },
  { id: 7, arabic: "عَلَىٰ", transliteration: "ala", translation: "upon", frequency: 1445 },
  { id: 8, arabic: "ٱلَّذِى", transliteration: "alladhi", translation: "who", frequency: 1442 },
  { id: 9, arabic: "لَا", transliteration: "la", translation: "no", frequency: 1364 },
  { id: 10, arabic: "مَا", transliteration: "ma", translation: "what", frequency: 1266 },
  { id: 11, arabic: "رَبّ", transliteration: "rabb", translation: "Lord", frequency: 975 },
  { id: 12, arabic: "إِلَىٰ", transliteration: "ila", translation: "to", frequency: 742 },
  { id: 13, arabic: "مَا", transliteration: "ma", translation: "not", frequency: 704 },
  { id: 14, arabic: "مَن", transliteration: "man", translation: "whoever", frequency: 606 },
  { id: 15, arabic: "إِن", transliteration: "in", translation: "if", frequency: 578 },
  { id: 16, arabic: "أَن", transliteration: "an", translation: "that", frequency: 578 },
  { id: 17, arabic: "إِلَّا", transliteration: "illa", translation: "except", frequency: 558 },
  { id: 18, arabic: "عَن", transliteration: "an", translation: "about", frequency: 465 },
  { id: 19, arabic: "أَرْض", transliteration: "ard", translation: "earth", frequency: 461 },
  { id: 20, arabic: "قَد", transliteration: "qad", translation: "already", frequency: 406 },
  { id: 21, arabic: "إِذَا", transliteration: "itha", translation: "if", frequency: 405 },
  { id: 22, arabic: "قَوْم", transliteration: "qawm", translation: "people", frequency: 383 },
  { id: 23, arabic: "ءَايَة", transliteration: "ayah", translation: "sign", frequency: 382 },
  { id: 24, arabic: "أَنّ", transliteration: "anna", translation: "that", frequency: 362 },
  { id: 25, arabic: "كُلّ", transliteration: "kull", translation: "every", frequency: 358 },
  { id: 26, arabic: "لَم", transliteration: "lam", translation: "not", frequency: 353 },
  { id: 27, arabic: "ثُمّ", transliteration: "thumma", translation: "then", frequency: 338 },
  { id: 28, arabic: "رَسُول", transliteration: "rasul", translation: "messenger", frequency: 332 }
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
    data: formattedWords,
  });

  console.log("Creation?", creation);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
doBackfill();
