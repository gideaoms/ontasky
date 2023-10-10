import { UserModel } from "@/core/models";
import { UserRepository } from "@/core/repositories";
import { db } from "@/libs/knex";

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
    });
  }
}
