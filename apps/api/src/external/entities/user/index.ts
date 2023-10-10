import crypto from "node:crypto";
import { DateTime } from "luxon";
import { BaseModel, beforeCreate, column } from "@clark/orm";

export class Entity extends BaseModel {
  public static table = "users";

  @column({ isPrimary: true })
  public id!: string;

  @column()
  public email!: string;

  @column()
  public password!: string;

  @column({ columnName: "is_activated_email" })
  public isActivatedEmail!: string;

  @column({ columnName: "validation_code" })
  public validationCode!: string;

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime;

  @column.dateTime({ autoUpdate: true })
  public updatedAt!: DateTime;

  @beforeCreate()
  public static setId(team: Entity) {
    team.id = crypto.randomUUID();
  }
}
