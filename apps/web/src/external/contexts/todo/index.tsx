"use client";

import { TodoContext } from "@/core/contexts/mod";
import { TodoRepository } from "@/external/repositories/mod";
import React from "react";

const Context = React.createContext<TodoContext.Props>(null!);
const todoRepository = new TodoRepository.Repository();

export function Provider(props: { children: React.ReactNode }) {
  return (
    <Context.Provider value={{ todoRepository }}>
      {props.children}
    </Context.Provider>
  );
}

export function useContext() {
  return React.useContext(Context);
}
