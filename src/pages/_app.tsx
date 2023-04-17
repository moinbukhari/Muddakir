import { type AppType } from "next/app";
import {Amiri_Quran, Noto_Sans_Arabic, Noto_Naskh_Arabic, Mirza, Manrope} from 'next/font/google';
// import localFont from 'next/font/local';
import { api } from "~/utils/api";

import "~/styles/globals.css";

// const uthman = localFont({
//   variable: '--font-uthman',
//   src: 'https://cdn.rawgit.com/mustafa0x/qpc-fonts/f93bf5f3/various-woff2/UthmanicHafs1%20Ver09.woff2',
//   display: 'swap'
// });

const amiri = Amiri_Quran({
  variable: '--font-amiri',
  weight: '400',
  subsets: ["arabic"],
  display: 'swap'
});

const noto_s = Noto_Sans_Arabic({
  variable: '--font-noto-s',
  weight: '700',
  subsets: ["arabic"],
  display: 'swap'
});

const noto_n = Noto_Naskh_Arabic({
  variable: '--font-noto-n',
  weight: '700',
  subsets: ["arabic"],
  display: 'swap'
});

const mirza = Mirza({
  variable: '--font-mirza',
  weight: '700',
  subsets: ["arabic"],
  display: 'swap'
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets:["latin"],
  display: 'swap'
});


const MyApp: AppType = ({ Component, pageProps }) => {
  return (
  <main className={`${amiri.variable} ${noto_s.variable} ${noto_n.variable} ${mirza.variable} ${manrope.variable}`}>
    <Component {...pageProps} />
  </main>
  
  
  
  );
};

export default api.withTRPC(MyApp);
