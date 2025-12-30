"use client";
import { viewport } from "@/store/viewport";
import React, { useEffect, useState } from "react";
import DetailPesananResponsive from "./DetailPesananResponsive";
import DetailPesananWeb from "./DetailPesananWeb";
import SWRHandler from "@/services/useSWRHook";
import { resCheckoutDetail } from "./mock";
import useOrderDetailStore from "@/store/orderDetail";

function DetailPesanan() {
  const { shippingCost, setShippingCost } = useOrderDetailStore();

  const [state, setState] = useState();
  const { useSWRHook, useSWRMutateHook } = new SWRHandler();
  const { isMobile } = viewport();
  if (typeof isMobile !== "boolean") return <></>; //buat skeleton
  if (isMobile) return <DetailPesananResponsive />;

  return <DetailPesananWeb dataCheckoutDetail={resCheckoutDetail.Data ?? []} />;
}

export default DetailPesanan;
