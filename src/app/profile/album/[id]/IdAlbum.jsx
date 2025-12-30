"use client";
import { viewport } from "@/store/viewport";
import React, { useState } from "react";
import IdAlbumResponsive from "./IdAlbumResponsive";
import IdAlbumWeb from "./IdAlbumWeb";
import SWRHandler from "@/services/useSWRHook";

function IdAlbum({ id }) {
  const PRODUCT_POPULAR_ENDPOINT = "v1/muatparts/product/popular";

  const [state, setState] = useState();
  const { useSWRHook, useSWRMutateHook } = SWRHandler();

  const {
    data: albumItems,
    error,
    isLoading,
  } = useSWRHook(PRODUCT_POPULAR_ENDPOINT);

  const { isMobile } = viewport();
  if (typeof isMobile !== "boolean") return <></>; //buat skeleton
  if (isMobile) return <IdAlbumResponsive />;
  return <IdAlbumWeb id={id} albumItems={albumItems?.Data ?? []} />;
}

export default IdAlbum;
