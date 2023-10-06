import { Models } from "@/core/module";

export type Repository = {
  findById(userId: string): Promise<Models.User.Model | null>;
  findByEmail(email: string): Promise<Models.User.Model | null>;
};
