"use client";

import { Button, button } from "@/components/atoms/button";
import { Input } from "@/components/atoms";
import { UserContext } from "@/external/contexts";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { isError } from "@/utils";
import { TeamModel, UserModel } from "@/core/models";

const schema = z.object({
  email: z.string().email().nonempty(),
});

export function Form(props: { currentTeamId: string }) {
  const router = useRouter();
  const { formState, handleSubmit, control } = useForm({
    resolver: zodResolver(schema),
    values: {
      email: "",
    },
  });
  const { userRepository } = UserContext.useContext();

  async function create(email: string) {
    const team = TeamModel.build({ id: props.currentTeamId });
    const user1 = UserModel.build({ email, team });
    const user2 = await userRepository.joinTeam(user1);
    if (isError(user2)) {
      toast.error(user2.message);
      return;
    }
    router.replace(`/users?current_team_id=${props.currentTeamId}`);
    router.refresh();
    toast.success("User created");
  }

  return (
    <form onSubmit={handleSubmit(({ email }) => create(email))}>
      <h1 className="text-gray-700 text-lg font-semibold">User</h1>
      <hr />
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <Input.Root className="mt-4">
            <Input.Label htmlFor="email">Email</Input.Label>
            <Input.Control {...field} id="email" placeholder="Email" />
            <Input.Message>{formState.errors.email?.message}</Input.Message>
          </Input.Root>
        )}
      />
      <div className="mt-4 flex flex-row gap-2">
        <Button type="submit" isLoading={formState.isSubmitting}>
          Save
        </Button>
        <Link
          href={`/users?current_team_id=${props.currentTeamId}`}
          className={button({ variant: "error" })}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
