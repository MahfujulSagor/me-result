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
  adminId: string | null;
  adminRole: string | null;
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

//* Create a session using email and password
const createSession = async (
  email: string,
  password: string
): Promise<boolean> => {
  if (!email || !password) {
    console.error("Missing credentials");
    return false;
  }

  try {
    //? Check if session exists
    const currentSession = await account.getSession("current");
    if (currentSession) {
      //? Log out existing session
      await account.deleteSession("current");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    //? If error, assume no session — do nothing
    console.warn("No active session found");
  }

  try {
    //? Create client side session in Appwrite
    await account.createEmailPasswordSession(email, password);

    const jwt = await account.createJWT();

    if (!jwt) {
      console.error("Failed to create JWT session");
      return false;
    }

    //? Create server side session with JWT
    const res = await fetch("/api/v1/session/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jwt: jwt.jwt }),
      credentials: "include",
    });

    if (!res.ok) {
      console.error("Failed to create JWT session");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Server JWT session error:", error);
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
  const [adminId, setAdminId] = React.useState<string | null>(null);
  const [adminRole, setAdminRole] = React.useState<string | null>(null);

  //* Fetch current session and user preferences
  const getSession = async (): Promise<void> => {
    try {
      const session = await account.getSession("current");
      setSession(session);

      const user = await account.get(); //? pulls preferences
      setAcademicSession(user.prefs?.academic_session || null);
      setStudentId(user.prefs?.student_id || null);
      setAdminId(user.prefs?.id || null);
      setAdminRole(user.prefs?.role || null);
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

  //* Login function
  //? ID is expected to be the student ID, which is used to generate email and academic session
  //? Password is the user's password
  const login = async (id: string, password: string): Promise<void> => {
    if (!id || !password) {
      console.error("Missing credentials");
      return;
    }

    //? Generate email from ID
    const email = generateEmailFromId(id);

    if (!email) {
      console.error("Invalid ID format");
      return;
    }

    try {
      const success = await createSession(email, password);
      if (!success) {
        console.error("Failed to create session");
        return;
      }

      const user = await account.get(); //? pulls preferences

      if (id === "ADMIN") {
        if (user.prefs?.id && user.prefs?.role) {
          setAdminId(user.prefs?.id || null);
          setAdminRole(user.prefs?.role || null);
        } else {
          setAdminId(id);
          setAdminRole("ADMIN");

          //? persist in Appwrite prefs
          await account.updatePrefs({
            id: id,
            role: "ADMIN",
          });
        }
      } else {
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
      }

      await getSession(); //? refresh context

      router.push("/");
    } catch (error) {
      console.error("Error logging in. Please check your credentials.", error);
    }
  };

  //* Sign up function
  //? Expects email, username, and password
  //? Creates a new user account and session
  //? Also generates academic session and student ID based on email
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

  //* Logout function
  //? Deletes the current session both client-side and server-side
  //? Resets the context state and redirects to login page
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

      localStorage.removeItem("extractedResults");

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
        adminId,
        adminRole,
        session,
        loading,
      }}
    >
      {children}
    </AppwriteContext.Provider>
  );
};
