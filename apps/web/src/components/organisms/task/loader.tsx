import { Message } from "@/components/atoms/message";
import { Form } from "@/components/organisms/task/form";
import { TaskModel } from "@/core/models";
import { TaskRepository, UserRepository } from "@/core/repositories/mod";
import { isError } from "@/utils";
import { match, P } from "ts-pattern";

export async function Loader(props: {
  taskId?: string;
  taskRepository: TaskRepository.Repository;
  userRepository: UserRepository.Repository;
  currentTeamId: string;
}) {
  const task = await match(props.taskId)
    .with(P.string, (taskId) => {
      const by = "owner";
      return props.taskRepository.findById(taskId, props.currentTeamId, by);
    })
    .otherwise(function () {
      return Object.assign(TaskModel.empty(), {
        users: [],
        approverIds: [],
      });
    });
  if (isError(task)) {
    return <Message variant="warning">{task.message}</Message>;
  }
  const users = await props.userRepository.findMany(props.currentTeamId);
  return <Form task={task} users={users} currentTeamId={props.currentTeamId} />;
}
