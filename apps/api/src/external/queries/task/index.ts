import { TaskObject } from "@/internal/objects";
import { TaskQuery } from "@/internal/queries";
import { db } from "@/libs/knex";

export class Query implements TaskQuery.Query {
  async findMany(teamId: string, userId: string, by: "owner" | "approver") {
    if (by === "owner") {
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
    const rows = await db
      .select("tasks.*", "users_on_tasks.answered_at")
      .from("tasks")
      .where("team_id", teamId)
      .orderBy("created_at", "desc")
      .innerJoin("users_on_tasks", (query) => {
        query
          .on("users_on_tasks.task_id", "=", "tasks.id")
          .andOn("users_on_tasks.user_id", "=", db.raw("?", [userId]));
      });
    return rows.map((row) =>
      TaskObject.build({
        id: row.id,
        title: row.title,
        status: row.status,
        answeredAt: row.answered_at,
      })
    );
  }

  async findOne(
    taskId: string,
    teamId: string,
    userId: string,
    by: "owner" | "approver"
  ) {
    if (by === "owner") {
      const [row] = await db
        .from("tasks")
        .where("id", taskId)
        .andWhere("owner_id", userId)
        .andWhere("team_id", teamId);
      if (!row) {
        return null;
      }
      return TaskObject.build({
        id: row.id,
        title: row.title,
      });
    }
    const [row] = await db
      .select("tasks.*")
      .from("tasks")
      .where("tasks.id", taskId)
      .andWhere("tasks.team_id", teamId)
      .innerJoin("users_on_tasks", (query) => {
        query
          .on("users_on_tasks.task_id", "=", "tasks.id")
          .andOn("users_on_tasks.user_id", "=", db.raw("?", [userId]));
      });
    if (!row) {
      return null;
    }
    return TaskObject.build({
      id: row.id,
      title: row.title,
    });
  }
}
