"use client";

import { account } from "@/appwrite/appwrite-client";
import { generateAcademicSession } from "@/lib/generateAcademicSession";
import { generateEmailFromId } from "@/lib/generateEmailFromId";
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
  login: (id: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  session: Models.Session | null;
  academic_session: string | null;
  student_id: string | null;
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
): Promise<boolean> => {
  if (!email || !password) {
    console.error("Missing credentials");
    return false;
  }

  try {
    //? Create client side session in Appwrite
    await account.createEmailPasswordSession(email, password);

    //? Create server side session via API route
    const res = await fetch("/api/v1/session/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!res.ok) {
      console.error("Failed to log in via server session route");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Server session error:", error);
    return false;
  }
};

export const AppwriteProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [session, setSession] = React.useState<Models.Session | null>(null);
  const [loading, setLoading] = React.useState(true);

  const [academic_session, setAcademicSession] = React.useState<string | null>(
    null
  );
  const [student_id, setStudentId] = React.useState<string | null>(null);

  const getSession = async (): Promise<void> => {
    try {
      const session = await account.getSession("current");
      setSession(session);

      const user = await account.get(); //? pulls preferences
      setAcademicSession(user.prefs?.academic_session || null);
      setStudentId(user.prefs?.student_id || null);
    } catch (error) {
      console.error("Error getting session", error);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    getSession();

    const handleFocus = () => getSession();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const login = async (id: string, password: string): Promise<void> => {
    if (!id || !password) {
      console.error("Missing credentials");
      return;
    }

    //? Generate email from ID
    const email = generateEmailFromId(id);

    try {
      const success = await createSession(email, password);
      if (!success) {
        console.error("Failed to create session");
        return;
      }

      const user = await account.get(); //? pulls preferences

      if (user.prefs?.student_id && user.prefs?.academic_session) {
        setStudentId(user.prefs?.student_id || null);
        setAcademicSession(user.prefs?.academic_session || null);
      } else {
        setStudentId(id);

        //? Generate academic session from ID
        const generatedAcademicSession = generateAcademicSession(id);
        setAcademicSession(generatedAcademicSession || null);

        //? persist in Appwrite prefs
        await account.updatePrefs({
          student_id: id,
          academic_session: generatedAcademicSession,
        });
      }
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
        credentials: "include",
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

      const { academic_session, student_id } = await response.json();

      const success = await createSession(email, password);
      if (!success) {
        console.error("Failed to create session after sign up");
        return;
      }

      setAcademicSession(academic_session);
      setStudentId(student_id);
      //? persist in Appwrite prefs
      await account.updatePrefs({ academic_session, student_id });

      await getSession(); //? refresh context
    } catch (error) {
      console.error("Error creating account", error);
    } finally {
      router.push("/result-portal");
    }
  };

  const logout = async (): Promise<void> => {
    try {
      //? Delete client side session in Appwrite
      await account.deleteSession("current");

      const res = await fetch("/api/v1/session/delete", {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Failed to delete session");
        return;
      }

      setSession(null);
      setAcademicSession(null);
      setStudentId(null);
      setLoading(true); //? reset loading state

      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <AppwriteContext.Provider
      value={{
        signUp,
        login,
        logout,
        academic_session,
        student_id,
        session,
        loading,
      }}
    >
      {children}
    </AppwriteContext.Provider>
  );
};
