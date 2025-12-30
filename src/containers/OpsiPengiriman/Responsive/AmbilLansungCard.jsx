import Image from "next/image"
import Card from "./Card"
import ToogleButton from "@/components/ToogleButton/ToogleButton"

const AmbilLansungCard = ({
    onToogleAmbilLangsung,
    pickupOption,
}) => {
    return (
        <Card>
            <span className="font-semibold text-[14px] leading-[15.4px]">
                Ambil Langsung
            </span>
            <span className="font-semibold text-[14px] leading-[15.4px] text-neutral-700">
                Pengambilan langsung di tempat penjual
            </span>
            <div className="flex justify-between items-center">
                <Image
                    src="/img/courier.png"
                    alt="courier"
                    width={20}
                    height={24}
                />
                <div className="flex gap-x-3 items-center">
                    <span className="font-semibold text-[12px] leading-[14.4px]">Ambil Langsung</span>
                    <ToogleButton
                        onClick={onToogleAmbilLangsung}
                        value={pickupOption?.is_active}
                    />
                </div>
            </div>
        </Card>
    )
}

export default AmbilLansungCard