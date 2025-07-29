"use client";
import React, { useEffect } from "react";
import { account } from "@/appwrite/appwrite-client";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";

export default function RefreshJWT() {
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const redirectTo = searchParams.get("redirect");

    let redirected = false;
    const navigateTo = (path: string) => {
      if (!redirected) {
        redirected = true;
        router.replace(path);
      }
    };

    async function refreshToken() {
      //? Get current session
      try {
        const currentSession = await account.getSession("current");

        if (!currentSession) {
          console.error("No active session found");
          navigateTo("/auth/login");
          return;
        }
      } catch (error) {
        console.error("Failed to get current session", error);
        navigateTo("/auth/login");
        return;
      }

      //? Create a new JWT
      try {
        const jwt = await account.createJWT();
        if (!jwt) {
          console.error("Failed to get new JWT");
          navigateTo("/auth/login");
          return;
        }

        const res = await fetch("/api/v1/session/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jwt: jwt.jwt }),
          credentials: "include",
        });

        if (!res.ok) {
          console.error("Failed to update session");
          navigateTo("/auth/login");
          return;
        }

        //? Redirect to homepage
        const safeRedirect =
          redirectTo?.startsWith("/") && !redirectTo.includes(".well-known")
            ? redirectTo
            : "/";
        navigateTo(safeRedirect);
      } catch (error) {
        console.error("JWT refresh failed", error);
        navigateTo("/auth/login");
      }
    }

    refreshToken();
  }, [router]);
  return <Loader imageWidth={200} loaderHeight={"screen"} />;
}
