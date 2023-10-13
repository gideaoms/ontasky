import { UserModel } from "@/core/models";
import { UserObject } from "@/core/objects";
import { SessionRepository } from "@/core/repositories/mod";
import { api, setToken } from "@/external/libs/api";
import { isOkStatus } from "@/utils";
import { z } from "zod";
import Cookie from "universal-cookie";
import { COOKIE_NAME } from "@/constants";

const cookie = new Cookie();

export class Repository implements SessionRepository.Repository {
  async create(email: string, password: string) {
    const result = await api.post(
      "sessions",
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
        token: z.string(),
      })
      .parse(result.data);
    const user = UserModel.build({
      id: parsed.id,
      email: parsed.email,
      token: parsed.token,
    });
    setToken(user);
    cookie.set(COOKIE_NAME, user.token);
    return user;
  }

  async findOne(token: string) {
    const user = UserModel.build({ token });
    setToken(user);
    const result = await api.get("sessions");
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
    const parsed = z
      .object({
        id: z.string(),
        email: z.string(),
        token: z.string(),
      })
      .parse(result.data);
    return UserModel.build({
      id: parsed.id,
      email: parsed.email,
      token: parsed.token,
    });
  }
}
