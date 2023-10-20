import { AnswerModel, TaskModel } from "@/core/models/index.js";
import { AnswerRepository } from "@/core/repositories/index.js";
import { db } from "@/libs/knex.js";

export class Repository implements AnswerRepository.Repository {
  async findById(answerId: string) {
    const [row] = await db.from("users_on_tasks").where("id", answerId);
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

  async update(answer: AnswerModel.Model) {
    return db.transaction(async (trx) => {
      const [row] = await trx
        .table("users_on_tasks")
        .update({
          description: answer.description,
          status: answer.status,
          answered_at: answer.answeredAt,
          updated_at: new Date(),
        })
        .where("id", answer.id)
        .returning("*");
      const usersOnTasks = await trx
        .select("status")
        .from("users_on_tasks")
        .where("task_id", answer.taskId);
      const answers = usersOnTasks.map((userOnTask) =>
        AnswerModel.build({
          status: userOnTask.status,
        })
      );
      const status = TaskModel.getStatusByAnswers(answers);
      await trx
        .table("tasks")
        .update({
          status,
        })
        .where("id", answer.taskId);
      return AnswerModel.build({
        id: row.id,
        userId: row.user_id,
        taskId: row.task_id,
        description: row.description,
        status: row.status,
        answeredAt: row.answered_at,
      });
    });
  }
}
