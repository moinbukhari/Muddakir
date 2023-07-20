import { type NextPage } from "next";
import { useState, useEffect } from "react";
import vocabGif from "../../assets/vocab.gif";
import quizGif from "../../assets/quiz.gif";
import applyGif from "../../assets/apply.gif";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../components/ui/dialog";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

import Link from "next/link";
import { SignInButton, useUser, UserButton } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import { PageLayout } from "~/components/layout";

import Image from "next/image";
import Learn from "~/components/Learn";
import Quiz from "~/components/Quiz";
import MockQuiz from "~/components/MockQuiz";
import LandingPage from "~/components/LandingPage";
import Apply from "~/components/Apply";

const Home: NextPage = () => {
  const [opts, setOpts] = useState("vocab");
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  const [landingPage, setLandingPage] = useState(true);

  api.learn.getAll.useQuery();
  api.learn.userWords.useQuery({ userId: user?.id ?? "" });

  const handleOpts = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpts(e.target.value);
  };


  const handleHomePage = () => {
    setLandingPage(true);
  };

  useEffect(() => {
    if (isSignedIn) {
      setLandingPage(false);
    }
  }, [isSignedIn]);

  if (!userLoaded && !landingPage) {
    return <LoadingPage />;
  }

  return (
    <PageLayout>
      {/* nav */}
      <div className="mb-6 px-6 pt-6 lg:px-8">
        <nav
          className="flex h-9 items-center justify-between "
          aria-label="Global"
        >
          <div className="flex lg:min-w-0 lg:flex-1" aria-label="Global">
            <Link
              href="/"
              className="-m-1.5 flex p-1.5 text-center"
              onClick={handleHomePage}
            >
              <span className="text-left font-manrope text-3xl font-bold ">
                Muddakir
              </span>
            </Link>
          </div>
          <div className="flex gap-2 items-center justify-center">
            <Dialog defaultOpen={false}>
              <DialogTrigger className="pt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-8 w-8 text-slate-600 hover:text-slate-800"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </DialogTrigger>
              <DialogContent className=" h-[450px] sm:h-[530px] overflow-hidden pb-3">
                <DialogHeader>
                  <Tabs
                    defaultValue="vocab"
                    className="flex flex-col items-center justify-center gap-5"
                  >
                    <TabsList className="sm:text-xl">
                      <TabsTrigger value="vocab">Vocab</TabsTrigger>
                      <TabsTrigger value="quiz">Quiz</TabsTrigger>
                      <TabsTrigger value="apply">Apply</TabsTrigger>
                    </TabsList>
                    <TabsContent value="vocab">
                      <div className="flex flex-col items-center font-medium text-center text-base sm:text-xl">
                        The Vocab section is the place for you to learn the most
                        frequently occuring words in the Quran. The words are
                        arranged in descending order of frequency. Mark the
                        words you think you have learnt and you will be tested
                        on those in the Quiz.
                        <Image
                          src={vocabGif}
                          width={350}
                          height={350}
                          alt={"vocab demo"}
                          className="mt-5"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="quiz">
                      <div className="flex flex-col items-center font-medium text-center text-base sm:text-xl">
                        The Quiz section tests you on a portion of the words
                        that you have marked as learnt.
                        <Image
                          src={quizGif}
                          width={400}
                          height={400}
                          alt={"vocab demo"}
                          className="mt-5"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="apply">
                      <div className="flex flex-col items-center font-medium text-center text-base sm:text-xl">
                        The Apply section allows you to actively transalte
                        passages of the Quran ayah by ayah. This will include
                        words you have learnt as well as new words/phrases.
                        <Image
                          src={applyGif}
                          width={400}
                          height={400}
                          alt={"vocab demo"}
                          className="mt-5"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            {!isSignedIn && (
              // <Link href="/sign-in" className="-m-1.5 flex p-1.5 text-center ">
              //   <span className="border-b-4 border-slate-400  hover:border-slate-600">
              //     Sign In
              //   </span>
              // </Link>
              <span className="pt-3 border-b-4 border-slate-400  hover:border-slate-600">
                <SignInButton />
              </span>
            )}
            {isSignedIn && (
              <div className="flex flex-col items-center justify-center">
                <span className="font-manrope font-semibold">
                  Hi {user.firstName}
                </span>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: {
                        width: 48,
                        height: 48,
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* options */}
      {!landingPage && (
        <div className="flex flex-col items-center justify-center gap-8 pb-6">
          <div className="mt-3 flex flex-col items-center justify-center gap-8">
            <ul className="flex flex-wrap gap-4">
              <label className="cursor-pointer ">
                <input
                  type="radio"
                  name="option"
                  value="vocab"
                  className="peer sr-only"
                  onChange={handleOpts}
                  checked={opts === "vocab"}
                />
                <div className="w-30 max-w-xl rounded-md bg-white p-5 text-gray-700 ring-2 ring-gray-200 hover:shadow-md peer-checked:bg-rose-300 peer-checked:ring-rose-500 peer-checked:ring-offset-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase">Vocab</p>
                  </div>
                </div>
              </label>
              <label className="cursor-pointer ">
                <input
                  type="radio"
                  name="option"
                  value="quiz"
                  className="peer sr-only"
                  onChange={handleOpts}
                  checked={opts === "quiz"}
                />
                <div className="w-30 max-w-xl rounded-md bg-white p-5 text-gray-700 ring-2 ring-gray-200 hover:shadow-md peer-checked:bg-rose-300 peer-checked:ring-rose-500 peer-checked:ring-offset-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase text-gray-700">
                      Quiz
                    </p>
                  </div>
                </div>
              </label>
              <label className="cursor-pointer ">
                <input
                  type="radio"
                  name="option"
                  value="apply"
                  className="peer sr-only"
                  onChange={handleOpts}
                  checked={opts === "apply"}
                />
                <div className="w-30 max-w-xl rounded-md bg-white p-5 text-gray-700 ring-2 ring-gray-200 hover:shadow-md peer-checked:bg-rose-300 peer-checked:ring-rose-500 peer-checked:ring-offset-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase">Apply</p>
                  </div>
                </div>
              </label>
            </ul>
          </div>

          {opts === "vocab" && <Learn />}

          {opts === "quiz" && isSignedIn && <Quiz />}
          {opts === "quiz" && !isSignedIn && <MockQuiz />}

          {opts === "apply" && <Apply />}
        </div>
      )}
      {landingPage && <LandingPage setLandingPage={setLandingPage} />}

    </PageLayout>
  );
};

export default Home;
