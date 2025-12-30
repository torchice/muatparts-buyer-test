"use client";
import { viewport } from "@/store/viewport";
import React, { useState } from "react";
import IdAlbumResponsive from "./IdAlbumResponsive";
import IdAlbumWeb from "./IdAlbumWeb";
import SWRHandler from "@/services/useSWRHook";

function Albumid({ params }) {
  const PRODUCT_POPULAR_ENDPOINT =
    process.env.NEXT_PUBLIC_GLOBAL_API + "muatparts/product/popular";

  const [state, setState] = useState();
  const { useSWRHook, useSWRMutateHook } = new SWRHandler();

  const {
    data: albumItems,
    error,
    isLoading,
  } = useSWRHook(PRODUCT_POPULAR_ENDPOINT);

  const { isMobile } = viewport();
  if (typeof isMobile !== "boolean") return <></>; //buat skeleton
  if (isMobile) return <IdAlbumResponsive />;
  return <IdAlbumWeb params={params} albumItems={albumItems?.Data ?? []} />;
}

export default Albumid;
