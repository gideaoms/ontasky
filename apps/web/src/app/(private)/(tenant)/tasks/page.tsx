import List from "@/components/organisms/task/list";
import { TaskRepository } from "@/external/repositories";

const taskRepository = new TaskRepository.Repository();

export default async function Page(props: {
  searchParams: { current_team_id: string };
}) {
  return (
    <List
      taskRepository={taskRepository}
      currentTeamId={props.searchParams.current_team_id}
    />
  );
}
