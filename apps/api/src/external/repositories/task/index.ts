import { TodoModel, TaskModel } from "@/core/models";
import { TaskRepository } from "@/core/repositories";
import { db } from "@/libs/knex";
import crypto from "node:crypto";

export class Repository implements TaskRepository.Repository {
  async create(task1: TaskModel.Model, answers1: TodoModel.Model[]) {
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
      const promises = answers1.map((answer) =>
        trx
          .insert({
            id: crypto.randomUUID(),
            user_id: answer.userId,
            task_id: task2.id,
            status: answer.status,
            created_at: new Date(),
          })
          .into("users_on_tasks")
      );
      const answers2 = await Promise.allSettled(promises);
      const rejected = answers2.find(
        (answer) => answer.status === "rejected"
      ) as PromiseRejectedResult | undefined;
      if (rejected) {
        throw new Error(rejected.reason);
      }
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

  async findById(taskId: string) {
    const [task] = await db.from("tasks").where("id", taskId);
    if (!task) {
      return null;
    }
    return TaskModel.build({
      id: task.id,
      ownerId: task.owner_id,
      teamId: task.team_id,
      title: task.title,
      description: task.description,
      status: task.status,
    });
  }

  async update(
    task1: TaskModel.Model,
    addedAnswers: TodoModel.Model[],
    removedAnswers: TodoModel.Model[]
  ) {
    return db.transaction(async (trx) => {
      const [task2] = await trx
        .table("tasks")
        .update({
          title: task1.title,
          description: task1.description,
          updated_at: new Date(),
        })
        .where("id", task1.id)
        .returning("*");
      const promises1 = addedAnswers.map((answer) =>
        trx
          .insert({
            id: crypto.randomUUID(),
            user_id: answer.userId,
            task_id: task2.id,
            status: answer.status,
            created_at: new Date(),
          })
          .into("users_on_tasks")
      );
      const answers1 = await Promise.allSettled(promises1);
      const rejected1 = answers1.find(
        (answer) => answer.status === "rejected"
      ) as PromiseRejectedResult | undefined;
      if (rejected1) {
        throw new Error(rejected1.reason);
      }
      const promises2 = removedAnswers.map((answer) =>
        trx.table("users_on_tasks").delete().where("id", answer.id)
      );
      const answers2 = await Promise.allSettled(promises2);
      const rejected2 = answers2.find(
        (answer) => answer.status === "rejected"
      ) as PromiseRejectedResult | undefined;
      if (rejected2) {
        throw new Error(rejected2.reason);
      }
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
