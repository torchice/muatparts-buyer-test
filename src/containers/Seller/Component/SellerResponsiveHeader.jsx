import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import Input from "@/components/Input/Input";
import { useLanguage } from "@/context/LanguageContext";
import { useCustomRouter } from "@/libs/CustomRoute";
// 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
import useSellerStore from "@/store/seller";
import toast from "@/store/toast";

const SellerResponsiveHeader = ({ isEtalasePage, setIsEtalasePage }) => {
  const { t } = useLanguage();
  const { setShowToast, setDataToast } = toast();
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
  const { clearSearch, search, setProductByEtalase, setReviews, setSearch, setSearchQuery } = useSellerStore();
  const router = useCustomRouter();

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchQuery();
      setProductByEtalase([])
      setReviews([])
    }
  };
  
  const handleClearSearch = () => clearSearch();
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
  return (
    <div className="flex items-center justify-between h-[62px] bg-muat-parts-non-800 px-4 relative w-full">
      <div className="flex items-center gap-x-2">
        <button
          className="flex items-center justify-center w-[24px] h-[24px] bg-neutral-50 rounded-xl"
          onClick={() => {
            if (isEtalasePage) {
              clearSearch("")
              setIsEtalasePage(false);
            } else {
              router.back()
            }
          }}  
        >
          <IconComponent src={'/icons/chevron-left.svg'} classname="icon-muat-parts-non-800" />
        </button>
        <Input
          classname={`borderless-input`}
          width={{ width: "196px" }}
          placeholder={t("placeholderSearchProduct")}
          icon={{
            left: <IconComponent src={"/icons/search.svg"} />,
            right: search ? (
              <IconComponent
                classname={`z-[2]`}
                src={"/icons/silang.svg"}
                onclick={handleClearSearch}
              />
            ) : null,
          }}
          value={search}
          changeEvent={(e) => setSearch(e.target.value)}
          onKeyUp={handleSearch}
        />
      </div>
      <div className='flex gap-x-2 items-center'>
        <div
          className='flex flex-col z-30 justify-center items-center gap-[2px] select-none cursor-pointer'
          onClick={(e) => {
            const text = window.location.href
            e.preventDefault();
            if (navigator.clipboard) {
              navigator.clipboard.writeText(text);
            } else {
              const input = document.createElement("textarea");
              input.value = text;
              document.body.appendChild(input);
              input.select();
              document.execCommand("copy");
              document.body.removeChild(input);
            }
            // alert("berhasil bagikan")
            setShowToast(true);
            setDataToast({
              type: "success",
              message: "Link profil toko berhasil disalin!",
            });
          }}  
        >
          <IconComponent classname={'icon-white'} width={20} height={20} src={'/icons/share.svg'} />
          <span className='font-semibold text-neutral-50 text-[10px]'>
            {t("labelShareBuyer")}
          </span>
        </div>
        <div
          className='flex flex-col z-30 justify-center items-center gap-[2px] select-none cursor-pointer'
          onClick={()=> router.push("/troli")}
        >
          <ImageComponent alt='troli' width={20} height={20} src={process.env.NEXT_PUBLIC_ASSET_REVERSE+'/img/cart-outline.png'} />
          <span className='font-semibold text-neutral-50 text-[10px]'>
            {t("labelCart")}
          </span>
        </div>
      </div>
      <ImageComponent src={'/img/fallinstartheader.png'} width={153} height={62} alt='fallin' className='absolute right-0 bottom-0' />
    </div>
  )
}

export default SellerResponsiveHeader