import type { PropsWithChildren } from "react";

import { Footer } from "./Footer";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="overflow-none min-h-screen w-screen">
      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1">{props.children}</div>

        <Footer />
      </div>
    </main>
  );
};
