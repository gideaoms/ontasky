"use client";

import { Loading } from "@/components/atoms/loading";
import { SessionContext } from "@/external/contexts";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function Layout(props: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { startSession, user } = SessionContext.useContext();
  const router = useRouter();

  useEffect(function () {
    if (user) {
      setIsLoading(false);
      return;
    }
    startSession({
      onSuccess() {
        router.replace("/");
      },
      onError() {
        setIsLoading(false);
      },
    });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return <main className="antialiased">{props.children}</main>;
}
