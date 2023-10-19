import { button } from "@/components/atoms/button";
import { Can } from "@/components/atoms/can";
import { TeamRepository } from "@/core/repositories";
import { ClipboardEdit, Plus } from "lucide-react";
import Link from "next/link";

export default async function List(props: {
  teamRepository: TeamRepository.Repository;
  currentTeamId: string;
}) {
  const teams = await props.teamRepository.findMany();
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-gray-700 text-lg font-semibold">Teams</h1>
        <Link
          href={`/teams/new?current_team_id=${props.currentTeamId}`}
          className={button()}
        >
          <Plus className="h-4 w-4" />
        </Link>
      </div>
      <table className="w-full text-sm text-left border-t mt-2">
        <thead className="text-xs text-gray-700 bg-gray-50 uppercase">
          <tr className="border-b">
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Role
            </th>
            <Can role="admin">
              <th scope="col" className="px-6 py-3 text-center w-6">
                Action
              </th>
            </Can>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.id} className="border-b">
              <td
                scope="row"
                className="px-6 py-4 font-normal text-gray-900 whitespace-nowrap"
              >
                {team.name}
              </td>
              <td>{team.role}</td>
              <Can role="admin">
                <td className="px-6 py-4 font-normal text-violet-600 text-center">
                  <Link
                    href={`teams/${team.id}?current_team_id=${props.currentTeamId}`}
                    className="inline-block"
                  >
                    <ClipboardEdit className="h-5 w-5" />
                  </Link>
                </td>
              </Can>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
