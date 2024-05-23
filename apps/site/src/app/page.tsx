/**
 * v0 by Vercel.
 * @see https://v0.dev/t/pnjrcpZVXnQ
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <main className="flex flex-col items-center justify-center w-full min-h-[100dvh] bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl">
            Get Approvals Faster
          </h1>
          <p className="text-lg text-gray-200 md:text-xl">
            Our tool streamlines the approval process, helping you get the green light from your team in no time.
          </p>
          <form className="flex w-full max-w-md mx-auto space-x-2">
            <Input
              className="flex-1 bg-white/10 text-white placeholder:text-gray-300 focus:bg-white/20"
              placeholder="Enter your email"
              type="email"
            />
            <Button
              className="bg-white text-[#6366F1] hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#6366F1]"
              type="submit"
            >
              Get Early Access
            </Button>
          </form>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 rounded-lg p-4 text-left">
              <ClockIcon className="w-8 h-8 text-white" />
              <h3 className="text-lg font-semibold text-white mt-2">Faster Approvals</h3>
              <p className="text-gray-200 mt-2">
                Our tool streamlines the approval process, helping you get the green light from your team in no time.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-left">
              <CheckIcon className="w-8 h-8 text-white" />
              <h3 className="text-lg font-semibold text-white mt-2">Automated Workflows</h3>
              <p className="text-gray-200 mt-2">
                Streamline your approval process with our automated workflows, ensuring nothing falls through the
                cracks.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-left">
              <UsersIcon className="w-8 h-8 text-white" />
              <h3 className="text-lg font-semibold text-white mt-2">Collaborative Approvals</h3>
              <p className="text-gray-200 mt-2">
                Involve your entire team in the approval process, with real-time updates and notifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}


function ClockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}


function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
