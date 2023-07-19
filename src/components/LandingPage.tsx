export default function LandingPage({setLandingPage}:{setLandingPage: (landing: boolean) => void;}) {
  const handleLanding = () => {
    setLandingPage(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="mx-8 my-12 flex max-w-screen-lg flex-col items-center justify-center gap-10 font-manrope">
        {/* <div className="flex flex-col gap-8 rounded-lg  bg-white p-5
      shadow-md ring ring-transparent hover:ring-rose-300"></div> */}

        <h1 className="text-center text-4xl font-extrabold leading-[1.1] text-slate-900 sm:text-7xl sm:leading-[1.1] md:text-7xl md:leading-[1.2]">
          Helping <span className="inline-block">Non-Arabic</span> Speakers
          Understand&nbsp;
          <span className="inline-block bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">
            The Quran
          </span>
        </h1>

        <div className="flex flex-col flex-wrap items-center gap-8">
          <div className="flex flex-col items-center gap-4 text-center font-manrope font-semibold sm:gap-8">
            <p className="text-xl leading-8 text-gray-600 sm:text-2xl sm:leading-8">
              Learn the most frequent words, improve retention with effective
              quizzes, and confidently translate Quranic passages
            </p>

            <p className="text-xl leading-8 text-gray-600 sm:text-2xl sm:leading-8 ">
              All to make those future recitations more meaningful
            </p>
          </div>

          <button className="btn-custom3" onClick={handleLanding}>
            <span className="text-lg font-semibold">Try Now</span>
          </button>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}
