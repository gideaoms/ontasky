import { Loader } from "@/components/organisms/user/loader";

export default function Page(props: {
  searchParams: { current_team_id: string };
}) {
  return <Loader currentTeamId={props.searchParams.current_team_id} />;
}
