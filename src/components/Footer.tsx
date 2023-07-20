export const Footer = () => {
  return (
    <footer className="md:px-4 py-3">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm md:text-base leading-loose md:text-left">
          Built by{" "}
          <a
            href="https://twitter.com/Moin4321"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline text-slate-700 underline-offset-4 hover:text-slate-950"
          >
            moin
          </a>
          . Any bugs or feature requests send{" "}
          <a
            href="https://twitter.com/Moin4321"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline text-slate-700 underline-offset-4 hover:text-slate-950"
          >
            here
          </a> 
        </p>
      </div>
    </footer>
  );
};
