import { SessionOnTeamProvider } from "@/external/providers/index.js";
import * as TokenProvider from "@/external/factories/providers/token/index.js";

export const Provider = new SessionOnTeamProvider.Provider(
  TokenProvider.Provider
);
