import { SessionOnTeamProvider } from "@/external/providers";
import * as TokenProvider from "@/external/factories/providers/token";

export const Provider = new SessionOnTeamProvider.Provider(
  TokenProvider.Provider
);
