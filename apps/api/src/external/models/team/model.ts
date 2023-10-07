import crypto from "node:crypto";
import { DateTime } from "luxon";
import { BaseModel, beforeCreate, column } from "@clark/orm";

export class Model extends BaseModel {
  public static table = "teams";

  @column({ isPrimary: true })
  public id!: string;

  @column()
  public name!: string;

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime;

  @column.dateTime({ autoUpdate: true })
  public updatedAt!: DateTime;

  @beforeCreate()
  public static setId(team: Model) {
    team.id = crypto.randomUUID();
  }
}
