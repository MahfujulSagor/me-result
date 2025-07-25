"use client";
import { useAppwrite } from "@/context/appwrite-context";
import { Models } from "appwrite";
import React from "react";

export default function Home() {
  const { getSession } = useAppwrite();
  const [session, setSession] = React.useState<Models.Session | null>(null);

  React.useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSession();
        setSession(session);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSession();
  }, [getSession]);

  return (
    <div className="">
      <h1>{session ? `Welcome back, ${session.userId}!` : "Please log in."}</h1>
    </div>
  );
}
