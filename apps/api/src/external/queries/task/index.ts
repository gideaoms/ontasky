import { TaskObject, UserObject } from "@/core/objects";
import { TaskQuery } from "@/core/queries";
import { db } from "@/libs/knex";

export class Query implements TaskQuery.Query {
  async findMany(teamId: string, userId: string) {
    const rows = await db
      .select("*")
      .from("tasks")
      .where("team_id", teamId)
      .andWhere("owner_id", userId)
      .orderBy("created_at", "desc");
    return rows.map((row) =>
      TaskObject.build({
        id: row.id,
        title: row.title,
        status: row.status,
      })
    );
  }

  async findOne(taskId: string, teamId: string, userId: string) {
    const rows = await db
      .select("tasks.*", "users.id as approver_id")
      .from("tasks")
      .where("tasks.id", taskId)
      .andWhere("tasks.owner_id", userId)
      .andWhere("tasks.team_id", teamId)
      .leftJoin("users_on_tasks", (query) => {
        query.on("users_on_tasks.task_id", "=", "tasks.id");
      })
      .leftJoin("users", (query) => {
        query.on("users.id", "=", "users_on_tasks.user_id");
      });
    if (rows.length === 0) {
      return null;
    }
    const [task] = rows;
    return TaskObject.build({
      id: task.id,
      title: task.title,
      approvers: rows
        .map((row) =>
          UserObject.build({
            id: row.approver_id,
          })
        )
        .filter((approver) => approver.id),
    });
  }
}
