import { TeamModel, UserModel } from "@/core/models/index.js";
import { UserRepository } from "@/core/repositories/index.js";
import { db } from "@/libs/knex.js";
import crypto from "node:crypto";

export class Repository implements UserRepository.Repository {
  async findById(userId: string) {
    const [row] = await db.from("users").where("id", userId);
    if (!row) {
      return null;
    }
    return UserModel.build({
      id: row.id,
      email: row.email,
      isEmailActivated: row.is_email_activated,
      validationCode: row.validation_code,
    });
  }

  async findByEmail(email: string) {
    const [row] = await db.from("users").where("email", email);
    if (!row) {
      return null;
    }
    return UserModel.build({
      id: row.id,
      email: row.email,
      password: row.password,
      isEmailActivated: row.is_email_activated,
      validationCode: row.validation_code,
    });
  }

  async create(user1: UserModel.Model) {
    if (user1.team) {
      const team = user1.team ?? TeamModel.empty();
      return db.transaction(async function (trx) {
        const [user2] = await trx
          .insert({
            id: crypto.randomUUID(),
            email: user1.email,
            password: user1.password,
            is_email_activated: user1.isEmailActivated,
            validation_code: user1.validationCode,
            created_at: new Date(),
          })
          .into("users")
          .returning("*");
        await trx
          .insert({
            id: crypto.randomUUID(),
            user_id: user2.id,
            team_id: team.id,
            role: team.role,
            created_at: new Date(),
          })
          .into("users_on_teams");
        return UserModel.build({
          id: user2.id,
          email: user2.email,
          password: user2.password,
          isEmailActivated: user2.is_email_activated,
          validationCode: user2.validation_code,
        });
      });
    }
    const [row] = await db
      .insert({
        id: crypto.randomUUID(),
        email: user1.email,
        password: user1.password,
        is_email_activated: user1.isEmailActivated,
        validation_code: user1.validationCode,
        created_at: new Date(),
      })
      .into("users")
      .returning("*");
    return UserModel.build({
      id: row.id,
      email: row.email,
      password: row.password,
      isEmailActivated: row.is_email_activated,
      validationCode: row.validation_code,
    });
  }

  async update(user: UserModel.Model) {
    const [row] = await db
      .table("users")
      .update({
        password: user.password,
        validation_code: user.validationCode ?? null,
        updated_at: new Date(),
        is_email_activated: user.isEmailActivated,
      })
      .where("id", user.id)
      .returning("*");
    return UserModel.build({
      id: row.id,
      email: row.email,
      password: row.password,
      isEmailActivated: row.is_email_activated,
      validationCode: row.validation_code,
    });
  }

  async joinTeam(user: UserModel.Model) {
    const team = user.team ?? TeamModel.empty();
    await db
      .insert({
        id: crypto.randomUUID(),
        user_id: user.id,
        team_id: team.id,
        role: team.role,
        created_at: new Date(),
      })
      .into("users_on_teams");
    const [row] = await db.from("users").where("id", user.id);
    return UserModel.build({
      id: row.id,
      email: row.email,
    });
  }

  async findOne(user1: UserModel.Model) {
    if (user1.team) {
      const team = user1.team ?? TeamModel.empty();
      const [user2] = await db
        .select("users.*")
        .from("users")
        .where({ "users.id": user1.id })
        .innerJoin("users_on_teams", function (query) {
          query
            .on("users_on_teams.user_id", "=", "users.id")
            .andOn("users_on_teams.team_id", "=", db.raw("?", [team.id]));
        });
      if (!user2) {
        return null;
      }
      return UserModel.build({
        id: user2.id,
        email: user2.email,
      });
    }
    const [user2] = await db.from("users").where({ id: user1.id }).limit(1);
    if (!user2) {
      return null;
    }
    return UserModel.build({
      id: user2.id,
      email: user2.email,
    });
  }
}
