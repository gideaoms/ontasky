import { TodoModel } from "@/core/models";

export type Repository = {
  findManyNotIn(
    taskId: string,
    approvers: Array<{ id: string }>
  ): Promise<TodoModel.Model[]>;
  findById(todoId: string): Promise<TodoModel.Model | null>;
  findByPk(approverId: string, taskId: string): Promise<TodoModel.Model | null>;
  update(todo: TodoModel.Model): Promise<TodoModel.Model>;
};
