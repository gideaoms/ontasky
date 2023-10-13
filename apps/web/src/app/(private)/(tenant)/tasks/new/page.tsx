import { Loader } from "@/components/organisms/task/loader";
import { TaskRepository, UserRepository } from "@/external/repositories/mod";

const taskRepository = new TaskRepository.Repository();
const userRepository = new UserRepository.Repository();

export default async function Page(props: {
  searchParams: { current_team_id: string };
}) {
  return (
    <Loader
      taskRepository={taskRepository}
      userRepository={userRepository}
      currentTeamId={props.searchParams.current_team_id}
    />
  );
}
