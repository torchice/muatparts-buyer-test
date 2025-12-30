import Input from "@/components/Input/Input";
import SWRHandler from "@/services/useSWRHook";
import { Asterisk, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import VoucherTabsExample from "./VouchersTabs";
import Button from "@/components/Button/Button";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { formatDateRange } from "@/libs/DateFormat";
import IconComponent from "@/components/IconComponent/IconComponent";
import { formatCurrency } from "@/utils/currency";
import useVoucherMuatpartsStore from "@/store/useVoucherMuatpartsStore";
import { hitungPenghematan } from "@/utils/voucher";
import { numberFormatMoney } from "@/libs/NumberFormat";
import { viewport } from "@/store/viewport";
import { useHeader } from "@/common/ResponsiveContext";
import { usePathname } from "next/navigation";

const VoucherContent = ({ closeModal = () => {} }) => {
  const { isMobile } = viewport();
  const { setAppBar } = useHeader();
  const { useSWRHook } = SWRHandler();

  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!search) {
      setQuery("");
    }
  }, [search]);

  const VOUCHER_EP = "v1/muatparts/voucher-muatparts?q=" + query;

  const { data: { Data } = {} } = useSWRHook(VOUCHER_EP);

  const {
    selectedVouchers,
    setSelectedVouchers,
    submittedVouchers,
    setSubmitedVouchers,
    price,
    ongkir,
  } = useVoucherMuatpartsStore();

  useEffect(() => {
    setSelectedVouchers({
      purchase: submittedVouchers?.purchase || null,
      shipping: submittedVouchers?.shipping || null,
    });
  }, []);

  const hasSelected =
    Boolean(selectedVouchers?.purchase) || Boolean(selectedVouchers?.shipping);

  const [contentDetail, setContentDetail] = useState(null);

  // 25. 15 - QC Plan - Web - Imp Voucher muatparts - LB - 0025
  const pathname = usePathname();

  const onClickDetail = (voucher, activeTab) => {
    if (isMobile) {
      setContentDetail({ ...voucher, activeTab });
      setAppBar({
        title: "Detail Voucher",
        appBarType: "header_title",
        onBack: () => {
          setContentDetail(null);
          setAppBar({
            title: pathname === "/checkout" ? "Detail Pesanan" : "Troli",
            appBarType: "header_title",
          });
        },
      });
    } else {
      setContentDetail({ ...voucher, activeTab });
    }
  };

  const getDiscountUnit = (type, value) => {
    if (type === "percentage") return { displayValue: value, unit: "%" };
    else {
      if (value >= 1000000)
        return { displayValue: value / 1000000, unit: "JT" };
      if (value >= 1000) return { displayValue: value / 1000, unit: "rb" };
      return { displayValue: value, unit: "" };
    }
  };

  return (
    <>
      {contentDetail ? (
        <div className="z-[110] sm:h-full sm:max-h-none bg-white pb-4 rounded-2xl">
          <div className="relative -mt-10  sm:h-[153px] z-50">
            <ImageComponent
              src="/voucher-detail-red.png"
              className="h-full"
              alt="Voucher banner"
              width={472}
              height={118}
            />

            <div className="absolute top-0 w-full h-full">
              <div className="flex justify-between items-start my-5 sm:!my-9 mx-9 sm:!mx-4 text-white">
                <div className="ml-6 relative mt-1.5">
                  <div className="font-bold">
                    Diskon{" "}
                    {contentDetail.details.discountType === "percentage" &&
                      !contentDetail.details.isUnlimited &&
                      contentDetail.details.discountValue + "%"}
                  </div>
                  <div className="flex absolute top-[14px]">
                    <div className="font-bold self-end relative mr">
                      {!contentDetail.details.isUnlimited &&
                        contentDetail.activeTab === "purchase" && (
                          <div className="absolute text-xs sm:text-[10px] font-medium -top-5 -left-5">
                            hingga
                          </div>
                        )}

                      {/* 25. 15 - QC Plan - Web - Imp Voucher muatparts - LB - 0023 */}
                      {!contentDetail.details.isUnlimited && (
                        <div className="pb-3">Rp</div>
                      )}
                    </div>
                    <div className="font-bold text-[48px]">
                      {contentDetail.details.discountMax
                        ? getDiscountUnit(
                            null,
                            contentDetail.details.discountMax
                          ).displayValue
                        : getDiscountUnit(
                            contentDetail.details.discountType,
                            contentDetail.details.discountValue
                          ).displayValue}
                    </div>
                    <div className="relative text-xs font-medium">
                      <div className="bg-error-400 rounded-full w-[22px] h-[22px] flex justify-center items-center">
                        {contentDetail.details.discountMax
                          ? getDiscountUnit(
                              null,
                              contentDetail.details.discountMax
                            ).unit
                          : getDiscountUnit(
                              contentDetail.details.discountType,
                              contentDetail.details.discountValue
                            ).unit}
                      </div>
                      <div className="absolute bg-error-400 rounded-full -top-[3px] -right-[9px] h-[14px] w-[14px] flex justify-center items-center">
                        <Asterisk className="size-[7px]" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-y-2 sm:mt-2">
                  <ImageComponent
                    src="/muatparts-logo.png"
                    alt="muatparts"
                    height={15}
                    width={85}
                  />
                  <div className="flex gap-x-1 items-center">
                    <IconComponent src={"/icons/calendar.svg"} color="white" />
                    <span className="font-medium text-[10px] leading-[13px] pt-0.5">
                      {formatDateRange(
                        contentDetail.period.startDate,
                        contentDetail.period.endDate
                      )}
                    </span>
                  </div>
                  <span className="font-medium text-[8px] leading-[10.4px] max-w-[157px]">
                    *Kamu bisa langsung pakai voucher ini di halaman checkout
                  </span>
                </div>
              </div>

              {/* <pre>{JSON.stringify(contentDetail, null, 2)}</pre> */}
            </div>
          </div>

          <div className="p-6">
            {/* Usage Progress Bar */}
            <div className="text-xs">
              <div className="bg-neutral-200 w-full h-2 rounded-full overflow-hidden py-px px-0.5">
                <div
                  className="bg-primary-500 h-full rounded-full"
                  style={{ width: `${contentDetail.usage.userPercentage}%` }}
                ></div>
              </div>
              <p className="mt-1 text-[10px]">
                Kuota Voucher Telah Terpakai{" "}
                <span className="font-bold">
                  {contentDetail.usage.userPercentage}%
                </span>
              </p>
            </div>

            <div className="flex justify-between font-medium text-xs mt-2">
              <div className="text-neutral-700 flex items-center gap-2">
                <IconComponent src={"/icons/time.svg"} width={16} />
                <div className="pt-0.5">Berlaku hingga</div>
              </div>
              <div className="">
                {formatDateRange(null, contentDetail.period.endDate)}
              </div>
            </div>
            <div className="flex justify-between font-medium text-xs mt-2 border-b pb-4">
              <div className="text-neutral-700 flex items-center gap-2">
                <IconComponent src={"/icons/money.svg"} width={16} />
                <div className="pt-0.5">Minimum transaksi</div>
              </div>
              <div className="">
                Rp{formatCurrency(contentDetail.details.minPurchase)}
              </div>
            </div>
          </div>

          <div className="text-sm px-6 mr-2 overflow-y-scroll h-full max-h-[280px]  sm:pb-80 sm:max-h-none">
            <h2 className="font-bold mb-4">Syarat Dan Ketentuan</h2>
            <ol className="ml-4 list-decimal list-outside mb-6">
              <li>
                {`Nikmati diskon ${
                  contentDetail.activeTab === "shipping" ? "ongkos kirim" : ""
                } ${
                  contentDetail.details.discountType === "nominal"
                    ? numberFormatMoney(contentDetail.details.discountValue)
                    : `${contentDetail.details.discountValue}%`
                }${
                  contentDetail.details.discountMax
                    ? ` hingga ${numberFormatMoney(
                        contentDetail.details.discountMax
                      )}`
                    : ""
                } secara langsung!`}
              </li>
              <li>Berlaku di semua toko yang ada di Muatparts.</li>
              <li>
                Gunakan voucher ini untuk transaksi minimal{" "}
                {numberFormatMoney(contentDetail.details.minPurchase)}.
              </li>
              <li>
                1 voucher dapat digunakan hingga{" "}
                {contentDetail.usage.usageLimitUser} kali transaksi selama
                periode promo!
              </li>
              <li>
                Berlaku untuk semua produk yang tersedia di Muatparts — tanpa
                pengecualian!
              </li>
              <li>
                Voucher ini bisa digunakan melalui website dan aplikasi Android
                Muatparts.
              </li>
            </ol>

            <h2 className="font-bold mb-4">Cara Pemakaian</h2>
            <ol className="ml-4 list-decimal list-outside">
              <li>Masuk ke halaman Voucher Saya dan pilih Voucher.</li>
              <li>Masukkan produk yang Anda pilih ke keranjang belanja.</li>
              <li>
                Pada halaman Keranjang Belanja, klik bagian "Makin hemat pakai
                promo".
              </li>
              <li>Pilih jenis Voucher yang ingin digunakan.</li>
              <li>
                Kupon akan berhasil digunakan apabila pembelian barang telah
                sesuai dengan Syarat dan Ketentuan yang berlaku.
              </li>
            </ol>
          </div>

          {/* <pre className="!text-[6px]">
            {JSON.stringify(contentDetail, null, 2)}
          </pre> */}

          <Button
            children="Kembali"
            Class="!h-8 !font-semibold !pt-3 mx-auto mt-3"
            onClick={() => {
              setContentDetail(null);
              const voucherSection = document.querySelector(
                `#voucher-card-${contentDetail.identification.id}`
              );
              if (voucherSection) {
                voucherSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }}
          />
        </div>
      ) : (
        <div className="h-full  sm:h-[90%] sm:max-h-none ">
          <div className="px-6 pt-8 space-y-4 sm:pt-0 sm:px-4">
            <div className="text-center font-bold">Pilih Voucher muatparts</div>
            <Input
              value={search}
              placeholder="Cari Kode Voucher"
              icon={{
                left: "/icons/search.svg",
                right: search.length && (
                  <X
                    size={14}
                    onClick={() => {
                      setSearch("");
                      setQuery("");
                    }}
                  />
                ),
              }}
              supportiveText={{ title: "Hanya bisa dipilih 1 Voucher" }}
              changeEvent={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  setQuery(search);
                }
              }}
            />
          </div>
          <VoucherTabsExample data={Data} onClickDetail={onClickDetail} />

          {
            <div className="bg-neutral-50 w-full h-16 border-t border-neutral-400 bottom-0 z-[100] rounded-b-[10px] absolute items-center flex justify-between px-6">
              <div className="sm:hidden">
                <div className="font-medium text-xs text-neutral-600">
                  Kamu bisa hemat
                </div>
                <div className="font-bold">
                  Rp
                  {formatCurrency(
                    hitungPenghematan(selectedVouchers, price, ongkir)
                  )}
                </div>
              </div>
              <Button
                Class="!h-8 !font-semibold !pt-3 sm:!w-full !max-w-none"
                onClick={() => {
                  setSubmitedVouchers(selectedVouchers);
                  closeModal();
                }}
              >
                {hasSelected ? (
                  <>Terapkan</>
                ) : (
                  <>
                    <span className="hidden sm:block">Terapkan</span>
                    <span className="block sm:hidden">Pakai Voucher</span>
                  </>
                )}
              </Button>
            </div>
          }
        </div>
      )}
    </>
  );
};

export default VoucherContent;
