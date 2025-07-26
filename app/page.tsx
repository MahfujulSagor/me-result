"use client";
import { NavUser } from "@/components/nav-user";
import StudentInfoDisplay from "@/components/result";
import React from "react";

export default function Home() {
  return (
    <div className="">
      hello world
      <div>
        <NavUser
          user={{ student_id: "ME24020", academic_session: "2023-2024" }}
        />
      </div>
      <StudentInfoDisplay />
    </div>
  );
}
