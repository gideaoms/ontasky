"use client";

import { Button, button } from "@/components/atoms/button";
import { Checkbox } from "@/components/atoms/checkbox";
import { Input } from "@/components/atoms";
import { TaskModel, UserModel } from "@/core/models";
import { TaskContext } from "@/external/contexts";
import { isError } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    users: z
      .array(
        z.object({
          value: z.string(),
          email: z.string(),
          enabled: z.boolean(),
        })
      )
      .transform((users) => users.filter((user) => user.enabled)),
  })
  .transform((schema) => ({
    title: schema.title,
    description: schema.description,
    approvers: schema.users,
  }));

export function Form(props: {
  task: TaskModel.Model;
  users: UserModel.Model[];
  currentTeamId: string;
}) {
  const router = useRouter();
  const { formState, handleSubmit, control } = useForm<
    z.input<typeof schema>,
    undefined,
    z.output<typeof schema>
  >({
    resolver: zodResolver(schema),
    values: {
      title: props.task.title,
      description: props.task.description,
      users: props.users.map((user) => {
        const approvers = props.task.approvers ?? [];
        return {
          value: user.id,
          email: user.email,
          enabled: approvers.map((approver) => approver.id).includes(user.id),
        };
      }),
    },
  });
  const { fields } = useFieldArray({
    control,
    name: "users",
  });
  const { taskRepository } = TaskContext.useContext();

  console.log(props.task);

  async function save(
    title: string,
    description: string,
    approvers: UserModel.Model[]
  ) {
    const task = TaskModel.build({
      id: props.task.id,
      teamId: props.currentTeamId,
      title,
      description,
      approvers,
    });
    const save = props.task.id ? taskRepository.update : taskRepository.create;
    const savedTask = await save(task, approvers);
    if (isError(savedTask)) {
      toast.error(savedTask.message);
      return;
    }
    router.replace(`/tasks?current_team_id=${props.currentTeamId}`);
    router.refresh();
    toast.success("Task saved");
  }

  return (
    <form
      onSubmit={handleSubmit(function ({ title, description, approvers }) {
        save(
          title,
          description,
          approvers.map((approver) => UserModel.build({ id: approver.value }))
        );
      })}
    >
      <h1 className="text-gray-700 text-lg font-semibold">Task</h1>
      <hr />
      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <Input.Root className="mt-4">
            <Input.Label htmlFor="title">Title</Input.Label>
            <Input.Control {...field} id="title" placeholder="Title" />
            <Input.Message>{formState.errors.title?.message}</Input.Message>
          </Input.Root>
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <Input.Root className="mt-4">
            <Input.Label htmlFor="description">Description</Input.Label>
            <Input.Control asChild>
              <textarea
                {...field}
                id="description"
                placeholder="Description"
                rows={6}
              />
            </Input.Control>
            <Input.Message>
              {formState.errors.description?.message}
            </Input.Message>
          </Input.Root>
        )}
      />
      <div className="flex flex-col gap-2 mt-4">
        <Input.Label>Approvers</Input.Label>
        {fields.map((approver, index) => (
          <Controller
            key={approver.id}
            control={control}
            name={`users.${index}.enabled`}
            render={({ field }) => (
              <Checkbox
                onCheckedChange={function (checked) {
                  field.onChange(checked === true);
                }}
                checked={field.value}
                label={approver.email}
              />
            )}
          />
        ))}
      </div>
      <div className="mt-4 flex flex-row gap-2">
        <Button type="submit" isLoading={formState.isSubmitting}>
          Save
        </Button>
        <Link
          href={`/tasks?current_team_id=${props.currentTeamId}`}
          className={button({ variant: "error" })}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
