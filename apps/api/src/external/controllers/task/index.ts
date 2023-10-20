import { SessionOnTeamProvider } from "@/external/factories/providers/index.js";
import { TaskQuery } from "@/external/factories/queries/index.js";
import {
  AnswerRepository,
  TaskRepository,
  UserOnTeamRepository,
} from "@/external/factories/repositories/index.js";
import { Service } from "@/core/services/task/index.js";
import { isError } from "@/utils.js";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

const service = new Service(
  SessionOnTeamProvider.Provider,
  UserOnTeamRepository.Repository,
  TaskRepository.Repository,
  AnswerRepository.Repository,
  TaskQuery.Query
);

export default async function controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/tasks",
    method: "POST",
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      body: Type.Object({
        team_id: Type.String({ format: "uuid" }),
        title: Type.String(),
        description: Type.String(),
        approvers: Type.Array(
          Type.Object({ id: Type.String({ format: "uuid" }) })
        ),
      }),
    },
    async handler(request, replay) {
      const { authorization } = request.headers;
      const { team_id, title, description, approvers } = request.body;
      const result = await service.create(
        authorization,
        team_id,
        title,
        description,
        approvers
      );
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/tasks/:task_id",
    method: "PUT",
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      params: Type.Object({
        task_id: Type.String({ format: "uuid" }),
      }),
      body: Type.Object({
        team_id: Type.String({ format: "uuid" }),
        title: Type.String(),
        description: Type.String(),
        approvers: Type.Array(
          Type.Object({ id: Type.String({ format: "uuid" }) })
        ),
      }),
    },
    async handler(request, replay) {
      const { authorization } = request.headers;
      const { task_id } = request.params;
      const { team_id, title, description, approvers } = request.body;
      const result = await service.update(
        authorization,
        team_id,
        task_id,
        title,
        description,
        approvers
      );
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/tasks",
    method: "GET",
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      querystring: Type.Object({
        team_id: Type.String({ format: "uuid" }),
      }),
    },
    async handler(request, replay) {
      const { authorization } = request.headers;
      const { team_id } = request.query;
      const result = await service.index(authorization, team_id);
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/tasks/:task_id",
    method: "GET",
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),

      params: Type.Object({
        task_id: Type.String({ format: "uuid" }),
      }),
      querystring: Type.Object({
        team_id: Type.String({ format: "uuid" }),
      }),
    },
    async handler(request, replay) {
      const { authorization } = request.headers;
      const { task_id } = request.params;
      const { team_id } = request.query;
      const result = await service.show(authorization, team_id, task_id);
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });
}
