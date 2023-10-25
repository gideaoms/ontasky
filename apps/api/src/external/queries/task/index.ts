import { AnswerModel, TaskModel, UserModel } from '@/core/models/index.js';
import { TaskQuery } from '@/core/queries/index.js';
import { db } from '@/libs/knex.js';

export class Query implements TaskQuery.Query {
  async findMany(teamId: string, userId: string) {
    const tasks = await db.union([
      db.select(
        'tasks.id',
        'tasks.status',
        'tasks.title',
        'tasks.created_at',
        'users.email as owner_email',
      )
        .from('tasks')
        .innerJoin('users_on_tasks', query => {
          query.on('users_on_tasks.task_id', '=', 'tasks.id');
        })
        .innerJoin('users', query => {
          query.on('users.id', '=', 'tasks.owner_id');
        })
        .where('tasks.team_id', teamId),
      db.select(
        'tasks.id',
        'tasks.status',
        'tasks.title',
        'tasks.created_at',
        'users.email as owner_email',
      )
        .from('tasks')
        .innerJoin('users', query => {
          query.on('users.id', '=', 'tasks.owner_id');
        })
        .where('tasks.owner_id', userId)
        .where('tasks.team_id', teamId),
    ])
      .orderBy('created_at', 'desc');
    return tasks.map((task) =>
      TaskModel.json({
        id: task.id,
        title: task.title,
        status: task.status,
        owner: UserModel.json({
          email: task.owner_email,
        }),
      })
    );
  }

  async findOne(taskId: string, teamId: string, userId: string) {
    const tasks = await db.union([
      db
        .select(
          'tasks.id',
          'tasks.title',
          'tasks.description',
          'tasks.owner_id',
          'owner.email as owner_email',
          'approvers.id as approver_id',
          'approvers.email as approver_email',
          'users_on_tasks.id as answer_id',
          'users_on_tasks.description as answer_description',
          'users_on_tasks.status as answer_status',
        )
        .from('tasks')
        .where('tasks.id', taskId)
        .where('tasks.owner_id', userId)
        .where('tasks.team_id', teamId)
        .innerJoin('users_on_tasks', query => {
          query.on('users_on_tasks.task_id', '=', 'tasks.id');
        })
        .innerJoin('users as approvers', query => {
          query.on('approvers.id', '=', 'users_on_tasks.user_id');
        })
        .innerJoin('users as owner', query => {
          query.on('owner.id', '=', 'tasks.owner_id');
        }),
      db
        .select(
          'tasks.id',
          'tasks.title',
          'tasks.description',
          'tasks.owner_id',
          'owner.email as owner_email',
          'approvers.id as approver_id',
          'approvers.email as approver_email',
          'users_on_tasks.id as answer_id',
          'users_on_tasks.description as answer_description',
          'users_on_tasks.status as answer_status',
        )
        .from('tasks')
        .where('tasks.id', taskId)
        .where('tasks.team_id', teamId)
        .innerJoin('users_on_tasks', query => {
          query.on('users_on_tasks.task_id', '=', 'tasks.id');
        })
        .innerJoin('users as approvers', query => {
          query.on('approvers.id', '=', 'users_on_tasks.user_id');
        })
        .innerJoin('users as owner', query => {
          query.on('owner.id', '=', 'tasks.owner_id');
        }),
    ]);
    if (tasks.length === 0) {
      return null;
    }
    const [task] = tasks;
    return TaskModel.json({
      id: task.id,
      owner_id: task.owner_id,
      title: task.title,
      description: task.description,
      owner: UserModel.json({
        id: task.owner_id,
        email: task.owner_email,
      }),
      approvers: tasks
        .map((task) =>
          UserModel.json({
            id: task.approver_id,
          })
        )
        .filter((approver) => approver.id),
      answers: tasks
        .map((task) =>
          AnswerModel.json({
            id: task.answer_id,
            description: task.answer_description ?? undefined,
            status: task.answer_status,
            approver: UserModel.json({
              id: task.approver_id,
              email: task.approver_email,
            }),
          })
        )
        .filter((answer) => answer.id),
    });
  }
}
