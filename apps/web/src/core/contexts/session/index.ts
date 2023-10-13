import { TeamModel, UserModel } from "@/core/models";
import { SessionRepository } from "@/core/repositories";

export type Props = {
  user: UserModel.Model | null;
  setUser(user: UserModel.Model): void;
  sessionRepository: SessionRepository.Repository;
  signOut(): void;
  startSession: (props: { onSuccess: () => void; onError: () => void }) => void;
  team: TeamModel.Model | null;
  setTeam(team: TeamModel.Model): void;
};
