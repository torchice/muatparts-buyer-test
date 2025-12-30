import AddressCard from "@/containers/OpsiPengiriman/Responsive/AddressCard";
import AmbilLansungCard from "@/containers/OpsiPengiriman/Responsive/AmbilLansungCard";
import ExpedisiCard from "@/containers/OpsiPengiriman/Responsive/ExpedisiCard";
import KurirToko from "@/containers/OpsiPengiriman/Responsive/KurirToko";
import { Fragment } from "react";

const OpsiPengirimaResponsive = ({
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
}) => {
    console.log("ship",shippingGroups)
    return (
        <div className="flex flex-col gap-y-2">
            <AddressCard fullAddress={fullAddress}/>
            <AmbilLansungCard onToogleAmbilLangsung={handleToogleAmbilLangsung} pickupOption={pickupOption}/>
            <KurirToko />
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
    )
}

export default OpsiPengirimaResponsive;