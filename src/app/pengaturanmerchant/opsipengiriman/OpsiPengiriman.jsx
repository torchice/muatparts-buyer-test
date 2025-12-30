"use client"

import { viewport } from "@/store/viewport";
import OpsiPengirimanWeb from "./OpsiPengirimanWeb";
import SWRHandler from "@/services/useSWRHook";
import useSWR, { mutate } from "swr";
import OpsiPengirimaResponsive from "./OpsiPengirimaResponsive";

const baseUrl = process.env.NEXT_PUBLIC_API_FRIDAY

const OpsiPengiriman = () => {
    const { useSWRHook, useSWRMutateHook } = SWRHandler();
    const { data: shippingOptionData } = useSWRHook(`muatparts/shipping_option`);

    const { trigger: setPickup } = useSWRMutateHook(
        `${baseUrl}v1/muatparts/shipping_option/pickup`,
        "POST"
    );

    const { trigger: toogleGroupExpedition } = useSWRMutateHook(
        `${baseUrl}v1/muatparts/shipping_option/expedition/group/status`,
        "POST"
    );

    const { trigger: toogleItemExpedition } = useSWRMutateHook(
        `${baseUrl}v1/muatparts/shipping_option/expedition/status`,
        "POST"
    );

    const fullAddress = shippingOptionData?.Data.store_address.full_address
    const pickupOption = shippingOptionData?.Data.pickup_option
    const storeCourier = shippingOptionData?.Data.store_courier
    const shippingGroups = shippingOptionData?.Data.shipping_groups || []

    const handleToogleAmbilLangsung = async() => {
        const data = { is_active: !pickupOption?.is_active }
        await setPickup(data)
            .then(() => {
                handleRefresh()
        })
    }

    const handleRefresh = () => {
        mutate(`${baseUrl}v1/muatparts/shipping_option`)
    }

    const { isMobile } = viewport();

    const sharedProps = {
        // swr
        setPickup,
        toogleGroupExpedition,
        toogleItemExpedition,
        // func
        handleToogleAmbilLangsung,
        handleRefresh,
        // data
        fullAddress,
        pickupOption,
        storeCourier,
        shippingGroups
    }

    if (typeof isMobile !== "boolean") return null;

    return isMobile ? (
        <OpsiPengirimaResponsive
            {...sharedProps}
        />
    ) : (
        <OpsiPengirimanWeb
            {...sharedProps}
        />
    );
}

export default OpsiPengiriman