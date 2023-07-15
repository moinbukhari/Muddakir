import { type NextPage } from "next";
import { useState, useEffect } from "react";
import vocabGif from "../../assets/vocab.gif";
import quizGif from "../../assets/quiz.gif";
import applyGif from "../../assets/apply.gif";
import { Dialog, DialogContent, DialogHeader } from "../components/ui/dialog";

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
          <div>
            {!isSignedIn && (
              // <Link href="/sign-in" className="-m-1.5 flex p-1.5 text-center ">
              //   <span className="border-b-4 border-slate-400  hover:border-slate-600">
              //     Sign In
              //   </span>
              // </Link>
              <span className="border-b-4 border-slate-400  hover:border-slate-600">
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
          <Dialog defaultOpen={true} >
            <DialogContent className=" h-[450px] pb-3 overflow-hidden">
              <DialogHeader>
                <Tabs
                  defaultValue="vocab"
                  className="flex flex-col items-center justify-center gap-5"
                >
                  <TabsList>
                    <TabsTrigger value="vocab">Vocab</TabsTrigger>
                    <TabsTrigger value="quiz">Quiz</TabsTrigger>
                    <TabsTrigger value="apply">Apply</TabsTrigger>
                  </TabsList>
                  <TabsContent value="vocab">
                    <div className="flex flex-col items-center font-manrope">
                      The Vocab section is the place for you to learn the most
                      frequently occuring words in the Quran. The words are
                      arranged in descending order of frequency. Mark the words
                      you think you have learnt and you will be tested on those
                      in the Quiz.
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
                    <div className="flex flex-col items-center">
                      The Quiz section tests you on a portion of the words that
                      you have marked as learnt.
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
                    <div className="flex flex-col items-center">
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
                {/* <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription> */}
              </DialogHeader>
            </DialogContent>
          </Dialog>

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
