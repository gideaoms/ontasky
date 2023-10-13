import List from "@/components/organisms/team/list";
import { TeamRepository } from "@/external/repositories/mod";

const teamRepository = new TeamRepository.Repository();

export default async function Page(props: {
  searchParams: { current_team_id: string };
}) {
  return (
    <List
      teamRepository={teamRepository}
      currentTeamId={props.searchParams.current_team_id}
    />
  );
}
