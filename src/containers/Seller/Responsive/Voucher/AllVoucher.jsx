
import { useHeader } from "@/common/ResponsiveContext";
import IconComponent from "@/components/IconComponent/IconComponent";
import Input from "@/components/Input/Input";
import { useCustomRouter } from "@/libs/CustomRoute";
import SWRHandler from "@/services/useSWRHook";
import toast from "@/store/toast";
import { useParams } from "next/navigation";
import { Fragment, useState } from "react";
import SellerResponsiveHeader from "../../Component/SellerResponsiveHeader";
// FIX BUG Pengecekan Ronda Muatparts LB-0065
import VoucherCard from "../../Component/VoucherCard";

const AllVoucher = ({
    setSelectedVoucherId,
}) => {
    const {
        setAppBar, 
        setScreen,
    } = useHeader()
    const params = useParams()
    const { setShowBottomsheet } = toast();
    const router = useCustomRouter();
    const [search, setSearch] = useState("")

    const { useSWRHook } = SWRHandler();
    const { data: dataAllSellerVoucher, isLoading: isLoadingAllSellerVoucher, mutate: mutateAllSellerVoucher } = useSWRHook(
        `v1/muatparts/voucher-buyer/${params.id}?page=1&page_size=100`,
    );

    const allSellerVouchers = dataAllSellerVoucher?.Data ? dataAllSellerVoucher.Data : []

    const handleClearSearch = () => {
        setSearch("")
    }

    const handleRefreshVoucher = () => mutateAllSellerVoucher();

    return (
        <div className="flex flex-col gap-y-4">
            <Input
                placeholder="Cari Voucher"
                icon={{
                    left: (
                        <IconComponent src={"/icons/search.svg"} />
                    ),
                    right: search ? (
                        <IconComponent
                            src={"/icons/silang.svg"}
                            onclick={handleClearSearch}
                        />
                    ) : null,
                }}
                value={search}
                changeEvent={(e) => setSearch(e.target.value)}
                // onKeyUp={onSearch}
            />
            <div className="flex flex-col gap-y-4 overflow-y-auto max-h-[65vh] overflow-x-hidden">
                {allSellerVouchers.filter(item => item.kode.toLowerCase().includes(search.toLowerCase())).map((item, key) => {
                    const voucher = {
                        ...item,
                        // LBM - OLIVER - FIX PENGGUNAAN PROPERTY DARI API VOUCHER - MP - 020
                        usageCount: Number(item.usageCount),
                        usageQuota: item.usage_quota,
                    }
                    return (
                        <Fragment key={key}>
                            <VoucherCard
                                voucher={voucher}
                                onClickDetail={() => {
                                    setScreen("voucher")
                                    setSelectedVoucherId(item.uuid)
                                    setShowBottomsheet(false)
                                    setAppBar({
                                        title: "Detail Voucher",
                                        appBarType: "header_title",
                                        onBack: () => {
                                            setAppBar({
                                                appBarType: "compact",
                                                onBack: () => router.back(),
                                                bottomTabNavigation: true,
                                                renderActionButton: <SellerResponsiveHeader/>,
                                            });
                                            setScreen("")
                                        },
                                    })
                                }}
                                onRefreshVoucher={handleRefreshVoucher}
                            />
                        </Fragment>
                    )
                })}
            </div>
        </div>
    )
}

export default AllVoucher