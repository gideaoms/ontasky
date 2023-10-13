import { Loader } from "@/components/organisms/task/loader";
import { TaskRepository, UserRepository } from "@/external/repositories";

const taskRepository = new TaskRepository.Repository();
const userRepository = new UserRepository.Repository();

export default function Page(props: {
  params: { task_id: string };
  searchParams: { current_team_id: string };
}) {
  return (
    <Loader
      taskId={props.params.task_id}
      taskRepository={taskRepository}
      userRepository={userRepository}
      currentTeamId={props.searchParams.current_team_id}
    />
  );
}
