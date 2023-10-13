import { TaskModel, UserModel } from "@/core/models";
import { TaskObject, UserObject } from "@/core/objects";
import { TaskRepository } from "@/core/repositories";
import { api } from "@/external/libs/api";
import { isOkStatus } from "@/utils";
import { P, match } from "ts-pattern";
import { z } from "zod";

export class Repository implements TaskRepository.Repository {
  async findMany(teamId: string) {
    const result = await api.get("tasks", {
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
          title: z.string(),
          status: z.enum(["awaiting", "approved", "disapproved"]),
        })
      )
      .parse(result.data);
    return parsed.map((task) =>
      TaskModel.build({
        id: task.id,
        title: match(task.title.length)
          .with(P.number.gt(140), () =>
            task.title.substring(0, 140).concat("...")
          )
          .otherwise(() => task.title),
        status: task.status,
      })
    );
  }

  async findById(taskId: string, teamId: string) {
    const result = await api.get(`tasks/${taskId}`, {
      params: TaskObject.build({ team_id: teamId }),
    });
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
    const parsed = z
      .object({
        id: z.string(),
        title: z.string(),
        approvers: z.array(z.object({ id: z.string() })),
      })
      .parse(result.data);
    return TaskModel.build({
      id: parsed.id,
      title: parsed.title,
      approvers: parsed.approvers.map((approver) =>
        UserModel.build({
          id: approver.id,
        })
      ),
    });
  }

  async create(task: TaskModel.Model, approvers: UserModel.Model[]) {
    const result = await api.post(
      "tasks",
      TaskObject.build({
        team_id: task.teamId,
        title: task.title,
        description: task.description,
        approvers: approvers.map((approver) =>
          UserObject.build({
            id: approver.id,
          })
        ),
      })
    );
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
    const parsed = z
      .object({
        id: z.string(),
        title: z.string(),
      })
      .parse(result.data);
    return TaskModel.build({
      id: parsed.id,
      title: parsed.title,
    });
  }

  async update(task: TaskModel.Model, approvers: UserModel.Model[]) {
    const result = await api.put(
      `tasks/${task.id}`,
      TaskObject.build({
        team_id: task.teamId,
        title: task.title,
        description: task.description,
        approvers: approvers.map((approver) =>
          UserObject.build({
            id: approver.id,
          })
        ),
      })
    );
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
    const parsed = z
      .object({
        id: z.string(),
        title: z.string(),
      })
      .parse(result.data);
    return TaskModel.build({
      id: parsed.id,
      title: parsed.title,
    });
  }
}
