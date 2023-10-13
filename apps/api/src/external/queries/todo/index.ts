import { TaskObject, TodoObject } from "@/core/objects";
import { TodoQuery } from "@/core/queries";
import { db } from "@/libs/knex";

export class Query implements TodoQuery.Query {
  async findMany(teamId: string, userId: string) {
    const rows = await db
      .select("users_on_tasks.*", "tasks.title as task_title")
      .from("users_on_tasks")
      .where("users_on_tasks.user_id", userId)
      .orderBy("users_on_tasks.created_at", "desc")
      .innerJoin("tasks", (query) => {
        query
          .on("tasks.id", "=", "users_on_tasks.task_id")
          .andOn("tasks.team_id", "=", db.raw("?", [teamId]));
      });
    return rows.map((row) =>
      TodoObject.build({
        id: row.id,
        status: row.status,
        answered_at: row.answered_at,
        task: TaskObject.build({
          title: row.task_title,
        }),
      })
    );
  }

  async findOne(by: { todoId: string; teamId: string; userId: string }) {
    const [row] = await db
      .select(
        "users_on_tasks.*",
        "tasks.title as task_title",
        "tasks.description as task_description"
      )
      .from("users_on_tasks")
      .where("users_on_tasks.user_id", by.userId)
      .andWhere("users_on_tasks.id", by.todoId)
      .orderBy("users_on_tasks.created_at", "desc")
      .innerJoin("tasks", (query) => {
        query
          .on("tasks.id", "=", "users_on_tasks.task_id")
          .andOn("tasks.team_id", "=", db.raw("?", [by.teamId]));
      });
    if (!row) {
      return null;
    }
    return TodoObject.build({
      id: row.id,
      status: row.status,
      description: row.description,
      answered_at: row.answered_at,
      task: TaskObject.build({
        title: row.task_title,
        description: row.task_description,
      }),
    });
  }
}
