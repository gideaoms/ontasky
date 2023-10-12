import { RoleModel, TeamModel, UserModel } from "@/internal/models";
import { UserRepository } from "@/internal/repositories";
import { db } from "@/libs/knex";
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

  async create(
    user: UserModel.Model,
    team?: TeamModel.Model,
    role?: RoleModel.Model
  ) {
    if (team && role) {
      return db.transaction(async (trx) => {
        const [row] = await trx
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
        await trx
          .insert({
            id: crypto.randomUUID(),
            user_id: row.id,
            team_id: team.id,
            role: role.name,
            created_at: new Date(),
          })
          .into("users_on_teams");
        return UserModel.build({
          id: row.id,
          email: row.email,
          password: row.password,
          isEmailActivated: row.is_email_activated,
        });
      });
    }
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
    });
  }

  async update(user: UserModel.Model) {
    const [row] = await db
      .table("users")
      .update({
        password: user.password,
        validation_code: user.validationCode || null,
        updated_at: new Date(),
      })
      .where("id", user.id)
      .returning("*");
    return UserModel.build({
      id: row.id,
      email: row.email,
      password: row.password,
      isEmailActivated: row.is_email_activated,
    });
  }
}
