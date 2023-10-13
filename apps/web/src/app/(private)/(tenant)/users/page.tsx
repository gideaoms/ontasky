import List from "@/components/organisms/user/list";
import { UserRepository } from "@/external/repositories/mod";

const userRepository = new UserRepository.Repository();

export default async function Page(props: {
  searchParams: { current_team_id: string };
}) {
  return (
    <List
      userRepository={userRepository}
      currentTeamId={props.searchParams.current_team_id}
    />
  );
}
