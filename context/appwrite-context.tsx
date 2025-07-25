"use client";

import { account } from "@/appwrite/appwrite-client";
import { ID, Models } from "appwrite";
// import { useRouter } from "next/navigation";
import React, { createContext, ReactNode, useContext } from "react";

type AppwriteContextType = {
  signUp: (data: {
    email: string;
    username: string;
    password: string;
  }) => Promise<void>;
  getSession: () => Promise<Models.Session | null>;
};

const AppwriteContext = createContext<AppwriteContextType | null>(null);

export const useAppwrite = () => {
  const context = useContext(AppwriteContext);
  if (!context) {
    throw new Error("useAppwrite must be used within an AppwriteProvider");
  }
  return context;
};

const createSession = async (
  email: string,
  password: string
): Promise<void | null> => {
  if (!email || !password) {
    console.error("Missing credentials");
    return null;
  }

  try {
    const session = await account.createEmailPasswordSession(email, password);
    console.log("Created session", session);
  } catch (error) {
    console.error("Error creating session", error);
  }
};

export const AppwriteProvider = ({ children }: { children: ReactNode }) => {
  // const router = useRouter();

  const getSession = async (): Promise<Models.Session | null> => {
    try {
      const session = await account.getSession("current");
      return session;
    } catch (error) {
      console.error("Error getting session", error);
      return null;
    }
  };

  const signUp = async ({
    email,
    username,
    password,
  }: {
    email: string;
    username: string;
    password: string;
  }): Promise<void> => {
    if (!email || !username || !password) {
      console.error("Missing credentials");
      return;
    }

    try {
      const user = await account.create(ID.unique(), email, password, username);
      console.log("Created user", user);

      await createSession(email, password);
    } catch (error) {
      console.error("Error creating account", error);
    }
  };

  return (
    <AppwriteContext.Provider value={{ signUp, getSession }}>
      {children}
    </AppwriteContext.Provider>
  );
};
