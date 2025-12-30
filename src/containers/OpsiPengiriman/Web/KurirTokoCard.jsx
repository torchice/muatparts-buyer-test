import Image from "next/image"
import Card from "./Card"
import Button from "@/components/Button/Button"
import { useRouter } from "next/navigation";
import { useCustomRouter } from "@/libs/CustomRoute";

const KurirTokoCard = ({
    is_configured,
    total_provinces
}) => {
    const router = useCustomRouter();
    return (
        <Card>
            <div className="flex flex-col">
                <span className="font-bold text-[18px] leading-[21.6px]">Kurir Toko</span>
                <div className="mt-3 font-medium text-[12px] leading-[14.4px] text-neutral-600">Pengiriman langsung menggunakan armada pribadi penjual</div>
                <div className="mt-6 flex justify-between px-6 pt-2 pb-3">
                    <Image
                        src="/img/delivery.png"
                        alt="delivery"
                        width={41}
                        height={41}
                    />
                    <div className="flex items-center">
                        <span className="font-semibold text-[12px] leading-[14.4px]">Kurir Toko</span>
                        {is_configured ? (
                            <div className="ml-2 text-primary-700 font-semibold text-[12px] leading-[14.4px]">
                                {`[${total_provinces} Provinsi]`}
                            </div>
                        ) : null}
                        <Button
                            color="primary_secondary"
                            Class="ml-3 h-8 px-[42px]"
                            onClick={() => router.push("/pengaturanmerchant/opsipengiriman/kurirtoko")}
                        >
                            <span className="font-semibold text-[14px] leading-[16.8px]">Atur</span>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default KurirTokoCard