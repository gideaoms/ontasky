import { RoleModel, TeamModel } from "@/core/models";
import { TeamRepository } from "@/core/repositories/mod";
import { api } from "@/external/libs/api";
import { TeamObject } from "@/core/objects";
import { isOkStatus } from "@/utils";
import { z } from "zod";

export class Repository implements TeamRepository.Repository {
  async findMany() {
    const result = await api.get("teams");
    const parsed = z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          role: z.enum(["common", "admin"]),
        })
      )
      .parse(result.data);
    return parsed.map((team) =>
      TeamModel.build({
        id: team.id,
        name: team.name,
        role: RoleModel.build(team.role),
      })
    );
  }

  async findById(teamId: string) {
    const result = await api.get(`teams/${teamId}`);
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
    const parsed = z
      .object({
        id: z.string(),
        name: z.string(),
      })
      .parse(result.data);
    return TeamModel.build({
      id: parsed.id,
      name: parsed.name,
    });
  }

  async update(team: TeamModel.Model) {
    const result = await api.put(
      `teams/${team.id}`,
      TeamObject.build({
        id: team.id,
        name: team.name,
      })
    );
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
    const parsed = z
      .object({
        id: z.string(),
        name: z.string(),
      })
      .parse(result.data);
    return TeamModel.build({
      id: parsed.id,
      name: parsed.name,
    });
  }

  async create(team: TeamModel.Model) {
    const result = await api.post(
      "teams",
      TeamObject.build({
        id: team.id,
        name: team.name,
      })
    );
    if (!isOkStatus(result.status)) {
      const parsed = z.object({ message: z.string() }).parse(result.data);
      return new Error(parsed.message);
    }
    const parsed = z
      .object({
        id: z.string(),
        name: z.string(),
      })
      .parse(result.data);
    return TeamModel.build({
      id: parsed.id,
      name: parsed.name,
    });
  }
}
