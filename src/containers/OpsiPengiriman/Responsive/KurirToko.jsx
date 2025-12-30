import Button from "@/components/Button/Button"
import Card from "./Card"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCustomRouter } from "@/libs/CustomRoute"

const KurirToko = () => {
    const router = useCustomRouter();
    return (
        <Card>
            <span className="font-semibold text-[14px] leading-[15.4px]">
                Kurir Toko
            </span>
            <span className="font-semibold text-[14px] leading-[15.4px] text-neutral-700">
                Pengiriman langsung menggunakan armada pribadi penjual
            </span>
            <div className="flex justify-between items-center">
                <Image
                    src="/img/delivery.png"
                    alt="delivery"
                    width={28}
                    height={28}
                />
                <div className="flex gap-x-3 items-center">
                    <span className="font-semibold text-[12px] leading-[14.4px]">Kurir Toko</span>
                    <Button
                        color="primary_secondary"
                        Class="px-[44px] h-7 !font-semibold flex items-center"
                        onClick={() => router.push("/pengaturanmerchant/opsipengiriman/kurirtoko")}
                    >
                        Atur
                    </Button>
                </div>
            </div>
        </Card>
    )
}

export default KurirToko