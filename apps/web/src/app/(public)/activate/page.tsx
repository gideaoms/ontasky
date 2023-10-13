"use client";

import { Button } from "@/components/atoms/button";
import { Message } from "@/components/atoms/message";
import { Input } from "@/components/atoms/mod";
import { UserContext } from "@/external/contexts/mod";
import { isError } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  email: z.string().nonempty().email(),
  validationCode: z.string().nonempty(),
});

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formState, handleSubmit, control } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      validationCode: "",
    },
  });
  const { userRepository } = UserContext.useContext();

  async function activate(email: string, validationCode: string) {
    const activatedPerson = await userRepository.activate(
      email,
      validationCode
    );
    if (isError(activatedPerson)) {
      toast.error(activatedPerson.message);
      return;
    }
    router.replace("/sign-in");
    toast.success("Email successfully activated");
  }

  return (
    <div className="px-2 min-h-screen flex items-center justify-center">
      <form
        className="mx-auto w-full max-w-[450px] space-y-4"
        onSubmit={handleSubmit(({ email, validationCode }) =>
          activate(email, validationCode)
        )}
      >
        <h1 className="text-xl text-center font-semibold mb-8">
          Activate account
        </h1>
        <Message variant="success">
          Enter the code we just sent to {searchParams.get("email") ?? ""}
        </Message>
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
                disabled
                placeholder="Ex: john@mail.com"
                className="cursor-not-allowed"
              />
            </Input.Root>
          )}
        />
        <Controller
          control={control}
          name="validationCode"
          render={({ field }) => (
            <Input.Root className="grid gap-1">
              <Input.Label htmlFor="validationCode">Code</Input.Label>
              <Input.Control
                {...field}
                id="validationCode"
                placeholder="Ex: a1b2c3"
              />
              <Input.Message>
                {formState.errors.validationCode?.message}
              </Input.Message>
            </Input.Root>
          )}
        />
        <Button
          type="submit"
          className="w-full mt-4"
          isLoading={formState.isSubmitting}
        >
          Activate account
        </Button>
      </form>
    </div>
  );
}
