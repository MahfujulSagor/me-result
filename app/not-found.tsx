"use client";
import CenterUnderline from "@/components/fancy/text/underline-center";
import { useRouter } from "next/navigation";
import React from "react";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl flex flex-col items-center justify-center text-center space-y-4">
        <h1 className="lg:text-[340px] md:text-[240px] text-9xl font-extrabold">
          404
        </h1>
        <h2 className="lg:text-6xl text-4xl font-bold text-muted-foreground">
          Hmm...
        </h2>
        <p className="md:text-2xl text-xl text-ring">
          We&apos;re fairly sure this page used to be here, but seems to have
          gone missing. We do apologise on it&apos;s behalf.
        </p>
        <div onClick={() => router.back()} className="cursor-pointer mt-4">
          <CenterUnderline className="text-2xl font-medium">
            Let&apos;s head back
          </CenterUnderline>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
