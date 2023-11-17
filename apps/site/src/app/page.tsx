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
          <ul className="hover:underline">
            <li>
              <a href="https://dashboard.ontasky.com" target="_blank">
                Login
              </a>
            </li>
          </ul>
        </header>
        <main className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl text-black text-center mb-14">
              Ontasky is a tool which helps you to ask for approval from other
              people in your company.
            </h1>
            <form className="flex gap-2 justify-center">
              <input
                placeholder="example@mail.com"
                className="border p-2 rounded"
              />
              <button
                type="submit"
                className="bg-violet-700 text-white p-2 rounded"
              >
                Free trial
              </button>
            </form>
          </div>
          <div className="text-sm text-slate-600 my-14 w-fit mx-auto p-2">
            <p className="text-lg">How it works: </p>
            <br />
            <ul className="space-y-1">
              <li>1. Sign up on Ontasky</li>
              <li>2. Register your company</li>
              <li>3. Register your team members</li>
              <li>
                4. Create a task and add one or more team members to approve it.
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
