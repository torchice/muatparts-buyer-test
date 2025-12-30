import { useHeader } from "@/common/ResponsiveContext";
import Button from "@/components/Button/Button";
import ButtonBottomMobile from "@/components/ButtonBottomMobile/ButtonBottomMobile";
import CardOrderProduct from "@/components/CardOrderProduct/CardOrderProduct";
import CountDownMobile from "@/components/CountDownMobile/CountDownMobile";
import IconComponent from "@/components/IconComponent/IconComponent";
import Input from "@/components/Input/Input";
import ModalComponent from "@/components/Modals/ModalComponent";
import DropshipCard from "@/components/OrderComponents/DropshipCard";
import PaymentInformationMobile from "@/components/PaymentInformationMobile/PaymentInformationMobile";
import RadioButton from "@/components/Radio/RadioButton";
import { useLanguage } from "@/context/LanguageContext";
import { formatDate } from "@/libs/DateFormat";
import { numberFormatMoney } from "@/libs/NumberFormat";
import { metaSearchParams } from "@/libs/services";
import SWRHandler from "@/services/useSWRHook";
import { useEffect, useState } from "react";

function WaitingForPaymnet({
  detailPesanan,
  handleTerapkan,
  showBatalPesanan = false,
  handleBatalPesanan,
  multipleButtonBottom = false,
  textLeftButton,
  textRightButton,
  onClickLeft,
  onClickRight,
  onClick,
  onShowAllProduct,
}) {
  const { t } = useLanguage();
  const { setScreen } = useHeader();
  const [paramsDownload, setParamsDownload] = useState(null);
  const { useSWRHook } = SWRHandler();
  const { data, error } = useSWRHook(
    paramsDownload
      ? `v1/muatparts/transaction/print?${metaSearchParams(paramsDownload)}`
      : null
  );
  useEffect(() => {
    if (error) setParamsDownload(null);
  }, []);
  useEffect(() => {
    if (data?.Data) window.open(data.Data, "_blank");
  }, [data]);
  // const {useSWRMutateHook,useSWRHook} = SWRHandler()
  // const {data:reject_options}=useSWRHook('v1/muatparts/orders/cancel_options')
  // const {trigger:cancelOrder}=useSWRMutateHook(process.env.NEXT_PUBLIC_GLOBAL_API+'v1/muatparts/orders/cancel')
  // const [showCancel,setShowCancel]=useState(false)
  // const [cancelReason,setCancelReason]=useState('')
  // const [cancelReasonID,setCancelReasonID]=useState('')
  // const [getReason,setReason]=useState('')
  // const [getValidation,setValidation]=useState('')
  // function handleCancelorder() {
  //     cancelOrder({
  //         orderID:detailPesanan?.orderID,
  //         reason:cancelReason.toLowerCase()==='lainnya'?getReason:cancelReason,
  //         cancelOptionID:cancelReasonID
  //     })
  // }
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0774
  return (
    <>
      {detailPesanan.storeOrders[0].isDropship && (
        <DropshipCard
          name={detailPesanan.storeOrders[0].dropshipName}
          phone={detailPesanan.storeOrders[0].dropshipPhone}
        />
      )}
      <div className="py-6 bg-neutral-50 text-neutral-900 flex flex-col w-full">
        <div className="bg-secondary-100 rounded-md p-3 flex justify-between mx-4">
          <span className="flex flex-col gap-[10px]">
            <span
              className={`bold-sm text-warning-900 ${detailPesanan?.statusInfo?.statusInfoBuyer}`}
            >
              {t("LabelfilterProdukBayarSebelum")}
            </span>
            {/* // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0366 */}
            <span className="medium-xs">
              {formatDate(detailPesanan?.paymentInfo?.paymentDeadline)}
            </span>
          </span>
          <CountDownMobile date={detailPesanan?.paymentInfo?.paymentDeadline} />
        </div>
        <PaymentInformationMobile
          amount={detailPesanan?.paymentInfo?.totalBill}
          bankAccount={detailPesanan?.paymentInfo?.virtualAccount}
          bankName={detailPesanan?.paymentInfo?.paymentMethod}
          bankLogo={detailPesanan?.paymentInfo?.methodLogo}
        />
      </div>
      {detailPesanan?.storeOrders?.map((val, i) => {
        return (
          <div
            key={i}
            className="containerMobile flex flex-col gap-6 bg-neutral-50 text-neutral-900 pb-6"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-1">
                <IconComponent src={"/icons/product-house.svg"} />
                <span className="semi-sm">{val?.storeName}</span>
              </div>
              <span className="bg-neutral-200 h-fit rounded-md text-neutral-700 flex items-center gap-2 px-3 py-1">
                <IconComponent src={"/icons/marker-outline.svg"} />
                <span className="medium-xs">
                  {t("labelDikirimDari")} : {val.shippingOrigin}
                </span>
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <span className="medium-sm text-neutral-600">
                {t("LabelfilterProdukNomorInvoice")}
              </span>
              {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0497 */}
              {/* LBM */}
              <span
                className="medium-sm text-primary-700 flex items-center gap-1"
                onClick={() =>
                  setParamsDownload({
                    [`transactionIds[${i}]`]:
                      detailPesanan?.storeOrders?.[0]?.transactionID,
                  })
                }
              >
                <span>{val?.invoiceNumber}</span>
                <IconComponent
                  src={"/icons/download.svg"}
                  classname={"icon-blue"}
                />
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <span className="medium-sm text-neutral-600">
                {t("AppKelolaPesananSellerMuatpartsKurir")}
              </span>
              <span className="medium-sm ">{val?.shippingInfo?.courier}</span>
            </div>
            <div className="flex flex-col gap-4 pb-6 border-b border-neutral-400">
              <span className="medium-sm text-neutral-600">
                {t("InputAddress")}
              </span>
              <span className="semi-sm ">
                {val?.shippingInfo?.recipientAddressName}
              </span>
              <span className="medium-sm ">
                {val?.shippingInfo?.recipientName} (
                {val?.shippingInfo?.recipientPhone})
              </span>
              <span className="medium-sm ">
                {val?.shippingInfo?.recipientAddress}
              </span>
              {val?.shippingInfo?.note && (
                <span className="medium-sm ">
                  {t("KontrakHargaIndexCatatan")}: {val?.shippingInfo?.note}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-6">
              <span className="medium-sm">
                {t("AppKelolaProdukMuatpartsTambahProdukSubtitle2")}
              </span>
              <div className="flex flex-col border-b border-neutral-400">
                {val?.items?.map((product, i) => {
                  return (
                    <CardOrderProduct
                      classname={"pb-8"}
                      key={i}
                      name={product?.productName}
                      description={product?.productDetails}
                      afterPrice={product?.originalPromoPrice}
                      beforePrice={product?.originalPrice}
                      catatan={product?.note}
                      quantity={product?.quantity}
                      discount={product?.discountedPercentage}
                      image={product?.imageUrl}
                    />
                  );
                })}
                {/* {
                                        val?.items?.length>2?<span onClick={()=>{
                                            onShowAllProduct(val?.items)
                                            setScreen('show_all_products')
                                        }} className="medium-sm text-primary-700 self-end">+{val?.items.length-2} produk lainnya</span>:''
                                    } */}
              </div>
            </div>
            <div className="flex flex-col gap-6 text-neutral-900">
              <div className="flex justify-between items-center semi-sm">
                <span>{t("labelSubTotalBuyer")}</span>
                <span>{numberFormatMoney(val?.subTotal)}</span>
              </div>
              <div className="flex flex-col gap-4 medium-xs">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">
                    {t("labelTotalHarga")} ({val?.items?.length}{" "}
                    {t("titleProducts")})
                  </span>
                  <span>{numberFormatMoney(val?.totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB -  */}
                  <span className="text-neutral-600">
                    {t("radioShippingCost")} ({val?.shippingInfo?.courier} -{" "}
                    {val?.weight / 1000} kg)
                  </span>
                  <span>{numberFormatMoney(val?.shippingCost)}</span>
                </div>
                {val?.insuranceCost ? (
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">
                      {t("LabelfilterProdukBiayaAsuransiPengiriman")}
                    </span>
                    <span>{numberFormatMoney(val?.insuranceCost)}</span>
                  </div>
                ) : (
                  ""
                )}
                {val?.voucherUsed?.map((v) => (
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">
                      Voucher{" "}
                      {v?.voucherType === "Diskon Produk"
                        ? `${val?.storeName} (${v?.voucherCode})`
                        : `${v?.voucherType} ${val?.storeName} (${v?.voucherCode})`}
                    </span>
                    <span className="text-error-500 whitespace-nowrap">
                      -{numberFormatMoney(+v?.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
      <div className="flex flex-col gap-4 text-neutral-900 bg-neutral-50 py-6 px-4">
        <div className="w-full flex justify-between items-center semi-sm mb-2">
          <span>{t("AppMuatpartsAnalisaProdukTotalPesanan")}</span>
          <span>
            {numberFormatMoney(detailPesanan?.paymentInfo?.totalOrder)}
          </span>
        </div>
        {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0406 */}
        {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0561 */}
        {/* <div className='w-full flex justify-between items-center medium-xs'>
                    <span className='text-neutral-600'>Biaya {detailPesanan?.paymentInfo?.
paymentMethod}</span>
                    <span>{numberFormatMoney(detailPesanan?.paymentInfo?.adminFee)}</span>
                </div> */}
        <div className="w-full flex justify-between items-center medium-xs">
          <span className="text-neutral-600">
            {t("LabelfilterProdukBiayaAplikasi")}
          </span>
          <span>
            {numberFormatMoney(detailPesanan?.paymentInfo?.platformFee)}
          </span>
        </div>
        <div className="w-full flex justify-between items-center medium-xs">
          <span className="text-neutral-600">
            {t("LabelfilterProdukBiayaAdministrasi")}
          </span>
          <span>{numberFormatMoney(detailPesanan?.paymentInfo?.adminFee)}</span>
        </div>
        {detailPesanan?.paymentInfo?.voucherUsed?.map((v) => (
          <div className="flex justify-between items-center mt-2 font-medium text-xs">
            <div className="text-neutral-600">
              {t("AppMuatpartsDashboardSellerVoucher")}{" "}
              {/* {v.voucherType !== "Biaya Pengiriman"
                            ? v.voucherType
                            : null}{" "} */}
              Muatparts ({v.kodeVoucher})
            </div>
            <div className="text-error-400">
              -{numberFormatMoney(+v.amount)}
            </div>
          </div>
        ))}
        <span className="w-full h-[1px] bg-neutral-400"></span>
        <div className="w-full flex justify-between items-center semi-sm">
          <span>{t("LabelfilterProdukTotalTagihan")}</span>
          <span className="bold-base">
            {numberFormatMoney(detailPesanan?.paymentInfo?.totalBill)}
          </span>
        </div>
        <Button
          color="error_secondary"
          Class="!w-full !max-w-full"
          onClick={() => handleBatalPesanan("Batalkan Pesanan")}
        >
          {t("SubscriptionCancelOrder")}
        </Button>
      </div>
      {multipleButtonBottom ? (
        <ButtonBottomMobile
          textLeft={textLeftButton}
          textRight={textRightButton}
          onClickLeft={onClickLeft}
          onClickRight={onClickRight}
        />
      ) : (
        <ButtonBottomMobile classname={"py-3 px-4"}>
          <Button
            onClick={() => (onClick ? onClick : setScreen("cara_pembayaran"))}
            Class="!w-full !max-w-full"
          >
            {t("LabelfilterProdukLihatCarabayar")}
          </Button>
        </ButtonBottomMobile>
      )}
      {/* <ModalComponent full type='BottomSheet' title='Pilih Alasan Pembatalan' isOpen={showCancel} setClose={()=>setShowCancel(false)}>
                <div className='containerMobile w-full semi-sm gap-4 flex flex-col max-h-[339px] overflow-y-auto'>
                    {
                        reject_options?.Data?.map(val=>{
                            return(
                                <div key={val?.id} className='pb-4 border-b border-neutral-400 flex w-full justify-between items-center select-none' onClick={()=>{
                                    setCancelReasonID(val?.id)
                                    setCancelReason(val?.value)}}>
                                    <span>{val?.value}</span>
                                    <RadioButton label={''} checked={cancelReason===val?.value} />
                                </div>
                            )
                        })
                    }
                    
                    <div className='flex flex-col'>
                        {cancelReason==='Lainnya'&&<Input value={getReason} changeEvent={e=>{
                            if(e.target.value){
                                setValidation('')
                                setReason(e.target.value)
                            }
                        }} placeholder='Masukkan Alasan Pembatalan' classInput={'!w-full'} classname={`!w-full !max-w-full h-8 ${getValidation?'input-error':''}`} />}
                        <span className='medium-xs text-error-400 mt-3'>{getValidation}</span>
                    </div>
                    <Button disabled={!cancelReason} Class='!w-full !max-w-full mb-4' onClick={()=>{
                        if(cancelReason==='Lainnya'&&!getReason){
                            setValidation('Alasan Pembatalan wajib diisi')
                        }else{
                            setShowCancel(false)
                            handleCancelorder()
                        }
                    }}>Terapkan</Button>
                </div>
            </ModalComponent> */}
    </>
  );
}

export default WaitingForPaymnet;
