import { button } from "@/components/atoms/button";
import { Message } from "@/components/atoms/message";
import { TaskRepository } from "@/core/repositories/mod";
import { isError } from "@/utils";
import {
  ClipboardEdit,
  Hourglass,
  Plus,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { match } from "ts-pattern";

export default async function List(props: {
  taskRepository: TaskRepository.Repository;
  currentTeamId: string;
}) {
  const by = "owner";
  const tasks = await props.taskRepository.findMany(props.currentTeamId, by);
  if (isError(tasks)) {
    return <Message variant="warning">{tasks.message}</Message>;
  }
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-gray-700 text-lg font-semibold">Tasks</h1>
        <Link
          href={`/tasks/new?current_team_id=${props.currentTeamId}`}
          className={button()}
        >
          <Plus className="h-4 w-4" />
        </Link>
      </div>
      <table className="w-full text-sm text-left border-t mt-2">
        <thead className="text-xs text-gray-700 bg-gray-50 uppercase">
          <tr className="border-b">
            <th scope="col" className="px-6 py-3 w-6">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-center w-6">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((team) => (
            <tr key={team.id} className="border-b">
              <td className="px-6 py-4 font-normal text-gray-900">
                {match(team.status)
                  .with("approved", function () {
                    return (
                      <ThumbsUp className="w-4 h-4 text-green-700 m-auto" />
                    );
                  })
                  .with("awaiting", function () {
                    return (
                      <Hourglass className="w-4 h-4 text-violet-600 m-auto" />
                    );
                  })
                  .with("disapproved", function () {
                    return (
                      <ThumbsDown className="w-4 h-4 text-red-700 m-auto" />
                    );
                  })
                  .exhaustive()}
              </td>
              <td
                scope="row"
                className="px-6 py-4 font-normal text-gray-900 whitespace-nowrap"
              >
                {team.title}
              </td>
              <td className="px-6 py-4 font-normal text-violet-600 text-center">
                <Link
                  href={`tasks/${team.id}?current_team_id=${props.currentTeamId}`}
                  className="inline-block"
                >
                  <ClipboardEdit className="h-5 w-5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
