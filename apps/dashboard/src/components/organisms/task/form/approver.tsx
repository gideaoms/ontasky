"use client";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms";
import { TaskModel, AnswerModel } from "@/core/models";
import { AnswerContext } from "@/external/contexts";
import { isError } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  description: z.string(),
});

export function ApproverForm(props: {
  currentTeamId: string;
  answer: AnswerModel.Model;
}) {
  const router = useRouter();
  const { formState, handleSubmit, control } = useForm({
    resolver: zodResolver(schema),
    values: {
      description: "",
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
    router.replace(`/tasks?current_team_id=${props.currentTeamId}`);
    router.refresh();
    toast.success("Answer saved");
  }

  return (
    <form>
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
