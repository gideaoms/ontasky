import crypto from "node:crypto";
import { DateTime } from "luxon";
import {
  BaseModel,
  BelongsTo,
  beforeCreate,
  belongsTo,
  column,
} from "@clark/orm";
import * as TeamEntity from "../team";

export class Entity extends BaseModel {
  public static table = "users_on_teams";

  @column({ isPrimary: true })
  public id!: string;

  @column({ columnName: "user_id" })
  public userId!: string;

  @column({ columnName: "team_id" })
  public teamId!: string;

  @column()
  public roles!: string[];

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime;

  @column.dateTime({ autoUpdate: true })
  public updatedAt!: DateTime;

  @beforeCreate()
  public static setId(team: Entity) {
    team.id = crypto.randomUUID();
  }

  @belongsTo(() => TeamEntity.Entity, { foreignKey: "id" })
  public team!: BelongsTo<typeof TeamEntity.Entity>;
}
