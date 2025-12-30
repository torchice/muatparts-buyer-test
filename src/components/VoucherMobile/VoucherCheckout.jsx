import { useState, useMemo, useEffect } from "react";
import VoucherCardMobile from "@/components/VoucherMobile/VoucherCardMobile";
import toast from "@/store/toast";
import useVoucherStore from "@/store/voucher";
import Button from "@/components/Button/Button";
import SWRHandler from "@/services/useSWRHook";
import { formatCurrency } from "@/utils/currency";
import { dateFormatter } from "@/utils/date";
import Input from "@/components/Input/Input";

// 24. THP 2 - MOD001 - MP - 024 - QC Plan - Web - MuatParts - Voucher Buyer - LB - 0040
const VoucherCheckout = ({
  seller_id = "",
  transaction = 0,
  product_ids = [],
  onSubmit,
}) => {
  const { usedVoucher, setUsedVoucher } = useVoucherStore();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(usedVoucher);
  const [getSelectedVoucherTmp, setSelectedVoucherTmp] = useState({
    voucherProduct: null,
    voucherOngkir: null,
  });
  const [vouchers, setVouchers] = useState([]);
  const [voucherError, setVoucherError] = useState({ id: null, message: null });

  const [selectedVoucherCategory, setSelectedVoucherCategory] =
    useState("diskon-pengiriman");

  const { showBottomsheet, setShowBottomsheet, setTitleBottomsheet } = toast();

  const { useSWRHook } = new SWRHandler();

  // const VOUCHER_CHECKOUT =
  //     showBottomsheet && seller_id ? process.env.NEXT_PUBLIC_GLOBAL_API +
  //     `muatparts/voucher/voucher-list?type=voucher-list&seller_id=${seller_id}
  //     ${(product_ids?.length > 0) ? `&product_ids=${product_ids.join(",")}
  //         ${(search !== null && search !== "") ? `kode=${search}` : ``}` : ""}` : null;

  const VOUCHER_CHECKOUT = seller_id
    ? `v1/muatparts/voucher/voucher-list?type=voucher-list&seller_id=${seller_id}${`&product_ids=${product_ids.join(
        ","
      )}`}${filter !== null && filter !== "" ? `&kode=${filter}` : ""}`
    : null;

  const { data, error, isLoading, mutate } = useSWRHook(VOUCHER_CHECKOUT);

  useEffect(() => {
    if (data?.Data) {
      setVouchers({
        "diskon-pengiriman": data.Data["diskon-pengiriman"],
        "diskon-produk": data.Data["diskon-produk"],
      });
    }
  }, [data]);

  useEffect(() => {
    if (!showBottomsheet) {
      setSelectedVoucher(null);
      setVoucherError({ id: null, message: null });
    } else {
      if (usedVoucher) setSelectedVoucher(usedVoucher);
    }
  }, [showBottomsheet]);

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      setFilter(search);
    }
  };

  const handleSelectedVoucher = (voucher) => {
    const id = voucher.uuid;
    const minTransaction = parseFloat(voucher.transactionMin);
    const isStarted = voucher.isStarted;
    const usageCount = parseInt(voucher.usageCount);
    const usageQuota = parseInt(voucher.usageQuota);

    if (isStarted === 0) {
      return setVoucherError({
        id: id,
        message: `Voucher mulai berlaku pada ${dateFormatter(
          voucher.startDate
        )}`,
      });
    }

    if (usageQuota <= usageCount) {
      return setVoucherError({
        id: id,
        message: `Kuota Voucher sudah habis`,
      });
    }

    if (transaction < minTransaction) {
      return setVoucherError({
        id: id,
        message: `Minimal Transaksi Rp${formatCurrency(minTransaction)}`,
      });
    }

    setVoucherError({ id: null, message: null });
    if (voucher?.voucherType === "Biaya Pengiriman")
      setSelectedVoucherTmp((prev) => ({ ...prev, voucherOngkir: voucher }));
    else
      setSelectedVoucherTmp((prev) => ({ ...prev, voucherProduct: voucher }));
    setSelectedVoucher(voucher);
  };

  const handleUseVoucher = () => {
    if (selectedVoucher) {
      setUsedVoucher(selectedVoucher);
      onSubmit({ sellerID: seller_id, ...getSelectedVoucherTmp });
      setShowBottomsheet(false);
    }
  };

  const category = [
    { value: "diskon-pengiriman", label: "Voucher Gratis Ongkir" },
    { value: "diskon-produk", label: "Voucher Transaksi" },
  ];

  const voucherCategoryCount = useMemo(
    () => ({
      "diskon-pengiriman": vouchers?.["diskon-pengiriman"]?.length ?? 0,
      "diskon-produk": vouchers?.["diskon-produk"]?.length ?? 0,
    }),
    [vouchers]
  );
  useEffect(() => {
    setSelectedVoucherTmp({ voucherProduct: null, voucherOngkir: null });
  }, []);
  return (
    <>
      <div className="flex flex-col gap-3">
        <Input
          onKeyDown={(e) => {
            handleSearch(e);
          }}
          placeholder="Cari Voucher"
          changeEvent={(e) => setSearch(e.target.value)}
          value={search}
          icon={{ left: "/icons/search.svg" }}
        />
        <label className="semi-xs text-neutral-600">
          Hanya bisa pilih 1 Voucher
        </label>
        <div className="flex gap-1 items-center overflow-auto scrollbar-none">
          {category.map((item, index) => (
            <div className="min-w-fit" key={`category-${index}`}>
              <Button
                key={index}
                onClick={() => setSelectedVoucherCategory(item.value)}
                Class="!font-medium !px-3 !py-2"
                color={`${
                  item.value === selectedVoucherCategory
                    ? "outline_primary"
                    : "outline_secondary"
                }`}
              >
                {item.label} ({voucherCategoryCount?.[item.value] ?? 0})
              </Button>
            </div>
          ))}
        </div>
        <div className="overflow-x-hidden flex flex-col gap-4 h-96">
          {vouchers?.[selectedVoucherCategory]?.map((item, index) => (
            <VoucherCardMobile
              type="voucher-list-checkout"
              voucher={item}
              key={index}
              handleClick={() => handleSelectedVoucher(item)}
              error={voucherError.id === item.uuid ? voucherError : null}
              selected={selectedVoucher?.uuid === item.uuid}
            />
          ))}
        </div>
        <div
          className="
                    flex justify-center rounded-t-[10px] sticky bottom-0 bg-white 
                    shadow-[0_-3px_55px_rgba(0,0,0,0.0161)]
                "
        >
          <div className="w-full">
            <Button Class="!w-full !max-w-full" onClick={handleUseVoucher}>
              Terapkan
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VoucherCheckout;
