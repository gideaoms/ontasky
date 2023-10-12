import { AnswerModel } from "@/internal/models";
import { AnswerRepository } from "@/internal/repositories";
import { db } from "@/libs/knex";

export class Repository implements AnswerRepository.Repository {
  async findByPk(userId: string, taskId: string) {
    const [row] = await db
      .from("users_on_tasks")
      .where("user_id", userId)
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

  async update(answer: AnswerModel.Model) {
    const [row] = await db
      .table("users_on_tasks")
      .update({
        description: answer.description,
        status: answer.status,
        answered_at: answer.answeredAt,
        updated_at: new Date(),
      })
      .where("user_id", answer.userId)
      .andWhere("task_id", answer.taskId)
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
