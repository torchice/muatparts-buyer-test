import React from "react";
import ImageComponent from "../ImageComponent/ImageComponent";

export function UserProfile({ photo, name }) {
  return (
    <div className="flex gap-3 items-center p-2 w-full text-xs font-semibold leading-tight bg-sky-100 rounded-lg text-zinc-900">
      <ImageComponent
        src={photo}
        width={24}
        height={24}
        className={
          "object-contain shrink-0 self-stretch my-auto w-6 rounded-3xl aspect-square"
        }
        alt={"profile"}
      />

      <div className="flex-1 shrink gap-3 self-stretch my-auto">{name}</div>
    </div>
  );
}
