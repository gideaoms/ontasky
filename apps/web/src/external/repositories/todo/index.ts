import { TaskModel, TodoModel, UserModel } from "@/core/models";
import { TaskObject, TodoObject } from "@/core/objects";
import { TodoRepository } from "@/core/repositories";
import { api } from "@/external/libs/api";
import { isOkStatus } from "@/utils";
import { P, match } from "ts-pattern";
import { z } from "zod";

export class Repository implements TodoRepository.Repository {
  async findMany(teamId: string) {
    const result = await api.get("todos", {
      params: TaskObject.build({ team_id: teamId }),
    });
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
    const parsed = z
      .array(
        z.object({
          id: z.string(),
          status: z.enum(["awaiting", "approved", "disapproved"]),
          answered_at: z.string().nullish(),
          task: z.object({
            title: z.string(),
            owner: z.object({
              email: z.string(),
            }),
          }),
        })
      )
      .parse(result.data);
    return parsed.map((todo) =>
      TodoModel.build({
        id: todo.id,
        status: todo.status,
        answeredAt: todo.answered_at ?? "",
        task: TaskModel.build({
          title: match(todo.task.title.length)
            .with(P.number.gt(140), () =>
              todo.task.title.substring(0, 140).concat("...")
            )
            .otherwise(() => todo.task.title),
          owner: UserModel.build({
            email: todo.task.owner.email,
          }),
        }),
      })
    );
  }

  async findOne(todoId: string, teamId: string) {
    const result = await api.get(`todos/${todoId}`, {
      params: TodoObject.build({ team_id: teamId }),
    });
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
    const parsed = z
      .object({
        id: z.string(),
        status: z.enum(["awaiting", "approved", "disapproved"]),
        description: z.string().nullish(),
        answered_at: z.string().nullish(),
        task: z.object({
          title: z.string(),
          description: z.string(),
          owner: z.object({
            id: z.string(),
            email: z.string(),
          }),
        }),
      })
      .parse(result.data);
    return TodoModel.build({
      id: parsed.id,
      description: parsed.description ?? "",
      status: parsed.status,
      answeredAt: parsed.answered_at ?? "",
      task: TaskModel.build({
        title: parsed.task.title,
        description: parsed.task.description,
        owner: UserModel.build({
          id: parsed.task.owner.id,
          email: parsed.task.owner.email,
        }),
      }),
    });
  }

  async approve(todo: TodoModel.Model) {
    const task = todo.task ?? TaskModel.empty();
    const result = await api.put(
      `todos/${todo.id}/approve`,
      TodoObject.build({
        team_id: task.teamId,
        description: todo.description,
      })
    );
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
  }

  async disapprove(todo: TodoModel.Model) {
    const task = todo.task ?? TaskModel.empty();
    const result = await api.put(
      `todos/${todo.id}/disapprove`,
      TodoObject.build({
        team_id: task.teamId,
        description: todo.description,
      })
    );
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
  }
}
