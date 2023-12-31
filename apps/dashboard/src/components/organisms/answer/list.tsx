import { Message } from "@/components/atoms/message";
import { TaskModel, UserModel } from "@/core/models";
import { AnswerRepository } from "@/core/repositories";
import { isError } from "@/utils";
import { Check, ClipboardEdit, Hourglass } from "lucide-react";
import Link from "next/link";
import { match } from "ts-pattern";

export default async function List(props: {
  answerRepository: AnswerRepository.Repository;
  currentTeamId: string;
}) {
  const answers = await props.answerRepository.findMany(props.currentTeamId);
  if (isError(answers)) {
    return <Message variant="warning">{answers.message}</Message>;
  }
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-gray-700 text-lg font-semibold">Answers</h1>
      </div>
      <table className="w-full text-sm text-left border-t mt-2">
        <thead className="text-xs text-gray-700 bg-gray-50 uppercase">
          <tr className="border-b">
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3">
              Owner
            </th>
            <th scope="col" className="px-6 py-3 text-center w-6">
              Done
            </th>
            <th scope="col" className="px-6 py-3 text-center w-6">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {answers.map((answer) => {
            const task = answer.task ?? TaskModel.empty();
            const owner = answer.task?.owner ?? UserModel.empty();
            return (
              <tr key={answer.id} className="border-b">
                <td
                  scope="row"
                  className="px-6 py-4 font-normal text-gray-900 whitespace-nowrap"
                >
                  {task.title}
                </td>
                <td
                  scope="row"
                  className="px-6 py-4 font-normal text-gray-900 whitespace-nowrap"
                >
                  {owner.email}
                </td>
                <td className="px-6 py-4 font-normal text-center">
                  {match(Boolean(answer.answeredAt))
                    .with(true, () => (
                      <Check className="w-4 h-4 text-green-700 m-auto" />
                    ))
                    .otherwise(() => (
                      <Hourglass className="w-4 h-4 text-violet-600 m-auto" />
                    ))}
                </td>
                <td className="px-6 py-4 font-normal text-violet-600 text-center">
                  <Link
                    href={`answers/${answer.id}?current_team_id=${props.currentTeamId}`}
                    className="inline-block"
                  >
                    <ClipboardEdit className="h-5 w-5" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
