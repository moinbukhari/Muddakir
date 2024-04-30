export const Footer = () => {
  return (
    <footer className="py-3 md:px-4">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm leading-loose md:text-left md:text-base">
          Built by{" "}
          <a
            href="https://twitter.com/Moin4321"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-slate-700 underline underline-offset-4 hover:text-slate-950"
          >
            moin
          </a>
          . Any bugs or feature requests send{" "}
          <a
            href="https://twitter.com/moinbukh"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-slate-700 underline underline-offset-4 hover:text-slate-950"
          >
            here
          </a>
        </p>
      </div>
    </footer>
  );
};
