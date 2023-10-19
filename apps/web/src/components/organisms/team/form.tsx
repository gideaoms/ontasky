"use client";

import { Button, button } from "@/components/atoms/button";
import { Input } from "@/components/atoms";
import { TeamModel } from "@/core/models";
import { TeamContext } from "@/external/contexts";
import { isError } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
});

export function Form(props: { team: TeamModel.Model; currentTeamId: string }) {
  const router = useRouter();
  const { formState, handleSubmit, control } = useForm({
    resolver: zodResolver(schema),
    values: {
      name: props.team.name,
    },
  });
  const { teamRepository } = TeamContext.useContext();

  async function save(name: string) {
    const team = TeamModel.build({ ...props.team, name });
    const save = props.team.id ? teamRepository.update : teamRepository.create;
    const savedTeam = await save(team);
    if (isError(savedTeam)) {
      toast.error(savedTeam.message);
      return;
    }
    router.replace(`/teams?current_team_id=${props.currentTeamId}`);
    router.refresh();
    toast.success("Team saved");
  }

  return (
    <form onSubmit={handleSubmit(({ name }) => save(name))}>
      <h1 className="text-gray-700 text-lg font-semibold">Team</h1>
      <hr />
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
      <div className="mt-4 flex flex-row gap-2">
        <Button type="submit" isLoading={formState.isSubmitting}>
          Save
        </Button>
      </div>
    </form>
  );
}
