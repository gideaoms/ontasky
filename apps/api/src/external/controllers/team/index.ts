import { Service } from "@/core/services/team";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { TeamQuery } from "@/external/queries";
import { isError } from "@/utils";
import { SessionProvider } from "@/external/factories/providers";

const teamQuery = new TeamQuery.Query();
const service = new Service(SessionProvider.Provider, teamQuery);

export default async function controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/teams",
    method: "GET",
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
    },
    async handler(request, replay) {
      const { authorization } = request.headers;
      const result = await service.index(authorization);
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });
}
