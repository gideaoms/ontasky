import { TaskModel } from "@/core/models";
import { z } from "zod";

export function fromObject(object: unknown) {
  const parsed = z
    .object({
      id: z.string(),
      card_id: z.string(),
      owner_id: z.string(),
      description: z.string(),
      status: z.enum(["awaiting", "approved", "disapproved"]),
    })
    .parse(object);
  return TaskModel.build({
    id: parsed.id,
    ownerId: parsed.owner_id,
    description: parsed.description,
    status: parsed.status,
  });
}

export function toObject(task: TaskModel.Model) {
  return {
    id: task.id,
    description: task.description,
  };
}
