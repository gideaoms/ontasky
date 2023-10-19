import { AnswerModel, TaskModel, UserModel } from "@/core/models/index.js";
import { TodoQuery } from "@/core/queries/index.js";
import { db } from "@/libs/knex.js";

export class Query implements TodoQuery.Query {
  async findMany(teamId: string, userId: string) {
    const rows = await db
      .select(
        "users_on_tasks.*",
        "tasks.title as task_title",
        "users.email as owner_email"
      )
      .from("users_on_tasks")
      .where("users_on_tasks.user_id", userId)
      .orderBy("users_on_tasks.created_at", "desc")
      .innerJoin("tasks", (query) => {
        query
          .on("tasks.id", "=", "users_on_tasks.task_id")
          .andOn("tasks.team_id", "=", db.raw("?", [teamId]));
      })
      .innerJoin("users", (query) => {
        query.on("users.id", "=", "tasks.owner_id");
      });
    return rows.map((row) =>
      AnswerModel.toJson({
        id: row.id,
        status: row.status,
        answered_at: row.answered_at ?? undefined,
        task: TaskModel.toJson({
          title: row.task_title,
          owner: UserModel.json({
            email: row.owner_email,
          }),
        }),
      })
    );
  }

  async findOne(by: { todoId: string; teamId: string; userId: string }) {
    const [row] = await db
      .select(
        "users_on_tasks.*",
        "tasks.title as task_title",
        "tasks.description as task_description",
        "users.id as owner_id",
        "users.email as owner_email"
      )
      .from("users_on_tasks")
      .where("users_on_tasks.user_id", by.userId)
      .andWhere("users_on_tasks.id", by.todoId)
      .orderBy("users_on_tasks.created_at", "desc")
      .innerJoin("tasks", (query) => {
        query
          .on("tasks.id", "=", "users_on_tasks.task_id")
          .andOn("tasks.team_id", "=", db.raw("?", [by.teamId]));
      })
      .innerJoin("users", (query) => {
        query.on("users.id", "=", "tasks.owner_id");
      });
    if (!row) {
      return null;
    }
    return AnswerModel.toJson({
      id: row.id,
      status: row.status,
      description: row.description ?? undefined,
      answered_at: row.answered_at ?? undefined,
      task: TaskModel.toJson({
        title: row.task_title,
        description: row.task_description,
        owner: UserModel.json({
          id: row.owner_id,
          email: row.owner_email,
        }),
      }),
    });
  }
}
