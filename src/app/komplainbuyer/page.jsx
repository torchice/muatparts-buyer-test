// 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 LB - 0114
"use client";
import { viewport } from "@/store/viewport";
import React, { useState } from "react";
import SWRHandler from "@/services/useSWRHook";

import ComplaintFormReponsive from "./ComplaintFormResponsive";
import ComplaintForm from "./ComplaintForm";

function ComplaintFull() {
  const [state, setState] = useState();
  const { useSWRHook, useSWRMutateHook } = SWRHandler();


  const { isMobile } = viewport();
  if (typeof isMobile !== "boolean") return <></>; //buat skeleton
  if (isMobile) return <ComplaintFormReponsive />;
  return <ComplaintForm />;
}

export default ComplaintFull;
// 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 LB - 0114