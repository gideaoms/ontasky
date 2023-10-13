import { Loader } from "@/components/organisms/todo/loader";
import { TodoRepository } from "@/external/repositories/mod";

const todoRepository = new TodoRepository.Repository();

export default function Page(props: {
  params: { todo_id: string };
  searchParams: { current_team_id: string };
}) {
  return (
    <Loader
      todoId={props.params.todo_id}
      todoRepository={todoRepository}
      currentTeamId={props.searchParams.current_team_id}
    />
  );
}
