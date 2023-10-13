import { Loader } from "@/components/organisms/team/loader";
import { TeamRepository } from "@/external/repositories/mod";

const teamRepository = new TeamRepository.Repository();

export default async function Page(props: {
  params: { team_id: string };
  searchParams: { current_team_id: string };
}) {
  return (
    <Loader
      teamId={props.params.team_id}
      teamRepository={teamRepository}
      currentTeamId={props.searchParams.current_team_id}
    />
  );
}
