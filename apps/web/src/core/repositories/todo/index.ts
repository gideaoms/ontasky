import { TodoModel } from "@/core/models";

export type Repository = {
  findMany(teamId: string): Promise<TodoModel.Model[] | Error>;
  findOne(todoId: string, teamId: string): Promise<TodoModel.Model | Error>;
  approve(todo: TodoModel.Model): Promise<void | Error>;
  disapprove(todo: TodoModel.Model): Promise<void | Error>;
};
