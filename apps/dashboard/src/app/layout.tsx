import "@/globals.css";
import "@total-typescript/ts-reset";
import {
  SessionContext,
  TaskContext,
  TeamContext,
  UserContext,
  AnswerContext,
} from "@/external/contexts";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ontasky",
  description: "Manage tasks",
};

export default function Layout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionContext.Provider>
          <UserContext.Provider>
            <TeamContext.Provider>
              <AnswerContext.Provider>
                <TaskContext.Provider>{props.children}</TaskContext.Provider>
              </AnswerContext.Provider>
            </TeamContext.Provider>
          </UserContext.Provider>
        </SessionContext.Provider>
        <Toaster richColors />
      </body>
    </html>
  );
}
