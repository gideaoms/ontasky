"use client";

import { Button, button } from "@/components/atoms/button";
import { Input } from "@/components/atoms";
import { TaskModel, TodoModel } from "@/core/models";
import { TodoContext } from "@/external/contexts";
import { isError } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  observation: z.string(),
});

export function Form(props: { todo: TodoModel.Model; currentTeamId: string }) {
  const router = useRouter();
  const task = props.todo.task ?? TaskModel.empty();
  const { formState, handleSubmit, control } = useForm({
    resolver: zodResolver(schema),
    values: {
      observation: props.todo.description,
    },
  });
  const { todoRepository } = TodoContext.useContext();

  async function save(observation: string, selected: "approve" | "disapprove") {
    const todo1 = TodoModel.build({
      id: props.todo.id,
      description: observation,
      task: TaskModel.build({
        teamId: props.currentTeamId,
      }),
    });
    const save =
      selected === "approve"
        ? todoRepository.approve
        : todoRepository.disapprove;
    const todo2 = await save(todo1);
    if (isError(todo2)) {
      toast.error(todo2.message);
      return;
    }
    router.replace(`/todos?current_team_id=${props.currentTeamId}`);
    router.refresh();
    toast.success("Todo answered");
  }

  return (
    <form>
      <h1 className="text-gray-700 text-lg font-semibold">Task</h1>
      <hr />
      <Input.Root className="mt-4">
        <Input.Label htmlFor="title">Title</Input.Label>
        <Input.Control
          id="title"
          placeholder="Title"
          disabled
          value={task.title}
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
            value={task.description}
          />
        </Input.Control>
      </Input.Root>
      <hr className="my-4" />
      {!TodoModel.isAwaiting(props.todo) && (
        <Input.Root className="mt-4">
          <Input.Label htmlFor="status">Status</Input.Label>
          <Input.Control
            id="status"
            placeholder="Status"
            disabled
            value={props.todo.status}
          />
        </Input.Root>
      )}
      <Controller
        control={control}
        name="observation"
        render={({ field }) => (
          <Input.Root className="mt-4">
            <Input.Label htmlFor="observation">
              Observation (optional)
            </Input.Label>
            <Input.Control asChild>
              <textarea
                {...field}
                id="observation"
                placeholder="Observation"
                rows={6}
                disabled={!TodoModel.isAwaiting(props.todo)}
              />
            </Input.Control>
            <Input.Message>
              {formState.errors.observation?.message}
            </Input.Message>
          </Input.Root>
        )}
      />
      <div className="mt-4 flex flex-row gap-2">
        <Button
          type="button"
          isLoading={formState.isSubmitting}
          className="bg-green-600 hover:bg-green-500"
          onClick={() => {
            handleSubmit(({ observation }) => {
              save(observation, "approve");
            })();
          }}
          disabled={!TodoModel.isAwaiting(props.todo)}
        >
          Approve
        </Button>
        <Button
          type="button"
          isLoading={formState.isSubmitting}
          className="bg-orange-400 hover:bg-orange-300"
          onClick={() => {
            handleSubmit(({ observation }) => {
              save(observation, "disapprove");
            })();
          }}
          disabled={!TodoModel.isAwaiting(props.todo)}
        >
          Disapprove
        </Button>
        <Link
          href={`/todos?current_team_id=${props.currentTeamId}`}
          className={button({ variant: "error", className: "ml-auto" })}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
