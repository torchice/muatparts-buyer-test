"use client";
import { viewport } from "@/store/viewport";
import React, { useState } from "react";
import UlasanbuyerResponsive from "./UlasanbuyerResponsive";
import UlasanbuyerWeb from "./UlasanbuyerWeb";
import SWRHandler from "@/services/useSWRHook";

const menus = [
  {
    id: 1,
    name: "Menunggu Ulasan",
    notif: 3,
  },
  {
    id: 2,
    name: "Ulasan Saya",
    notif: 5,
  },
];

function Ulasanbuyer() {
  const [state, setState] = useState();
  const { useSWRHook, useSWRMutateHook } = SWRHandler();


  const { isMobile } = viewport();
  if (typeof isMobile !== "boolean") return <></>; //buat skeleton
  if (isMobile) return <UlasanbuyerResponsive />;
  return <UlasanbuyerWeb />;
}

export default Ulasanbuyer;
