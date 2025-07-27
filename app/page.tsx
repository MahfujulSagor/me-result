import Image from "next/image";
import React from "react";
import ME from "@/public/me-logo.png";

export default function Home() {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <div className="absolute">
        <Image src={ME} alt="me_logo" width={600} className="opacity-50" />
      </div>
      <div className="w-full min-h-screen flex flex-col absolute bg-transparent backdrop-blur-md items-center justify-center">
        <p className="lg:text-5xl md:text-4xl sm:text-3xl text-center text-2xl font-bold">
          Department of Mechanical Engineering
        </p>
        <p className="text-center lg:text-xl md:text-lg text-sm font-bold">
          Mawlana Bhashani Science and Technology University
        </p>
      </div>
    </div>
  );
}
