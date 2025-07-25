"use client";
import { useAppwrite } from "@/context/appwrite-context";
import React from "react";

export default function Home() {
  const { session, loading } = useAppwrite();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      hello world
      <h1>{session ? `Welcome back, ${session.userId}!` : "Please log in."}</h1>
    </div>
  );
}
