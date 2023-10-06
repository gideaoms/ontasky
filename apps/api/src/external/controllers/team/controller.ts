import { Service } from "@/core/services/team/service";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { Queries } from "@/external/module";
import { isError } from "@/utils";
import { Factories } from "@/external/module";

const teamQuery = new Queries.Team.Query();
const service = new Service(Factories.Providers.Session.Provider, teamQuery);

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
