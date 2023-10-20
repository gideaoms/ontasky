"use client";

import { Button, button } from "@/components/atoms/button";
import { Input } from "@/components/atoms";
import { TaskModel, AnswerModel, UserModel } from "@/core/models";
import { AnswerContext } from "@/external/contexts";
import { isError } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  description: z.string(),
});

export function Form(props: {
  answer: AnswerModel.Model;
  currentTeamId: string;
}) {
  const router = useRouter();
  const task = props.answer.task ?? TaskModel.empty();
  const owner = props.answer.task?.owner ?? UserModel.empty();
  const { formState, handleSubmit, control } = useForm({
    resolver: zodResolver(schema),
    values: {
      description: props.answer.description,
    },
  });
  const { answerRepository } = AnswerContext.useContext();

  async function save(description: string, selected: "approve" | "disapprove") {
    const answer1 = AnswerModel.build({
      id: props.answer.id,
      description: description,
      task: TaskModel.build({
        teamId: props.currentTeamId,
      }),
    });
    const save =
      selected === "approve"
        ? answerRepository.approve
        : answerRepository.disapprove;
    const answer2 = await save(answer1);
    if (isError(answer2)) {
      toast.error(answer2.message);
      return;
    }
    router.replace(`/answers?current_team_id=${props.currentTeamId}`);
    router.refresh();
    toast.success("Answer saved");
  }

  return (
    <form>
      <h1 className="text-gray-700 text-lg font-semibold">Task</h1>
      <hr />
      <Input.Root className="mt-4">
        <Input.Label htmlFor="owner">Owner</Input.Label>
        <Input.Control
          id="owner"
          placeholder="Owner"
          disabled
          value={owner.email}
        />
      </Input.Root>
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
      {!AnswerModel.isAwaiting(props.answer) && (
        <Input.Root className="mt-4">
          <Input.Label htmlFor="status">Status</Input.Label>
          <Input.Control
            id="status"
            placeholder="Status"
            disabled
            value={props.answer.status}
          />
        </Input.Root>
      )}
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <Input.Root className="mt-4">
            <Input.Label htmlFor="description">
              Description (optional)
            </Input.Label>
            <Input.Control asChild>
              <textarea
                {...field}
                id="description"
                placeholder="Description"
                rows={6}
                disabled={!AnswerModel.isAwaiting(props.answer)}
              />
            </Input.Control>
            <Input.Message>
              {formState.errors.description?.message}
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
            handleSubmit(({ description }) => {
              save(description, "approve");
            })();
          }}
          disabled={!AnswerModel.isAwaiting(props.answer)}
        >
          Approve
        </Button>
        <Button
          type="button"
          isLoading={formState.isSubmitting}
          className="bg-orange-400 hover:bg-orange-300"
          onClick={() => {
            handleSubmit(({ description }) => {
              save(description, "disapprove");
            })();
          }}
          disabled={!AnswerModel.isAwaiting(props.answer)}
        >
          Disapprove
        </Button>
      </div>
    </form>
  );
}
