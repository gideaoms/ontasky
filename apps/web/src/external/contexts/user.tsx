"use client";

import { UserContext } from "@/core/contexts/mod";
import { UserRepository } from "@/external/repositories/mod";
import React from "react";

const Context = React.createContext<UserContext.Props>(null!);
const userRepository = new UserRepository.Repository();

export function Provider(props: { children: React.ReactNode }) {
  return (
    <Context.Provider value={{ userRepository }}>
      {props.children}
    </Context.Provider>
  );
}

export function useContext() {
  return React.useContext(Context);
}
