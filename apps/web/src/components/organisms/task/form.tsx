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
import { match } from "ts-pattern";

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

  async function save(
    title: string,
    description: string,
    approvers: UserModel.Model[]
  ) {
    const task1 = TaskModel.build({
      id: props.task.id,
      teamId: props.currentTeamId,
      title,
      description,
      approvers,
    });
    const save = props.task.id ? taskRepository.update : taskRepository.create;
    const task2 = await save(task1, approvers);
    if (isError(task2)) {
      toast.error(task2.message);
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
        {match(fields.length)
          .with(0, () => (
            <span className="text-xs text-gray-600">
              There is no other member in your team yet.
            </span>
          ))
          .otherwise(() =>
            fields.map((approver, index) => (
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
            ))
          )}
      </div>
      {props.task.todos?.map((todo) => {
        const approver = todo.approver ?? UserModel.empty();
        return (
          <fieldset
            key={todo.id}
            className="border p-4 mt-4 rounded-lg border-zinc-300"
          >
            <Input.Root>
              <Input.Label htmlFor="approver">Approver</Input.Label>
              <Input.Control
                id="approver"
                placeholder="Approver"
                disabled
                value={approver.email}
              />
            </Input.Root>
            <Input.Root className="mt-4">
              <Input.Label htmlFor="status">Status</Input.Label>
              <Input.Control
                id="status"
                placeholder="Status"
                disabled
                value={todo.status}
              />
            </Input.Root>
            <Input.Root className="mt-4">
              <Input.Label htmlFor="description">Description</Input.Label>
              <Input.Control asChild>
                <textarea
                  id="description"
                  placeholder="Description"
                  rows={6}
                  disabled
                  value={todo.description}
                />
              </Input.Control>
            </Input.Root>
          </fieldset>
        );
      })}
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
