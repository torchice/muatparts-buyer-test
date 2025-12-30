import Bubble from "@/components/Bubble/Bubble"
import IconComponent from "@/components/IconComponent/IconComponent"
import styles from "./ProvinceBubble.module.scss"
import SWRHandler from "@/services/useSWRHook"
import Modal from "@/components/Modals/modal"
import { useState } from "react"
import toast from "@/store/toast"
import Toast from "@/components/Toast/Toast"

const baseUrl = process.env.NEXT_PUBLIC_API_FRIDAY

const ProvinceBubble = ({
    onRefresh,
    provinceID,
    provinceName
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { setShowToast, setDataToast } = toast();

    const { useSWRMutateHook } = new SWRHandler();
    const { trigger: deleteProvince } = useSWRMutateHook(`${baseUrl}v1/muatparts/shipping_option/courier_store/province/${provinceID}`, "DELETE");
    
    const handleDeleteProvince = async () => {
        await deleteProvince()
            .then(() => {
                onRefresh()
                setIsModalOpen(false)
                setShowToast(true)
                setDataToast({
                    type: "success",
                    message: `Berhasil menghapus provinsi ${provinceName}`,
                });
            })
            .catch(() => {
                setIsModalOpen(false)
                setShowToast(true)
                setDataToast({
                    type: "error",
                    message: `Gagal menghapus provinsi ${provinceName}`,
                });
            })
    }

    return (
        <>
            <Bubble>
                <div className='flex gap-x-1 items-center'>
                    <span>{provinceName}</span>
                        <IconComponent
                            onclick={() => setIsModalOpen(true)}
                            classname={styles.icon_primary}
                            src="/icons/silang.svg"
                            height={14}
                            width={14}
                        />
                </div>
            </Bubble>
            <Toast/>
            <Modal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                closeArea={false}
                closeBtn={true}
                desc={`Apakah kamu yakin ingin menghapus provinsi ${provinceName}?`}
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
                    action: handleDeleteProvince,
                    text: "Ya",
                    style: "full",
                    color: "#176CF7",
                    customStyle: {
                        width: "112px",
                        color: "#ffffff",
                    },
                }}
            />
        </>
    )
}

export default ProvinceBubble