
import toast from "@/store/toast";
import AllVoucher from "./AllVoucher";
import { useHeader } from "@/common/ResponsiveContext";
import { useCustomRouter } from "@/libs/CustomRoute";
// FIX BUG Pengecekan Ronda Muatparts LB-0065
import VoucherCard from "../../Component/VoucherCard";
import SellerResponsiveHeader from "../../Component/SellerResponsiveHeader";
// LBM - OLIVER - MULTIBAHASA - MP - 020
import { useLanguage } from "@/context/LanguageContext";

const VoucherContainer = ({
    sellerVouchers,
    setSelectedVoucherId,
    onRefreshVoucher
}) => {
    // LBM - OLIVER - MULTIBAHASA - MP - 020
    const { t } = useLanguage();
    const {
        setAppBar, 
        setScreen,
    } = useHeader()
    const { setShowBottomsheet, setTitleBottomsheet, setDataBottomsheet } = toast();
    const router = useCustomRouter();

    return (
        <div className="bg-white pt-5 pl-4 pb-4 flex flex-col gap-y-4 overflow-x-hidden">
            <div className="flex items-center justify-between pr-4">
                <span className="font-semibold text-[16px] leading-[17.6px] text-neutral-900">
                    {/* LBM - OLIVER - MULTIBAHASA - MP - 020 */}
                    {t("labelSellerVoucher")}
                </span>
                <button
                    className="font-semibold text-[14px] leading-[16.8px] text-primary-700"
                    onClick={() => {
                        setTitleBottomsheet("Pilih Voucher");
                        setShowBottomsheet(true);
                        setDataBottomsheet(
                            <AllVoucher setSelectedVoucherId={setSelectedVoucherId} />
                        )
                    }}
                >
                    {/* LBM - OLIVER - MULTIBAHASA - MP - 020 */}
                    {t("labelLihatSemuaBuyer")}
                </button>
            </div>
            <div className="flex items-center gap-x-4 overflow-x-auto scrollbar-none w-[calc(100vw_-_16px)]">
                {sellerVouchers.map((item, key) => {
                    const voucher = {
                        ...item,
                        // LBM - OLIVER - FIX PENGGUNAAN PROPERTY DARI API VOUCHER - MP - 020
                        usageCount: Number(item.usageCount),
                        usageQuota: item.usage_quota,
                    }
                    return (
                        <div className="min-w-[293px]" key={key}>
                            <VoucherCard
                                voucher={voucher}
                                onClickDetail={() => {
                                    setScreen("voucher")
                                    setSelectedVoucherId(item.uuid)
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
                                onRefreshVoucher={onRefreshVoucher}
                                
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default VoucherContainer