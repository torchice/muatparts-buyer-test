import Image from "next/image"
import Card from "./Card"
import ToogleButton from "@/components/ToogleButton/ToogleButton"

const AmbilLangsungCard = ({
    setPickup,
    pickupOption,
    onRefresh
}) => {

    const handleToogleAmbilLangsung = async() => {
        const data = { is_active: !pickupOption?.is_active }
        await setPickup(data)
            .then(() => {
                onRefresh()
        })
    }

    return (
        <Card>
            <div className="flex flex-col">
                <span className="font-bold text-[18px] leading-[21.6px]">Ambil Langsung</span>
                <div className="mt-3 font-medium text-[12px] leading-[14.4px] text-neutral-600">Pengambilan langsung di tempat penjual</div>
                <div className="mt-6 flex justify-between px-6 pt-2 pb-3">
                    <Image
                        src="/img/courier.png"
                        alt="courier"
                        width={32}
                        height={39}
                    />
                    <div className="flex gap-x-3 items-center">
                        <span className="font-semibold text-[12px] leading-[14.4px]">Ambil Langsung</span>
                        <ToogleButton
                            onClick={handleToogleAmbilLangsung}
                            value={pickupOption?.is_active}
                        />
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default AmbilLangsungCard