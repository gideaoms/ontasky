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

  async create(user: UserModel.Model) {
    const [row] = await db
      .insert({
        id: crypto.randomUUID(),
        email: user.email,
        password: user.password,
        is_email_activated: user.isEmailActivated,
        validation_code: user.validationCode,
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
        role: "common",
        created_at: new Date(),
      })
      .into("users_on_teams");
    const [row] = await db.from("users").where("id", user.id);
    return UserModel.build({
      id: row.id,
      email: row.email,
    });
  }
}
