"use client"

import { viewport } from "@/store/viewport";
import KurirTokoWeb from "./KurirTokoWeb";
import SWRHandler from "@/services/useSWRHook";
import { mutate } from "swr";
import { useEffect, useState } from "react";
import toast from "@/store/toast";
import { useRouter } from "next/navigation";
import KurirTokoResponsive from "./KurirTokoResponsive";
import { useCustomRouter } from "@/libs/CustomRoute";

const baseUrl = process.env.NEXT_PUBLIC_API_FRIDAY

const KurirToko = () => {
    const [formData, setFormData] = useState([])

    const router = useCustomRouter();
    const { setShowToast, setDataToast } = toast();

    const { useSWRHook, useSWRMutateHook } = SWRHandler();
    const { data: courierStoreData } = useSWRHook(`${baseUrl}v1/muatparts/shipping_option/courier_store`);

    const { trigger: addCourierProvince } = useSWRMutateHook(`${baseUrl}v1/muatparts/shipping_option/courier_store/province`, "POST");
    // const { trigger: deleteProvince } = useSWRMutateHook(`${baseUrl}v1/muatparts/shipping_option/courier_store/province`, "DELETE");
    const { trigger: addCourierCostCities } = useSWRMutateHook(`${baseUrl}v1/muatparts/shipping_option/courier_store/cost`, "POST");

    const address = courierStoreData?.Data.address
    const count = courierStoreData?.Data.count
    const lists = courierStoreData?.Data.lists || []
    const provinceIds = courierStoreData?.Data.provinces.map(item => item.provinceID)
console.log("a",courierStoreData?.Data)
    useEffect(() => {
        if (lists.length > 0) {
            setFormData(lists)
        }
    }, [JSON.stringify(lists)])

    
    const validateFormData = () => {
        const hasCityWithEmptyPrice = formData.some(item => 
            item.cities.some(city => city.isActive && !city.price && city.price !== 0))
        if (hasCityWithEmptyPrice) {
            setShowToast(true)
            setDataToast({
                type: "error",
                message: "Terdapat field yang masih kosong",
            });
            return false;
        }
        const hasProvinceWithNoActiveCity = formData.some(item => !item.cities.some(city => city.isActive))
        if (hasProvinceWithNoActiveCity) {
            setShowToast(true)
            setDataToast({
                type: "error",
                message: "Wajib mengatur kota/kab terlebih dahulu",
            });
            return false;
        }
        return true;
    }
    
      
    const handleSave = async() => {
        await addCourierCostCities({
            lists: formData.map(province => ({ id: province.id, cities: province.cities.filter(city => city.isActive).map(city => ({ cityID: city.cityID, price: city.price }))}))
        })
        .then(() => {
            setShowToast(true)
            setDataToast({
                type: "success",
                message: "Berhasil menyimpan data",
            });
            router.push("/pengaturanmerchant/opsipengiriman")
        })
        .catch(() => {
            if (!navigator.onLine) {
                setShowToast(true)
                setDataToast({
                    type: "error",
                    message: "Koneksi internet Anda terputus. Mohon ulangi kembali.",
                });
            }
        })
    }

    const handleRefresh = () => {
        mutate(`${baseUrl}v1/muatparts/shipping_option/courier_store`)
    }

    const { isMobile } = viewport();

    const sharedProps = {
        // useSWRMutateHook
        addCourierProvince,
        handleSave,
        handleRefresh,
        validateFormData,
        address,
        count,
        provinceIds,
        lists,
        formData,
        setFormData,
    }

    if (typeof isMobile !== "boolean") return null;

    return isMobile ? (
        <KurirTokoResponsive
            {...sharedProps}
        />
    ) : (
        <KurirTokoWeb
            {...sharedProps}
        />
    );
}

export  default KurirToko