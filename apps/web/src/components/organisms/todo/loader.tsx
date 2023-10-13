import { Message } from "@/components/atoms/message";
import { Form } from "@/components/organisms/todo/form";
import { TodoModel } from "@/core/models";
import { TodoRepository } from "@/core/repositories";
import { isError } from "@/utils";
import { match, P } from "ts-pattern";

export async function Loader(props: {
  todoId?: string;
  todoRepository: TodoRepository.Repository;
  currentTeamId: string;
}) {
  const todo = await match(props.todoId)
    .with(P.string, (todoId) => {
      return props.todoRepository.findOne(todoId, props.currentTeamId);
    })
    .otherwise(() => TodoModel.empty());
  if (isError(todo)) {
    return <Message variant="warning">{todo.message}</Message>;
  }
  return <Form todo={todo} currentTeamId={props.currentTeamId} />;
}
