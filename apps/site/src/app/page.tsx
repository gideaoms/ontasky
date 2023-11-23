import { Form } from "@/app/form";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-violet-100 via-purple-100">
      <div className="container mx-auto flex flex-col min-h-screen">
        <header className="p-4 mb-14 flex justify-between">
          <Link href="/">
            <strong className="text-xl font-semibold text-zinc-900">
              Ontasky
            </strong>
            <span className="text-xs ml-2">beta</span>
          </Link>
          {/* <ul className="hover:underline">
            <li>
              <a href="https://dashboard.ontasky.com" target="_blank">
                Login
              </a>
            </li>
          </ul> */}
        </header>
        <main className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col justify-center items-center">
            <h1 className="text-4xl text-black text-center mb-14 max-w-4xl">
              Ontasky is a tool which helps you to ask for approval from other
              people in your company.
            </h1>
            <Form />
          </div>
          <div className="text-sm text-slate-600 my-14 p-2 text-center">
            <p className="text-lg font-bold">How it works: </p>
            <br />
            <ul className="space-y-1">
              <li>&#x2022; Sign up on Ontasky</li>
              <li>&#x2022; Register your company</li>
              <li>&#x2022; Register your team members</li>
              <li>
                &#x2022; Create a task and add one or more team members to
                approve it.
              </li>
            </ul>
            <br />
            <p>That is it :)</p>
          </div>
        </main>
      </div>
    </div>
  );
}
