import { RoleModel, TeamModel, UserModel } from "@/core/models";
import { UserObject } from "@/core/objects";
import { UserRepository } from "@/core/repositories";
import { api } from "@/external/libs/api";
import { isOkStatus } from "@/utils";
import { z } from "zod";

export class Repository implements UserRepository.Repository {
  async create(email: string, password: string) {
    const result = await api.post(
      "users",
      UserObject.build({
        email,
        password,
      })
    );
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
    const parsed = z
      .object({
        id: z.string(),
        email: z.string(),
      })
      .parse(result.data);
    return UserModel.build({
      id: parsed.id,
      email: parsed.email,
    });
  }

  async activate(email: string, validationCode: string) {
    const result = await api.put(
      "users/activate",
      UserObject.build({
        email,
        validation_code: validationCode,
      })
    );
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
    const parsed = z
      .object({
        id: z.string(),
        email: z.string(),
      })
      .parse(result.data);
    return UserModel.build({
      id: parsed.id,
      email: parsed.email,
    });
  }

  async findMany(teamId: string) {
    const result = await api.get("users", {
      params: UserObject.build({ team_id: teamId }),
    });
    const parsed = z
      .array(
        z.object({
          id: z.string(),
          email: z.string(),
        })
      )
      .parse(result.data);
    return parsed.map((user) =>
      UserModel.build({
        id: user.id,
        email: user.email,
      })
    );
  }

  async joinTeam(user: UserModel.Model) {
    const team = user.team ?? TeamModel.empty();
    const result = await api.post(
      `teams/${team.id}/users`,
      UserObject.build({
        email: user.email,
      })
    );
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
    const parsed = z
      .object({
        id: z.string(),
        email: z.string(),
      })
      .parse(result.data);
    return UserModel.build({
      id: parsed.id,
      email: parsed.email,
    });
  }

  async findTeam(user: UserModel.Model) {
    const team = user.team ?? TeamModel.empty();
    const result = await api.get(`users/${user.id}/teams/${team.id}`);
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
    const parsed = z
      .object({
        id: z.string(),
        name: z.string(),
        role: z.enum(["common", "admin"]),
      })
      .parse(result.data);
    return TeamModel.build({
      id: parsed.id,
      name: parsed.name,
      role: RoleModel.build(parsed.role),
    });
  }
}
