import { UserModel } from '@/core/models/index.js';
import { UserQuery } from '@/core/queries/index.js';
import { db } from '@/libs/knex.js';

export class Query implements UserQuery.Query {
  async findMany(teamId: string) {
    const result = await db
      .select('users.*')
      .from('users')
      .innerJoin('users_on_teams', (query) => {
        query
          .on('users_on_teams.user_id', '=', 'users.id')
          .andOn('users_on_teams.team_id', '=', db.raw('?', [teamId]));
      });
    return result.map((row) =>
      UserModel.json({ id: row.id, email: row.email })
    );
  }
}
