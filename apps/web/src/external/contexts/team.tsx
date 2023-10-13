"use client";

import { TeamContext } from "@/core/contexts/mod";
import { TeamRepository } from "@/external/repositories/mod";
import React from "react";

const Context = React.createContext<TeamContext.Props>(null!);
const teamRepository = new TeamRepository.Repository();

export function Provider(props: { children: React.ReactNode }) {
  return (
    <Context.Provider value={{ teamRepository }}>
      {props.children}
    </Context.Provider>
  );
}

export function useContext() {
  return React.useContext(Context);
}
