import { UserModel } from "@/core/models";
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
}
