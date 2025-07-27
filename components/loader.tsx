import Image from "next/image";
import React from "react";
import ME from "@/public/me-logo.png";

const Loader = ({
  imageWidth,
  loaderHeight,
}: {
  imageWidth: number;
  loaderHeight: string;
}) => {
  return (
    <div
      className={`w-full min-h-${
        loaderHeight || ""
      } flex justify-center items-center`}
    >
      <div>
        <Image
          src={ME}
          alt="ME_logo"
          width={imageWidth}
          className="rounded-full animate-pulse"
        />
      </div>
    </div>
  );
};

export default Loader;
