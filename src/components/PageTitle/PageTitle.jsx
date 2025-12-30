import { useCustomRouter } from "@/libs/CustomRoute";
import Image from "next/image";
import React from "react";

const PageTitle = ({ title, route = null }) => {
  const router = useCustomRouter();

  return (
    <div className="flex items-center gap-3 mb-4">
      <Image
        src={process.env.NEXT_PUBLIC_ASSET_REVERSE + "/icons/arrowbackblue.svg"}
        width={24}
        height={24}
        className="cursor-pointer"
        alt="Back"
        onClick={() => window.history.back()}
      />
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
  );
};

export default PageTitle;
