import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { PageLayout } from "~/components/layout";

export default function Page() {
  return (
    <PageLayout>
      <div className="mb-6 px-6 pt-6 lg:px-8">
        <nav
          className="flex h-9 items-center justify-between "
          aria-label="Global"
        >
          <div className="flex lg:min-w-0 lg:flex-1" aria-label="Global">
            <Link href="/" className="-m-1.5 flex p-1.5 text-center ">
              <span className="text-left font-manrope text-3xl font-bold ">
                Muddakir
              </span>
            </Link>
          </div>
        </nav>
      </div>
      <div className="flex flex-col justify-center items-center">
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" redirectUrl="/"/>
      </div>
    </PageLayout>
  );
}
