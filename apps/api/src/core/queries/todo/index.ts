import { TodoObject } from "@/core/objects";

export type Query = {
  findMany(teamId: string, userId: string): Promise<TodoObject.Object[]>;
  findOne(by: {
    todoId: string;
    teamId: string;
    userId: string;
  }): Promise<TodoObject.Object | null>;
};
