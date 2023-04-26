import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="overflow-none h-screen w-screen">
        {props.children}
    </main>
  );
};