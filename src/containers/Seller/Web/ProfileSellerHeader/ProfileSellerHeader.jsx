import { useLanguage } from "@/context/LanguageContext";
import StoreInfo from "./StoreInfo"
import StoreMetrics from "./StoreMetrics"
import ImageComponent from "@/components/ImageComponent/ImageComponent"

const ProfileSellerHeader = ({
    sellerProfile
}) => {
    const { t } = useLanguage();
    return (
        <div className="p-6 flex flex-row gap-3 items-center w-full border-b border-b-neutral-400">
            {/* FIX BUG Pengecekan Ronda Muatparts LB-0132 */}
            {/* LBM - OLIVER - FIX POSISI LABEL TUTUP - MP - 020 */}
            <div className="size-[89px] relative">
                <div className={`flex items-center justify-center size-[89px] rounded-[50px] overflow-hidden ${sellerProfile?.logo ? "" : "bg-[#C8C8C8]"}`}>
                    {/* FIX BUG Profil Seller Sisi Buyer LB-0032 */}
                    {/* FIX BUG Profil Seller Sisi Buyer LB-0037 */}
                    {/* FIX BUG Pengecekan Ronda Muatparts LB-0041 */}
                    {sellerProfile?.logo ? (
                        <ImageComponent
                            loading="lazy"
                            src={sellerProfile.logo}
                            alt="logo"
                            // LBM - OLIVER - FIX STYLING FOTO PROFIL SELLER - MP - 020
                            className="w-full h-full"
                            width={100}
                            height={100}
                        />
                    ) : (
                        <ImageComponent
                            loading="lazy"
                            src={"/img/seller_logo.png"}
                            alt="logo"
                            className="object-contain m-auto aspect-square"
                            width={46}
                            height={46}
                        />
                    )}
                </div>
                {/* INI PERLU DIHAPUS ? BELAKANG SELLERPROFILE */}
                {!sellerProfile.isOnline ? (
                    <div className="h-5 flex px-1 bg-error-400 top-[71px] left-1/2 -translate-x-1/2 absolute rounded">
                        <div className='my-auto font-semibold text-[12px] leading-[14.4px] text-neutral-50'>
                            {t("labelClose")}
                        </div>
                    </div>
                ) : null}
            </div>
            <StoreInfo
                location={sellerProfile.location}
                id={sellerProfile.id}
                isOnline={sellerProfile.isOnline}
                lastOnline={sellerProfile.lastOnline}
                storeName={sellerProfile.name}
            />
            <StoreMetrics
                metrics={sellerProfile.metrics}
                operationalHours={sellerProfile.operationalHours}
            />
        </div>
    )
}

export default ProfileSellerHeader