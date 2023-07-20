import { type AppType } from "next/app";
import Head from "next/head";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { Noto_Naskh_Arabic, Manrope } from "next/font/google";
import { api } from "~/utils/api";
import { Toaster } from "react-hot-toast";

const noto_n = Noto_Naskh_Arabic({
  variable: "--font-noto-n",
  weight: "700",
  subsets: ["arabic"],
  display: "swap",
  adjustFontFallback: false,
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-manrope: ${manrope.variable};
            --font-noto-n: ${noto_n.variable};
          }
        `}
      </style>

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

        <main className={` ${noto_n.variable} ${manrope.variable}`}>
          <Toaster />
          <Component {...pageProps} />
          <Analytics />
        </main>
      </ClerkProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
