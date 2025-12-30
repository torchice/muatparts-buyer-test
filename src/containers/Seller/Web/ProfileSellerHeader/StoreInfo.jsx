import IconComponent from "@/components/IconComponent/IconComponent";
import Button from "@/components/Button/Button";
import SWRHandler from "@/services/useSWRHook";
import { useCustomRouter } from "@/libs/CustomRoute";
import { authZustand } from "@/store/auth/authZustand";
import { userZustand } from "@/store/auth/userZustand";
import toast from "@/store/toast";
import { useLanguage } from "@/context/LanguageContext";

function StoreInfo({ location, id, isOnline, storeName }) {
  const { setShowToast, setDataToast } = toast();
  const router = useCustomRouter()
  const { useSWRMutateHook } = SWRHandler();
  const { accessToken } = authZustand()
  const user = userZustand()
  const { trigger: submitDataRoom } = useSWRMutateHook(
    `${process.env.NEXT_PUBLIC_CHAT_API}api/rooms/muat-muat`,
    "POST",
    null,
    null,
    { loginas: "buyer" }
  );
  const { t } = useLanguage();

  const handleChatSeller = () => {
    const isLogin = accessToken && user?.id
    if (isLogin) {
      const body = {
        recipientMuatId: id,
        recipientRole: "seller",
        menuName: "Muatparts",
        subMenuName: "Muatparts",
        message: "",
        initiatorRole: "buyer",
      };
      submitDataRoom(body).then((x) => {
        setTimeout(() => {
          router.push(
            `${process.env.NEXT_PUBLIC_CHAT_URL}initiate?initiatorId=&initiatorRole=${
              body.initiatorRole
            }&recipientId=${body.recipientMuatId}&recipientRole=${
              body.recipientRole
            }&menuName=${body.menuName}&subMenuName=${
              body.subMenuName
            }&accessToken=${authZustand.getState().accessToken}&refreshToken=${
              authZustand.getState().refreshToken
            }`
          );
        }, 2000);
      });
    } else {
      router.push(`${process.env.NEXT_PUBLIC_INTERNAL_WEB}login`)
    }
  };

  return (
    <div className="flex flex-col flex-1 shrink items-center justify-center self-stretch my-auto basis-0 min-w-[240px]">
      <div className="flex flex-col w-full">
        <span className="font-bold text-[20px] leading-[24px]">
          {storeName}
        </span>
        <div className="flex gap-2 items-center self-start mt-3 text-sm font-medium">
          <div className="flex gap-x-1 items-center">
            <div className={`w-[7px] h-[7px] rounded ${isOnline ? "bg-success-400" : "bg-error-700"}`} />
            <span className="font-medium text-[14px] leading-[16.8px] text-neutral-700">
              {isOnline ? t("labelOpen") : t("labelClose")}
            </span>
          </div>
          <div className="w-1 h-1 bg-neutral-700 rounded" />
          <div className="flex gap-1 items-center self-stretch my-auto text-black whitespace-nowrap">
            <IconComponent src="/icons/location.svg" width={14} height={14} />
            <span className="font-medium text-[14px] leading-[16.8px]">
              {location}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-start self-start mt-4 text-sm font-semibold text-primary-700">
        <Button
          Class="h-8 px-6 flex gap-x-1"
          color="primary_secondary"
          onClick={handleChatSeller}
          // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 LB - 0372
        >
          <IconComponent
            src="/icons/chat-seller.svg"
            //25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0372
            classname="icon-blue"
            width={13}
            height={12}
          />
          {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0372 */}
          <span className={`font-semibold text-[14px] leading-[16.8px] text-primary-700`}>
            {t("buttonChatSeller")}
          </span>
        </Button>
        {/* // LBM - OLIVER - UBAH STYLING BUTTON SHARE LINK - MP - 020 */}
        <button
          className="p-2 border border-primary-700 rounded-[40px] hover:bg-primary-50"
          onClick={(e) => {
            const text = window.location.href;
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
            setShowToast(true);
            setDataToast({
              type: "success",
              message: t("messageSuccessCopyStoreLink"),
            });
          }}
        >
          <IconComponent
            src="/icons/share.svg"
            classname="icon-blue"
          />
        </button>
      </div>
    </div>
  );
}

export default StoreInfo;
