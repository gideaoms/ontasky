import { AnswerModel } from "@/core/models/index.js";
import { TodoRepository } from "@/core/repositories/index.js";
import { db } from "@/libs/knex.js";

export class Repository implements TodoRepository.Repository {
  async findById(todoId: string) {
    const [row] = await db.from("users_on_tasks").where("id", todoId);
    if (!row) {
      return null;
    }
    return AnswerModel.build({
      id: row.id,
      userId: row.user_id,
      taskId: row.task_id,
      description: row.description,
      status: row.status,
      answeredAt: row.answered_at,
    });
  }

  async findByPk(approverId: string, taskId: string) {
    const [row] = await db
      .from("users_on_tasks")
      .where("user_id", approverId)
      .andWhere("task_id", taskId);
    if (!row) {
      return null;
    }
    return AnswerModel.build({
      id: row.id,
      userId: row.user_id,
      taskId: row.task_id,
      description: row.description,
      status: row.status,
      answeredAt: row.answered_at,
    });
  }

  async findManyNotIn(taskId: string, approvers: Array<{ id: string }>) {
    const rows = await db
      .from("users_on_tasks")
      .where("task_id", taskId)
      .whereNotIn(
        "user_id",
        approvers.map((approver) => approver.id)
      );
    return rows.map((row) =>
      AnswerModel.build({
        id: row.id,
        userId: row.user_id,
        taskId: row.task_id,
        description: row.description,
        status: row.status,
        answeredAt: row.answered_at,
      })
    );
  }

  async update(todo: AnswerModel.Model) {
    const [row] = await db
      .table("users_on_tasks")
      .update({
        description: todo.description,
        status: todo.status,
        answered_at: todo.answeredAt,
        updated_at: new Date(),
      })
      .where("id", todo.id)
      .returning("*");
    return AnswerModel.build({
      id: row.id,
      userId: row.user_id,
      taskId: row.task_id,
      description: row.description,
      status: row.status,
      answeredAt: row.answered_at,
    });
  }
}
