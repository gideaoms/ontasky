import crypto from "node:crypto";
import { DateTime } from "luxon";
import { BaseModel, HasMany, beforeCreate, column, hasMany } from "@clark/orm";
import * as UserOnTeamEntity from "../user-on-team";

export class Entity extends BaseModel {
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
  public static setId(team: Entity) {
    team.id = crypto.randomUUID();
  }

  @hasMany(() => UserOnTeamEntity.Entity, { foreignKey: "teamId" })
  public userOnTeam!: HasMany<typeof UserOnTeamEntity.Entity>;
}
