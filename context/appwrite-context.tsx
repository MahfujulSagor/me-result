"use client";

import { account } from "@/appwrite/appwrite-client";
import { userSchema } from "@/lib/userSchema";
import { Models } from "appwrite";
import { useRouter } from "next/navigation";
import React, { createContext, ReactNode, useContext } from "react";

type AppwriteContextType = {
  signUp: (data: {
    email: string;
    username: string;
    password: string;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  session: Models.Session | null;
  academic_session: string | null;
  loading: boolean;
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
  const router = useRouter();

  const [session, setSession] = React.useState<Models.Session | null>(null);
  const [loading, setLoading] = React.useState(true);

  const [academic_session, setAcademicSession] = React.useState<string | null>(
    null
  );

  const getSession = async (): Promise<Models.Session | null> => {
    try {
      const session = await account.getSession("current");
      setSession(session);

      const user = await account.get(); //? pulls preferences
      setAcademicSession(user.prefs?.academic_session || null);

      return session;
    } catch (error) {
      console.error("Error getting session", error);
      setSession(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getSession(); //? fetch once on mount
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    if (!email || !password) {
      console.error("Missing credentials");
      return;
    }

    try {
      await createSession(email, password);
      await getSession(); //? refresh context
      router.push("/result-portal");
    } catch (error) {
      console.error("Error logging in. Please check your credentials.", error);
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

    const result = userSchema.safeParse({
      email: email.trim().toLowerCase(),
      username: username.trim().toUpperCase(),
      password,
    });

    if (!result.success) {
      console.error("Validation failed", result.error.errors);
      return;
    }

    try {
      const response = await fetch("/api/v1/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          username: username.trim().toUpperCase(),
          password,
        }),
      });

      if (!response.ok) {
        console.error("Failed to create user account", response.statusText);
        return;
      }

      const { academic_session } = await response.json();

      await createSession(email, password);
      await getSession(); //? refresh context

      setAcademicSession(academic_session);

      //? persist in Appwrite prefs
      await account.updatePrefs({ academic_session });
    } catch (error) {
      console.error("Error creating account", error);
    } finally {
      router.push("/result-portal");
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await account.deleteSession("current");
      setSession(null);
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <AppwriteContext.Provider
      value={{ signUp, login, logout, academic_session, session, loading }}
    >
      {children}
    </AppwriteContext.Provider>
  );
};
