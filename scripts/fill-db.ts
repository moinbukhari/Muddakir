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
  { id: 1, arabic: "مِن", transliteration: "min", translation: "from" , frequency: 3226, wordType: "Preposition"  },
  { id: 2, arabic: "ٱللَّه", transliteration: "Allah", translation: "Allah (name of God)", frequency: 2699, wordType: "Proper noun" },
  { id: 3, arabic: "فِى", transliteration: "fi", translation: "in", frequency: 1701, wordType: "Preposition" },
  { id: 4, arabic: "إِنّ", transliteration: "inna", translation: "indeed", frequency: 1682, wordType: "Accusative particle" },
  { id: 5, arabic: "عَلَىٰ", transliteration: "ala", translation: "on", frequency: 1445, wordType: "Preposition" },
  { id: 6, arabic: "ٱلَّذِى", transliteration: "alladhi", translation: "the one who", frequency: 1442, wordType: "Relative pronoun" },
  { id: 7, arabic: "لَا", transliteration: "la", translation: "no/not", frequency: 2323, wordType: "Negative particle" },
  { id: 8, arabic: "مَا", transliteration: "ma", translation: "what", frequency: 1266, wordType: "Relative pronoun" },
  { id: 9, arabic: "رَبّ", transliteration: "Rabb", translation: "Lord", frequency: 975, wordType: "Noun" },
  { id: 10, arabic: "إِلَىٰ", transliteration: "ila", translation: "to", frequency: 742, wordType: "Preposition" },
  { id: 11, arabic: "مَن", transliteration: "man", translation: "who", frequency: 606, wordType: "Relative pronoun" },
  { id: 12, arabic: "إِن", transliteration: "in", translation: "if", frequency: 578, wordType: "Conditional particle" },
  { id: 13, arabic: "أَن", transliteration: "an", translation: "that", frequency: 578, wordType: "Subordinating conjunction" },
  { id: 14, arabic: "إِلَّا", transliteration: "illa", translation: "except", frequency: 660, wordType: "Restriction particle" },
  { id: 15, arabic: "ذَٰلِك", transliteration: "dhalika", translation: "that", frequency: 520, wordType: "Demonstrative pronoun" },
  { id: 16, arabic: "عَن", transliteration: "a'n", translation: "from/about", frequency: 465, wordType: "Preposition" },
  { id: 17, arabic: "أَرْض", transliteration: "ard", translation: "earth", frequency: 461, wordType: "Noun" },
  { id: 18, arabic: "قَد", transliteration: "qad", translation: "indeed/surely", frequency: 406, wordType: "Particle of certainty" },
  { id: 19, arabic: "إِذَا", transliteration: "itha", translation: "when", frequency: 405, wordType: "Time adverb" },
  { id: 20, arabic: "قَوْم", transliteration: "qawm", translation: "people", frequency: 383, wordType: "Noun" },
  { id: 21, arabic: "ءَايَة", transliteration: "ayah", translation: "sign/verse", frequency: 382, wordType: "Noun" },
  { id: 22, arabic: "أَنّ", transliteration: "anna", translation: "that", frequency: 362, wordType: "Accusative particle" },
  { id: 23, arabic: "كُلّ", transliteration: "kull", translation: "every/all", frequency: 358, wordType: "Noun" },
  { id: 24, arabic: "لَم", transliteration: "lam", translation: "not" , frequency: 353, wordType: "Negative particle" },
  { id: 25, arabic: "ثُمّ", transliteration: "thumma", translation: "then" , frequency: 338, wordType: "Coordinating conjunction" },
  { id: 26, arabic: "رَسُول", transliteration: "rasul", translation: "messenger" , frequency: 332, wordType: "Noun" },
  { id: 27, arabic: "مَا", transliteration: "ma", translation: "not", frequency: 704, wordType: "Negative particle"},
  { id: 28, arabic: "يَوْم", transliteration: "yawm", translation: "day" , frequency: 325, wordType: "Noun" },
  { id: 29, arabic: "عَذَاب", transliteration: "adhab", translation: "punishment" , frequency: 322, wordType: "Noun" },
  { id: 30, arabic: "هَٰذَا", transliteration: "hatha", translation: "this" , frequency: 317, wordType: "Demonstrative pronoun" },
  { id: 31, arabic: "سَمَآء", transliteration: "sama", translation: "sky/heaven" , frequency: 310, wordType: "Noun" },
  { id: 32, arabic: "نَفْس", transliteration: "nafs", translation: "soul" , frequency: 295, wordType: "Noun" },
  { id: 33, arabic: "شَىْء", transliteration: "shay", translation: "thing" , frequency: 283, wordType: "Noun" },
  { id: 34, arabic: "أَو", transliteration: "aw", translation: "or" , frequency: 280, wordType: "Coordinating conjunction" },
  { id: 35, arabic: "كِتَٰب", transliteration: "kitab", translation: "book" , frequency: 260, wordType: "Noun" },
  { id: 36, arabic: "بَيْن", transliteration: "bayna", translation: "between" , frequency: 243, wordType: "Location adverb" },
  { id: 37, arabic: "حَقّ", transliteration: "haqq", translation: "truth" , frequency: 242, wordType: "Noun" },
  { id: 38, arabic: "نَّاس", transliteration: "nas", translation: "people" , frequency: 241, wordType: "Noun" },
  { id: 39, arabic: "إِذ", transliteration: "idh", translation: "when" , frequency: 239, wordType: "Time adverb" },
  { id: 40, arabic: "أُولَٰٓئِك", transliteration: "ulaika", translation: "those" , frequency: 204, wordType: "Demonstrative pronoun" },
  { id: 41, arabic: "قَبْل", transliteration: "qabl", translation: "before" , frequency: 197, wordType: "Noun" },
  { id: 42, arabic: "مُؤْمِن", transliteration: "mu'min", translation: "believer" , frequency: 195, wordType: "Noun" },
  { id: 43, arabic: "لَو", transliteration: "law", translation: "if" , frequency: 184, wordType: "Conditional particle" },
  { id: 44, arabic: "مَن", transliteration: "man", translation: "who" , frequency: 184, wordType: "Conditional particle" },
  { id: 45, arabic: "سَبِيل", transliteration: "sabil", translation: "way" , frequency: 176, wordType: "Noun" },
  { id: 46, arabic: "أَمْر", transliteration: "amr", translation: "command, matter", frequency: 166, wordType: "Noun" },
  { id: 47, arabic: "عِند", transliteration: "ind", translation: "at, near, with", frequency: 160, wordType: "Location adverb" },
  { id: 48, arabic: "مَع", transliteration: "ma'a", translation: "with", frequency: 159, wordType: "Location adverb" },
  { id: 49, arabic: "بَعْض", transliteration: "ba'dh", translation: "some", frequency: 157, wordType: "Noun" },
  { id: 50, arabic: "لَمَّا", transliteration: "lamma", translation: "when", frequency: 156, wordType: "Time adverb" },
  { id: 51, arabic: "أَيُّهَا", transliteration: "ayyuha", translation: "O", frequency: 153, wordType: "Noun" },
  { id: 52, arabic: "خَيْر", transliteration: "khayr", translation: "good", frequency: 148, wordType: "Noun" },
  { id: 53, arabic: "إِلَٰه", transliteration: "ilah", translation: "god", frequency: 147, wordType: "Noun" },
  { id: 54, arabic: "نَار", transliteration: "nar", translation: "fire", frequency: 145, wordType: "Noun" },
  { id: 55, arabic: "غَيْر", transliteration: "ghayr", translation: "without", frequency: 144, wordType: "Noun" },
  { id: 56, arabic: "أَم", transliteration: "am", translation: "or", frequency: 137, wordType: "Coordinating conjunction" },
  { id: 57, arabic: "مُوسَىٰ", transliteration: "Musa", translation: "Moses", frequency: 136, wordType: "Proper noun" },
  { id: 58, arabic: "دُون", transliteration: "dun", translation: "other than, besides", frequency: 135, wordType: "Noun" },
  { id: 59, arabic: "آخِرَ", transliteration: "akhira", translation: "hereafter", frequency: 133, wordType: "Noun" },
  { id: 60, arabic: "بَعْد", transliteration: "ba'd", translation: "after", frequency: 133, wordType: "Noun" },
  { id: 61, arabic: "قَلْب", transliteration: "qalb", translation: "heart", frequency: 132, wordType: "Noun" },
  { id: 62, arabic: "عَبْد", transliteration: "abd", translation: "servant, worshipper", frequency: 131, wordType: "Noun" },
  { id: 63, arabic: "أَهْل", transliteration: "ahl", translation: "people, family", frequency: 127, wordType: "Noun" },
  { id: 64, arabic: "لَعَلّ", transliteration: "la'ala", translation: "perhaps", frequency: 123, wordType: "Accusative particle" },
  { id: 65, arabic: "بَل", transliteration: "bal", translation: "but rather", frequency: 122, wordType: "Retraction particle" },
  { id: 66, arabic: "يَد", transliteration: "yad", translation: "hand", frequency: 120, wordType: "Noun" },
  { id: 67, arabic: "كَٰفِرُون", transliteration: "kaafiroon", translation: "disbelievers", frequency: 119, wordType: "Noun" },
  { id: 68, arabic: "إِن", transliteration: "in", translation: "not/none", frequency: 114, wordType: "Negative particle" },
  { id: 69, arabic: "رَحْمَة", transliteration: "rahmah", translation: "mercy", frequency: 114, wordType: "Noun" },
  { id: 70, arabic: "رَّحِيم", transliteration: "raheem", translation: "merciful", frequency: 112, wordType: "Adjective" },
  { id: 71, arabic: "أَجْر", transliteration: "ajr", translation: "reward", frequency: 105, wordType: "Noun" },
  { id: 72, arabic: "ظَالِم", transliteration: "thaalim", translation: "oppressor", frequency: 105, wordType: "Noun" },
  { id: 73, arabic: "عِلْم", transliteration: "ilm", translation: "knowledge", frequency: 105, wordType: "Noun" },
  { id: 74, arabic: "عَظِيم", transliteration: "adheem", translation: "great", frequency: 104, wordType: "Adjective" },
  { id: 75, arabic: "لَن", transliteration: "lan", translation: "never", frequency: 104, wordType: "Negative particle" },
  { id: 76, arabic: "ذِكْر", transliteration: "dhikr", translation: "rememberance", frequency: 76, wordType: "Noun" },
  { id: 77, arabic: "عَلِيم", transliteration: "aleem", translation: "knowing", frequency: 101, wordType: "Adjective" },
  { id: 78, arabic: "جَنَّة", transliteration: "jannah", translation: "paradise", frequency: 96, wordType: "Noun" },
  { id: 79, arabic: "حَتَّىٰ", transliteration: "hatta", translation: "until", frequency: 95, wordType: "Preposition" },
  { id: 80, arabic: "هَل", transliteration: "hal", translation: "is/shall", frequency: 93, wordType: "Interrogative particle" },
  { id: 81, arabic: "دِين", transliteration: "deen", translation: "religion", frequency: 92, wordType: "Noun" },
  { id: 82, arabic: "قَوْل", transliteration: "qawl", translation: "words/saying", frequency: 92, wordType: "Noun" },
  { id: 83, arabic: "ذُو", transliteration: "dhu", translation: "owner of", frequency: 90, wordType: "Noun" },
  { id: 84, arabic: "مَلَك", transliteration: "malak", translation: "angel", frequency: 88, wordType: "Noun" },
  { id: 85, arabic: "مَال", transliteration: "maal", translation: "wealth" , frequency: 86, wordType: "Noun"  },
  { id: 86, arabic: "مَثَل", transliteration: "mathal", translation: "example" , frequency: 87, wordType: "Noun"  },
  { id: 87, arabic: "وَلِىّ", transliteration: "waliyy", translation: "guardian" , frequency: 86, wordType: "Noun"  },
  { id: 88, arabic: "هُدًى", transliteration: "huda", translation: "guidance" , frequency: 85, wordType: "Noun"  },
  { id: 89, arabic: "حَكِيم", transliteration: "hakeem", translation: "wise" , frequency: 84, wordType: "Adjective"  },
  { id: 90, arabic: "فَضْل", transliteration: "fadl", translation: "grace" , frequency: 84, wordType: "Noun"  },
  { id: 91, arabic: "صَلَوٰة", transliteration: "salah", translation: "prayer" , frequency: 83, wordType: "Noun"  },
  { id: 92, arabic: "لَيْل", transliteration: "layl", translation: "night" , frequency: 82, wordType: "Noun"  },
  { id: 93, arabic: "بُنَىّ", transliteration: "bunayy", translation: "child" , frequency: 80, wordType: "Noun"  },
  { id: 94, arabic: "شَيْطَٰن", transliteration: "shaytaan", translation: "Satan" , frequency: 80, wordType: "Proper noun"  },
  { id: 95, arabic: "كَيْفَ", transliteration: "kayfa", translation: "how" , frequency: 80, wordType: "Interrogative particle"  },
  { id: 96, arabic: "يَوْم", transliteration: "yawm", translation: "day" , frequency: 80, wordType: "Time adverb"  },
  { id: 97, arabic: "أَصْحَٰب", transliteration: "ashab", translation: "companions" , frequency: 78, wordType: "Noun"  },
  { id: 98, arabic: "أَكْثَرَ", transliteration: "akthara", translation: "most" , frequency: 78, wordType: "Noun"  },
  { id: 99, arabic: "جَهَنَّم", transliteration: "jahannam", translation: "Hell" , frequency: 77, wordType: "Proper Noun"  },
  { id: 100, arabic: "حَيَوٰة", transliteration: "hayah", translation: "life" , frequency: 76, wordType: "Noun"  },
];




const doBackfill = async () => {
  const formattedWords = quranicWords2.map((p) => ({
    id: p.id,
    arabic: p.arabic,
    translation: p.translation,
    transliteration: p.transliteration,
    frequency: p.frequency,
    wordType: p.wordType,
  }));

  // console.log("formattedData", formattedCuisine);

  const creation = await prisma.word.createMany({
    data: formattedWords,
  });

  console.log("Creation?", creation);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
doBackfill();

