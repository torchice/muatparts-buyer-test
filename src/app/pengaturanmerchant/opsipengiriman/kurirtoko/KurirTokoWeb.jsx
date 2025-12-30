import BreadCrumb from "@/components/Breadcrumb/Breadcrumb"
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import Modal from "@/components/Modals/modal";
import Toast from "@/components/Toast/Toast";
import Tooltip from "@/components/Tooltip/Tooltip";
import ShippingArea from "@/containers/OpsiPengiriman/Web/KurirToko/ShippingArea";
import { useCustomRouter } from "@/libs/CustomRoute";
import { useRouter } from "next/navigation";
import { useState } from "react";

const KurirTokoWeb = ({
    addCourierProvince,
    handleSave: onSave,
    handleRefresh,
    validateFormData,
    count,
    provinceIds,
    lists,
    formData,
    setFormData,
}) => {
    const router = useCustomRouter();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalType, setModalType] = useState("")
    
    const breadcrumbData = ["Dashboard", "Opsi Pengiriman", "Atur Kurir Toko"]

    const handleClickBreadCrumb = (value) => {
        if (value === "Dashboard") {
            router.push("/dashboard")
        }
        if (value === "Opsi Pengiriman") {
            router.push("/pengaturanmerchant/opsipengiriman")
        }
    }

    return (
        <>
        {/* nanti hapus p-20 */}
            <div className="flex flex-col gap-y-4 p-20">
                <BreadCrumb data={breadcrumbData} onclick={handleClickBreadCrumb} maxWidth="92px" />
                <div className="flex gap-x-3 items-center">
                    <IconComponent
                        src="/icons/arrowbackblue.svg"
                        size="medium"
                        onclick={() => {
                            setIsModalOpen(true)
                            setModalType("backConfirmation")
                        }}
                    />
                    <span className="font-bold text-[20px] leading-[24px]">Atur Kurir Toko</span>
                    <Tooltip
                        text={(
                            <div className="">
                                Atur persyaratan oleh pembeli dengan biaya krim yang akan dipotong dari total penjualan Anda.    
                            </div>
                        )}
                        position="right"
                    >
                        <IconComponent
                            src="/icons/info.svg"
                        />
                    </Tooltip>
                </div>
                <ShippingArea
                    addCourierProvince={addCourierProvince}
                    onRefresh={handleRefresh}
                    count={count}
                    lists={lists}
                    formData={formData}
                    setFormData={setFormData}
                    provinceIds={provinceIds}
                />
                <div className="fixed bg-neutral-50 w-[calc(100%_-_80px)] bottom-0 py-5 px-12 flex justify-end">
                    <Button
                        Class="px-[31.5px] h-8 flex items-center !font-semibold text-[14px] leading-[16.8px]"
                        onClick={() => {
                            if (validateFormData()) {
                                setIsModalOpen(true)
                                setModalType("saveConfirmation")
                            }
                        }}
                    >
                        Simpan
                    </Button>
                </div>
            </div>
            {modalType === "saveConfirmation" ? (
                <Modal
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                    closeArea={false}
                    closeBtn={true}
                    desc={`Apakah kamu yakin menyimpan data ini?`}
                    action1={{
                        action: () => setIsModalOpen(false),
                        text: "Tidak",
                        style: "outline",
                        color: "#176CF7",
                            customStyle: {
                                width: "112px",
                        },
                    }}
                    action2={{
                        action: onSave,
                        text: "Ya",
                        style: "full",
                        color: "#176CF7",
                        customStyle: {
                            width: "112px",
                            color: "#ffffff",
                        },
                    }}
                />
            ) : null}
            {modalType === "backConfirmation" ? (
                <Modal
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                    closeArea={false}
                    closeBtn={true}
                    desc={<div className="w-[338px]">Pengaturan kurir tokomu tidak akan tersimpan kalau kamu meninggalkan halaman ini</div>}
                    action1={{
                        action: () => setIsModalOpen(false),
                        text: "Tidak",
                        style: "outline",
                        color: "#176CF7",
                            customStyle: {
                                width: "112px",
                        },
                    }}
                    action2={{
                        action: () => {
                            router.push("/pengaturanmerchant/opsipengiriman")
                        },
                        text: "Ya",
                        style: "full",
                        color: "#176CF7",
                        customStyle: {
                            width: "112px",
                            color: "#ffffff",
                        },
                    }}
                />
            ) : null}
        </>
    )
}

export default KurirTokoWeb