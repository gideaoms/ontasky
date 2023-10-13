"use client";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms";
import { TeamModel } from "@/core/models";
import { TeamContext } from "@/external/contexts";
import { isError } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().nonempty(),
});

export function Form() {
  const router = useRouter();
  const { formState, handleSubmit, control } = useForm({
    resolver: zodResolver(schema),
    values: {
      name: "",
    },
  });
  const { teamRepository } = TeamContext.useContext();

  async function create(name: string) {
    const team = TeamModel.build({
      id: "",
      name,
    });
    const createdTeam = await teamRepository.create(team);
    if (isError(createdTeam)) {
      toast.error(createdTeam.message);
      return;
    }
    router.push(`/?current_team_id=${createdTeam.id}`);
    toast.success("Team created");
  }

  return (
    <form
      onSubmit={handleSubmit(({ name }) => create(name))}
      className="w-full max-w-lg"
    >
      <h1 className="text-gray-700 text-lg font-semibold text-center">Team</h1>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Input.Root className="mt-4">
            <Input.Label htmlFor="name">Name</Input.Label>
            <Input.Control {...field} id="name" placeholder="Name" />
            <Input.Message>{formState.errors.name?.message}</Input.Message>
          </Input.Root>
        )}
      />
      <Button
        type="submit"
        isLoading={formState.isSubmitting}
        className="mt-2 w-full"
      >
        Create
      </Button>
    </form>
  );
}
