"use client";
import { viewport } from "@/store/viewport";
import React, { useEffect, useMemo, useState } from "react";
import IdAlbumResponsive from "./IdAlbumResponsive";
import IdAlbumWeb from "./IdAlbumWeb";
import SWRHandler from "@/services/useSWRHook";
import AlbumWishlist from "@/components/AlbumWishist/AlbumWishlist";
import useAlbumStore from "@/store/album";
import toast from "@/store/toast";
import { useSWRConfig } from "swr";

function IdAlbum({ id }) {
  const {
    fetchDetail,
    filterAlbum,
    valueAddItems,
    valueMoveAlbum,
    setModalMoveAlbum,
    clearAddItems,
    clearMoveItems,
    dataAlbum,
    setFetchDetail,
  } = useAlbumStore();

  const ID_ALBUM_ENDPOINT = `v1/muatparts/albums/${id}/items`;

  const ADD_ALBUM_ITEMS_ENDPOINT =
    process.env.NEXT_PUBLIC_GLOBAL_API +
    `v1/muatparts/albums/${valueAddItems.targetAlbumId}/items`;

  const MOVE_ALBUM_ENDPOINT =
    process.env.NEXT_PUBLIC_GLOBAL_API + `v1/muatparts/albums/${id}/items/move`;

  const { setShowToast, setDataToast } = toast();

  const { useSWRHook, useSWRMutateHook } = SWRHandler();

  const getDetailAlbumParams = useMemo(() => {
    const params = []
    if (filterAlbum.search) {
      params.push(`search=${filterAlbum.search}`)
    }
    if (filterAlbum.sort && filterAlbum.sort[0]) {
      params.push(`sort=${filterAlbum.sort[0].value}`)
    }
    if (filterAlbum.filter.categories.length > 0) {
      filterAlbum.filter.categories.forEach(item => params.push(`filters[categories][]=${item}`))
    }
    if (filterAlbum.filter.brands.length > 0) {
      filterAlbum.filter.brands.forEach(item => params.push(`filters[brands][]=${item}`))
    }
    if (filterAlbum.filter.stock) {
      params.push(`filters[stock]=${filterAlbum.filter.stock}`)
    }
    if (filterAlbum.page) {
      params.push(`page=${filterAlbum.page}`)
    }
    if (filterAlbum.limit) {
      params.push(`limit=${filterAlbum.limit}`)
    }
    return params.join("&")
  }, [JSON.stringify(filterAlbum)])

  const { data: resIdAlbum, mutate: mutateIdAlbum, isLoading } =
    useSWRHook(`${ID_ALBUM_ENDPOINT}?${getDetailAlbumParams}`);

  const { data: resMoveAlbum, trigger: triggerMoveAlbum } = useSWRMutateHook(
    MOVE_ALBUM_ENDPOINT,
    "POST"
  );

  const { data: resAddItems, trigger: triggerAddItems } = useSWRMutateHook(
    ADD_ALBUM_ITEMS_ENDPOINT,
    "POST"
  );

  const { trigger: deleteAlbumItems } = useSWRMutateHook(
    `v1/muatparts/albums/${id}/items`,
    "DELETE",
  );

  useEffect(() => {
    if (fetchDetail) mutateIdAlbum().then(setFetchDetail(false));
  }, [fetchDetail]);

  useEffect(() => {
    if (Object.keys(valueAddItems).length > 2) {
      triggerAddItems(valueAddItems);
    }
  }, [valueAddItems]);

  useEffect(() => {
    if (valueMoveAlbum.targetAlbumId && valueMoveAlbum?.itemIds?.length > 0) {
      triggerMoveAlbum(valueMoveAlbum);
    }
  }, [valueMoveAlbum]);

  useEffect(() => {
    if (resMoveAlbum?.data?.Message.Code === 200) {
      mutateIdAlbum();
      setModalMoveAlbum(false);
      setShowToast(true);
      setDataToast({
        type: "success",
        message: `Berhasil dipindahkan ke ${valueMoveAlbum.name}`,
      });
      clearMoveItems();
    }
  }, [resMoveAlbum]);

  useEffect(() => {
    if (resAddItems) {
      setModalMoveAlbum(false);
      setShowToast(true);
      setDataToast({
        type: "success",
        message: `Berhasil dipindahkan ke ${valueAddItems.name}`,
      });
      clearAddItems();
    }
  }, [resAddItems]);

  const handleRefreshAlbum = () => mutateIdAlbum()

  const { isMobile } = viewport();
  if (typeof isMobile !== "boolean") return <></>; //buat skeleton
  if (isMobile) {
    return (
      <IdAlbumResponsive
        deleteAlbumItems={deleteAlbumItems}
        id={id}
        onRefreshAlbum={handleRefreshAlbum}
        resIdAlbum={resIdAlbum}
        triggerMoveAlbum={triggerMoveAlbum}
      />
    );
  }
  return (
    <>
      <IdAlbumWeb 
        id={id} 
        dataIdAlbum={resIdAlbum?.Data ?? null} 
        mutateIdAlbum={mutateIdAlbum}
        isLoading={isLoading}
        />
    </>
  );
}

export default IdAlbum;
