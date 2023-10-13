import { button } from "@/components/atoms/button";
import { EditLink } from "@/components/organisms/team/components/edit-link";
import { TeamRepository } from "@/core/repositories/mod";
import { Plus } from "lucide-react";
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
            <th scope="col" className="px-6 py-3 text-center w-6">
              Action
            </th>
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
              <td className="px-6 py-4 font-normal text-violet-600 text-center">
                <EditLink team={team} currentTeamId={props.currentTeamId} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
