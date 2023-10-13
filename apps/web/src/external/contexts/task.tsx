"use client";

import { TaskContext } from "@/core/contexts/mod";
import { TaskRepository } from "@/external/repositories/mod";
import React from "react";

const Context = React.createContext<TaskContext.Props>(null!);
const taskRepository = new TaskRepository.Repository();

export function Provider(props: { children: React.ReactNode }) {
  return (
    <Context.Provider value={{ taskRepository }}>
      {props.children}
    </Context.Provider>
  );
}

export function useContext() {
  return React.useContext(Context);
}
