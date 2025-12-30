"use client";
import { viewport } from "@/store/viewport";
import React, { use, useEffect, useState } from "react";
import TroliResponsive from "./TroliResponsive";
import TroliWeb from "./TroliWeb";
import SWRHandler from "@/services/useSWRHook";
import { sellerItems, voucherData } from "./mock";
import useTroliStore from "@/store/troli";
import useCounterStore from "@/store/counter";
import TroliWebSkeleton from "./TroliWebSkeleton";
import TroliResponsiveSkeleton from "./TroliResponsiveSkeleton";
import useVoucherMuatpartsStore from "@/store/useVoucherMuatpartsStore";

function Troli() {
  const POST_CART_ENDPOINT =
    process.env.NEXT_PUBLIC_GLOBAL_API + "v1/muatparts/cart/items";

  const PUT_CART_ENDPOINT = "v1/muatparts/cart/items";

  const GET_CART_ENDPOINT = "v1/muatparts/cart";
  const GET_RECOMMENDATIONS_ENDPOINT = "v1/muatparts/cart/recommendations";
  const GET_WISHLISTS_ENDPOINT = "v1/muatparts/cart/wishlists";

  const {
    cartBody,
    cartDelete,
    cartPut,
    setCartPut,
    setCartDelete,
    setCartBody,
  } = useTroliStore();

  const { literallyClearAll } = useVoucherMuatpartsStore();

  useEffect(() => {
    literallyClearAll();
  }, []);

  const { setFetchCounter } = useCounterStore();

  const { useSWRHook, useSWRMutateHook } = SWRHandler();

  const {
    data: resCart,
    mutate: mutateCart,
    isLoading,
  } = useSWRHook(GET_CART_ENDPOINT);
  const { data: resRecommendations, mutate: mutateRecommendations } =
    useSWRHook(GET_RECOMMENDATIONS_ENDPOINT);
  const { data: resOnWishList, mutate: mutateOnWishlist } = useSWRHook(
    GET_WISHLISTS_ENDPOINT
  );

  const { data: resPostCart, trigger: triggerPostCart } = useSWRMutateHook(
    POST_CART_ENDPOINT,
    "POST"
  );

  const { data: resPutCart, trigger: triggerPutCart } = useSWRMutateHook(
    PUT_CART_ENDPOINT + `/${cartPut.itemId}`,
    "PUT"
  );

  const { data: resDeleteCart, trigger: triggerDeleteCart } = useSWRMutateHook(
    PUT_CART_ENDPOINT,
    "DELETE"
  );

  useEffect(() => {
    if (Array.isArray(cartBody) && cartBody.length)
      cartBody?.forEach((val) => triggerPostCart(val));
    if (Object.keys(cartBody).length) {
      triggerPostCart(cartBody).then(() => setFetchCounter(true));
    }
  }, [cartBody]);

  useEffect(() => {
    if (resPostCart?.data?.Message.Code === 200) {
      mutateCart();
      setCartBody({});
    }
  }, [resPostCart]);

  useEffect(() => {
    if (Object.keys(cartDelete).length) {
      triggerDeleteCart({ data: cartDelete }).then(() => setFetchCounter(true));
    }
  }, [cartDelete]);

  useEffect(() => {
    if (Object.keys(cartPut).length) {
      triggerPutCart(cartPut);
    }
  }, [cartPut]);

  useEffect(() => {
    if (resDeleteCart?.data?.Message.Code === 200) {
      mutateCart();
      setCartDelete({});
    }
  }, [resDeleteCart]);

  useEffect(() => {
    if (resPutCart?.data?.Message.Code === 200) {
      mutateCart();
      setCartPut({});
    }
  }, [resPutCart]);

  const { isMobile } = viewport();
  if (typeof isMobile !== "boolean") return <></>; //buat skeleton

  if (isLoading)
    return isMobile ? <TroliResponsiveSkeleton /> : <TroliWebSkeleton />;

  if (isMobile)
    return (
      <TroliResponsive
        carts={resCart?.Data.carts ?? []}
        summary={resCart?.Data.summary ?? {}}
        yourWishlist={resOnWishList?.Data ?? []}
        recommendedProducts={resRecommendations?.Data ?? []}
        voucherData={voucherData ?? []}
        mutateCart={mutateCart}
      />
    );
  return (
    <TroliWeb
      carts={resCart?.Data.carts ?? []}
      summary={resCart?.Data.summary ?? {}}
      yourWishlist={resOnWishList?.Data ?? []}
      recommendedProducts={resRecommendations?.Data ?? []}
      voucherData={voucherData ?? []}
      mutateCart={mutateCart}
    />
  );
}

export default Troli;
