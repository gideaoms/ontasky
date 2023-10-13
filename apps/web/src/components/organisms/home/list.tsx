import { Form } from "@/components/organisms/home/form";
import { TeamRepository } from "@/core/repositories/mod";
import Link from "next/link";
import { Fragment } from "react";
import { match } from "ts-pattern";

export async function List(props: {
  teamRepository: TeamRepository.Repository;
}) {
  const teams = await props.teamRepository.findMany();
  return (
    <div className="min-h-screen flex items-center justify-center flex-col p-2">
      {match(teams.length)
        .with(0, function () {
          return <Form />;
        })
        .otherwise(function () {
          return (
            <Fragment>
              <h1 className="text-gray-700 text-lg font-semibold text-center">
                Teams
              </h1>
              <ul className="w-full max-w-lg mt-4 space-y-2">
                {teams.map((team) => (
                  <li key={team.id}>
                    <Link
                      href={`/?current_team_id=${team.id}`}
                      className="border p-2 rounded shadow w-full inline-block hover:bg-gray-100"
                    >
                      {team.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Fragment>
          );
        })}
    </div>
  );
}
