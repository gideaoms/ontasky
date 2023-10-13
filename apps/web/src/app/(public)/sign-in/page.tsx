"use client";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/mod";
import { SessionContext } from "@/external/contexts/mod";
import { isError } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1),
});

export default function Page() {
  const router = useRouter();
  const { formState, handleSubmit, control } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { setUser, sessionRepository } = SessionContext.useContext();

  async function signIn(email: string, password: string) {
    const user = await sessionRepository.create(email, password);
    if (isError(user)) {
      toast.error(user.message);
      return;
    }
    setUser(user);
    router.replace("/");
    toast.success("You have successfully logged in");
  }

  return (
    <div className="px-2 min-h-screen flex items-center justify-center">
      <form
        className="mx-auto w-full max-w-[450px] space-y-4"
        onSubmit={handleSubmit(({ email, password }) =>
          signIn(email, password)
        )}
      >
        <h1 className="text-xl text-center font-semibold mb-8">Sign In</h1>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input.Root className="grid gap-1">
              <Input.Label htmlFor="email">Email</Input.Label>
              <Input.Control
                {...field}
                id="email"
                type="email"
                placeholder="john@mail.com"
              />
              <Input.Message>{formState.errors.email?.message}</Input.Message>
            </Input.Root>
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <Input.Root className="grid gap-1">
              <Input.Label htmlFor="password">Password</Input.Label>
              <Input.Control
                {...field}
                id="password"
                type="password"
                placeholder="******"
              />
              <Input.Message>
                {formState.errors.password?.message}
              </Input.Message>
            </Input.Root>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          isLoading={formState.isSubmitting}
        >
          Sign In
        </Button>
        <p className="text-sm text-zinc-700">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="text-violet-600 hover:text-violet-700"
          >
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}
