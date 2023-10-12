import { AnswerModel, TaskModel } from "@/internal/models";
import { TaskRepository } from "@/internal/repositories";
import { db } from "@/libs/knex";
import crypto from "node:crypto";

export class Repository implements TaskRepository.Repository {
  async create(task1: TaskModel.Model, answers: AnswerModel.Model[]) {
    return db.transaction(async (trx) => {
      const [task2] = await trx
        .insert({
          id: crypto.randomUUID(),
          owner_id: task1.ownerId,
          team_id: task1.teamId,
          title: task1.title,
          description: task1.description,
          status: task1.status,
          created_at: new Date(),
        })
        .into("tasks")
        .returning("*");
      await Promise.all([
        answers.map((answer) =>
          trx
            .insert({
              id: crypto.randomUUID(),
              user_id: answer.userId,
              task_id: task2.id,
              status: answer.status,
            })
            .into("users_on_tasks")
        ),
      ]);
      return TaskModel.build({
        id: task2.id,
        ownerId: task2.owner_id,
        teamId: task2.team_id,
        title: task2.title,
        description: task2.description,
        status: task2.status,
      });
    });
  }
}
