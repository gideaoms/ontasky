"use client";

import { COOKIE_NAME } from "@/constants";
import { SessionContext } from "@/core/contexts";
import { TeamModel, UserModel } from "@/core/models";
import { SessionRepository } from "@/external/repositories";
import { isError } from "@/utils";
import { useRouter } from "next/navigation";
import React from "react";
import Cookie from "universal-cookie";

const cookie = new Cookie();
const sessionRepository = new SessionRepository.Repository();

const Context = React.createContext<SessionContext.Props>(null!);

export function Provider(props: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserModel.Model | null>(null);
  const [team, setTeam] = React.useState<TeamModel.Model | null>(null);
  const router = useRouter();

  async function startSession(props: {
    onSuccess: () => void;
    onError: () => void;
  }) {
    const token = cookie.get(COOKIE_NAME);
    if (!token) {
      props.onError();
      return;
    }
    const user = await sessionRepository.findOne(token);
    if (isError(user)) {
      cookie.remove(COOKIE_NAME);
      props.onError();
      return;
    }
    props.onSuccess();
    setUser(user);
  }

  function signOut() {
    cookie.remove(COOKIE_NAME);
    setUser(null);
    router.replace("/sign-in");
  }

  return (
    <Context.Provider
      value={{
        user,
        sessionRepository,
        setUser,
        signOut,
        startSession,
        team,
        setTeam,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}

export function useContext() {
  return React.useContext(Context);
}
