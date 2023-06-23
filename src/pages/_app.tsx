import { type AppType } from "next/app";
import Head from "next/head";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import {
  Amiri_Quran,
  Noto_Sans_Arabic,
  Noto_Naskh_Arabic,
  Mirza,
  Manrope,
} from "next/font/google";
// import localFont from 'next/font/local';
import { api } from "~/utils/api";
import { Toaster } from "react-hot-toast";

import "~/styles/globals.css";

// const uthman = localFont({
//   variable: '--font-uthman',
//   src: 'https://cdn.rawgit.com/mustafa0x/qpc-fonts/f93bf5f3/various-woff2/UthmanicHafs1%20Ver09.woff2',
//   display: 'swap'
// });

const amiri = Amiri_Quran({
  variable: "--font-amiri",
  weight: "400",
  subsets: ["arabic"],
  display: "swap",
});

const noto_s = Noto_Sans_Arabic({
  variable: "--font-noto-s",
  weight: "700",
  subsets: ["arabic"],
  display: "swap",
});

const noto_n = Noto_Naskh_Arabic({
  variable: "--font-noto-n",
  weight: "700",
  subsets: ["arabic"],
  display: "swap",
});

const mirza = Mirza({
  variable: "--font-mirza",
  weight: "700",
  subsets: ["arabic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <meta httpEquiv="Content-Type" content="text/html charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Master the most common Quranic words, enhance your memory with tailored tests, and effortlessly translate passages of the Quran."
        />
        <meta
          name="keywords"
          content="Quran, Quranic vocabulary, learn Quran, Islamic studies, translation, essential words, language learning, study Quran"
        />
        <meta
          property="og:title"
          content="Muddakir: Helping non-arabic speakers understand the Quran"
          key="title"
        />
        <meta
          property="og:description"
          content="Learn the most frequent words, improve retention with effective quizzes, and confidently translate Quranic passages"
          key="description"
        />
        <meta property="og:image" content="/favicon.ico" />
        <meta name="author" content="Moin Bukhari" />

        <title>
          Muddakir: Helping Non-Arabic Speakers Understand The Quran
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        className={`${amiri.variable} ${noto_s.variable} ${noto_n.variable} ${mirza.variable} ${manrope.variable}`}
      >
        <Toaster />
        <Component {...pageProps} />
        <Analytics />
      </main>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
