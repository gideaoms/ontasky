import List from "@/components/organisms/todo/list";
import { TodoRepository } from "@/external/repositories";

const todoRepository = new TodoRepository.Repository();

export default async function Page(props: {
  searchParams: { current_team_id: string };
}) {
  return (
    <List
      todoRepository={todoRepository}
      currentTeamId={props.searchParams.current_team_id}
    />
  );
}
