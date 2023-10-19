import { UseCase } from "@/core/services/user/find-team/index.js";
import { SessionProvider } from "@/external/factories/providers/index.js";
import { isError } from "@/utils.js";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

const userCase = new UseCase(SessionProvider.Provider);

export default async function controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/users/:user_id/teams/:team_id",
    method: "GET",
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      params: Type.Object({
        user_id: Type.String({ format: "uuid" }),
        team_id: Type.String({ format: "uuid" }),
      }),
    },
    async handler(request, replay) {
      const { authorization } = request.headers;
      const { team_id } = request.params;
      const result = await userCase.exec(authorization, team_id);
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });
}
