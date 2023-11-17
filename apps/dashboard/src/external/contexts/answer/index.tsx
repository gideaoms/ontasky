"use client";

import { AnswerContext } from "@/core/contexts";
import { AnswerRepository } from "@/external/repositories";
import React from "react";

const Context = React.createContext<AnswerContext.Props>(null!);
const answerRepository = new AnswerRepository.Repository();

export function Provider(props: { children: React.ReactNode }) {
  return (
    <Context.Provider value={{ answerRepository }}>
      {props.children}
    </Context.Provider>
  );
}

export function useContext() {
  return React.useContext(Context);
}
