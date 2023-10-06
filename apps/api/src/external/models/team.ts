import { DateTime } from "luxon";
import { BaseModel, column } from "@clark/orm";
import Database from "@clark/database";

class Team extends BaseModel {
  public static table = "teams";

  @column({ isPrimary: true, serializeAs: null })
  public id!: number;

  @column()
  public name!: string;

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime;
}

const teams = await Team.all();
console.log({ teams });

await Database.manager.closeAll();
