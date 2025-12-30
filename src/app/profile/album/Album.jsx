"use client";
import { viewport } from "@/store/viewport";
import React, { useState } from "react";
import AlbumResponsive from "./AlbumResponsive";
import AlbumWeb from "./AlbumWeb";
import SWRHandler from "@/services/useSWRHook";
import { albumItems } from "./mock";
import useAlbumStore from "@/store/album";

function Album() {
  const PRODUCT_POPULAR_ENDPOINT = "v1/muatparts/product/popular";

  const [state, setState] = useState();
  const { useSWRHook, useSWRMutateHook } = SWRHandler();

  const {
    data: mostVisitedProducts,
    error,
    isLoading,
  } = useSWRHook(PRODUCT_POPULAR_ENDPOINT);

  const { modalNewAlbum, setModalNewAlbum } = useAlbumStore();
  const { data: albumList } = useSWRHook(`v1/muatparts/albums`);

  const { isMobile } = viewport();
  if (typeof isMobile !== "boolean") return <></>; //buat skeleton
  if (isMobile) return <AlbumResponsive />;
  return (
    <AlbumWeb
      albumItems={albumList?.Data?.albums ?? []}
      lastVisited={mostVisitedProducts?.Data ?? []}
      modalNewAlbum={modalNewAlbum}
    />
  );
}

export default Album;
