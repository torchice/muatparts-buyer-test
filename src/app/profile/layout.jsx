"use client";

import style from "./Profile.module.scss";
import { Sidebar } from "@/components/Sidebar/Sidebar";

export default function ProfileLayout({ children }) {
  return (
    <div className={style.main}>
      <Sidebar />
      <div className="w-[900px] space-y-6">{children}</div>
    </div>
  );
}
