import { Loader } from "@/components/organisms/team/loader";
import { TeamRepository } from "@/external/repositories";

const teamRepository = new TeamRepository.Repository();

export default function Page(props: {
  searchParams: { current_team_id: string };
}) {
  return (
    <Loader
      teamRepository={teamRepository}
      currentTeamId={props.searchParams.current_team_id}
    />
  );
}
