import IconComponent from "@/components/IconComponent/IconComponent"
import Tooltip from "@/components/Tooltip/Tooltip"
import AmbilLangsungCard from "@/containers/OpsiPengiriman/Web/AmbilLangsungCard"
import ExpedisiCard from "@/containers/OpsiPengiriman/Web/ExpedisiCard"
import KurirTokoCard from "@/containers/OpsiPengiriman/Web/KurirTokoCard"
import { Fragment } from "react"

const OpsiPengirimanWeb = ({
    setPickup,
    toogleGroupExpedition,
    toogleItemExpedition,
    handleRefresh,
    pickupOption,
    storeCourier,
    shippingGroups
}) => {
    return (
        // nanti hapus p-20
        <div className="p-20">
            <div className="flex flex-col gap-y-6">
                <div className="flex gap-x-2 items-center">
                    <span className="font-bold text-[20px] leading-[24px]">Opsi Pengiriman</span>
                    <Tooltip
                        text={(
                            <div className="">Atur pengiriman secara global untuk menjadi standar pengiriman di Merchant Anda.</div>
                        )}
                        position="right"
                    >
                    <IconComponent
                        src="/icons/info.svg"
                    />
                    </Tooltip>
                </div>
                <AmbilLangsungCard
                    onRefresh={handleRefresh}
                    pickupOption={pickupOption}
                    setPickup={setPickup}
                />
                <KurirTokoCard
                    {...storeCourier}
                />
                {shippingGroups.map((shippingGroup, key) => (
                    <Fragment key={key}>
                        <ExpedisiCard
                            {...shippingGroup}
                            onRefresh={handleRefresh}
                            toogleGroupExpedition={toogleGroupExpedition}
                            toogleItemExpedition={toogleItemExpedition}
                        />
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export default OpsiPengirimanWeb