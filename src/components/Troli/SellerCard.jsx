import style from "./Troli.module.scss";

import Checkbox from "../Checkbox/Checkbox";
import ProductList from "./ProductList";

import { MapPin } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import LocationManagementModalWeb from "@/containers/LocationManagementModalWeb/LocationManagementModalWeb";
import SWRHandler from "@/services/useSWRHook";
import useTroliStore from "@/store/troli";
import ModalPilihVoucher from "../Voucher/checkout/ModalPilihVoucher";
import ImageComponent from "../ImageComponent/ImageComponent";
import debounce from "@/libs/debounce";
import { useLanguage } from "@/context/LanguageContext";
import { object } from "prop-types";

const SellerCard = ({
  items: initialItems,
  seller,
  destinationAddress,
  onDeleteCart,
  onPutCart,
  mutateCart,
  onUseVoucher,
  index,
  subtotal = 0, // Default to 0 if not provided
}) => {
  const { t } = useLanguage();
  const [dataUsedVoucher, setDataUsedVoucher] = useState(null);
  const [dataUsedTransaction, setDataUsedTransaction] = useState(null);

  const toggleUsedVoucher = (data) => {
    setDataUsedVoucher((prev) => (prev === data ? null : data));
  };

  const toggleUsedTransaction = (data) => {
    setDataUsedTransaction((prev) => (prev === data ? null : data));
  };

  const PUT_CART_ENDPOINT = "v1/muatparts/cart/items";

  const [items, setItems] = useState();
  const [modalVoucher, setModalVoucher] = useState(false);
  const [getIndexLocationMultiple, setIndexLocationMultiple] = useState({
    index: 0,
    location: {},
  });

  function isEmpty(obj) {
    if(obj) return Object.keys(obj).length == 0;
    return !!obj
  }

  useEffect(() => {
    if (!isEmpty(destinationAddress)) {
      // Create transformed address object directly in the useEffect
      const transformedAddress = {};

      // Only map properties that exist in the source object

      // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB - 0069
      if (destinationAddress?.id) transformedAddress.ID = destinationAddress?.id;
      if (destinationAddress?.name)
        transformedAddress.Name = destinationAddress?.name;
      if (destinationAddress?.address)
        transformedAddress.Address = destinationAddress?.address;
      if (destinationAddress?.addressDetail)
        transformedAddress.AddressDetail = destinationAddress?.addressDetail;
      if (destinationAddress?.lat)
        transformedAddress.Latitude = destinationAddress?.lat;
      if (destinationAddress?.lng)
        transformedAddress.Longitude = destinationAddress?.lng;
      if (destinationAddress?.province)
        transformedAddress.Province = destinationAddress?.province;
      if (destinationAddress?.city)
        transformedAddress.City = destinationAddress?.city;
      if (destinationAddress?.district)
        transformedAddress.District = destinationAddress?.district;
      if (destinationAddress?.postalCode)
        transformedAddress.PostalCode = destinationAddress?.postalCode;
      if (destinationAddress?.picName)
        transformedAddress.PicName = destinationAddress?.picName;
      if (destinationAddress?.picNoTelp)
        transformedAddress.PicNoTelp = destinationAddress?.picNoTelp;

      // Update state with the transformed address
      setIndexLocationMultiple((prev) => ({
        ...prev,
        location: transformedAddress,
      }));
    }
  }, [destinationAddress]);

  const handleSubmitVoucher = () => {
    setModalVoucher(false);
    onUseVoucher(index, {
      dataUsedVoucher,
      dataUsedTransaction,
    });
  };

  const { useSWRMutateHook } = SWRHandler();

  const { data: resBatchUpdate, trigger: triggerBatchUpdate } =
    useSWRMutateHook(PUT_CART_ENDPOINT + `/batch-update`, "PUT");

  useEffect(() => {
    if (resBatchUpdate?.data?.Message.Code === 200) {
      mutateCart();
    }
  }, [resBatchUpdate]);

  useEffect(() => {
    setItems(initialItems);
    setDataUsedTransaction(null);
    setDataUsedVoucher(null);
  }, [initialItems]);

  const [checked, setChecked] = useState(false);
  const [changeAddress, setChangeAddress] = useState(false);

  const allSelected = items?.every((item) => item.Checked);
  const someSelected = items?.some((item) => item.Checked);

  const updateProduct = (index, updatedProduct) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[index] = updatedProduct;
      return newItems;
    });
  };

  const handleCheck = (checked, itemIds) => {
    const payload = {
      itemIds,
      isChecked: checked,
    };

    setItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        Checked: checked,
      }))
    );

    triggerBatchUpdate(payload);
  };

  const handleSaveAlamatMultiple = (val) => {
    setIndexLocationMultiple((a) => ({ ...a, location: val }))

    const payload = {
      itemIds: items.map((item) => item.ID),
      locationId: val.ID,
    };

    triggerBatchUpdate(payload);
  };

  function renderVoucherConditions() {
    // Check if both voucher objects have values
    const hasDataUsedVoucher =
      dataUsedVoucher && Object.keys(dataUsedVoucher).length > 0;
    const hasDataUsedTransaction =
      dataUsedTransaction && Object.keys(dataUsedTransaction).length > 0;

    // Count the number of vouchers selected
    const voucherCount =
      (hasDataUsedVoucher ? 1 : 0) + (hasDataUsedTransaction ? 1 : 0);

    // If at least one voucher is selected
    if (voucherCount > 0) {
      return (
        <button
          className="flex items-center text-xs font-medium text-primary-700"
          onClick={() => setModalVoucher(true)}
        >
          <div className="pt-px">
            {voucherCount} {t("labelVoucherTerpilih")}
          </div>
        </button>
      );
    }

    // If no vouchers are selected
    return (
      <button
        className={`${style.textButtonPrimary} ${
          someSelected ? style.active : ""
        }`}
        disabled={!someSelected}
        onClick={() => {
          setModalVoucher(true);
        }}
      >
        {t("labelGunakanVoucherPenjual")}
      </button>
    );
  }

  const debouncedEffect = useCallback(
    debounce((checked, itemIds) => {
      handleCheck(checked, itemIds);
    }, 500),
    []
  );

  return (
    <>
      <div className="px-8 pt-5 pb-1 shadow-muatmuat rounded-xl space-y-3 mt-6">
        {/* <pre>
        {JSON.stringify(items, null, 2)}
      </pre> */}

        <div className="flex justify-between">
          <Checkbox
            label={seller.name}
            checked={allSelected}
            classname="font-semibold !text-primary-700"
            onChange={(e) =>
              debouncedEffect(
                e.checked,
                items.map((item) => item.ID)
              )
            }
          />
          {renderVoucherConditions()}
        </div>
        <div className="flex items-center px-4 py-2 bg-neutral-200 gap-2 rounded-md ml-6">
          <MapPin size={16} className="text-neutral-700" />
          <div className="font-medium text-xs capitalize">
            {t("labelDikirimDari")} : {seller.city?.toLowerCase()}
          </div>
        </div>
        <div className="flex items-center px-4 py-2 gap-2 rounded-md ml-6 border border-neutral-400">
          <MapPin size={16} className="text-neutral-700" />
          <div className="font-medium text-xs capitalize">
            {t("labelDikirimKe")}:{" "}
            <strong>{destinationAddress?.name?.toLowerCase()}</strong>
          </div>
          <button
            className={`ml-auto ${style.textButtonPrimary} ${style.active}`}
            onClick={() => setChangeAddress(true)}
          >
            {t("labelUbahAlamatTujuan")}
          </button>
        </div>
        <div className="divide-y">
          {items?.map((product, index) => (
            <ProductList
              key={product.id}
              product={product}
              index={index}
              locationId={destinationAddress?.id}
              onDeleteCart={(body) => onDeleteCart(body)}
              onPutCart={(body) => onPutCart(body)}
              onUpdateProduct={updateProduct}
              onCheckedChange={checked}
              mutateCart={mutateCart}
            />
          ))}
        </div>
      </div>

      <LocationManagementModalWeb
        isOpen={changeAddress}
        setClose={() => setChangeAddress(false)}
        onSaveChange={handleSaveAlamatMultiple}
        preventDefaultSave={true}
        defaultValue={getIndexLocationMultiple.location}
      />

      <ModalPilihVoucher
        isOpen={modalVoucher}
        setIsOpen={setModalVoucher}
        sellerId={seller.id}
        productIds={items
          ?.filter((item) => item.Checked)
          .map((item) => item.ID)}
        setUsedVoucher={toggleUsedVoucher}
        setUsedTransaction={toggleUsedTransaction}
        usedVoucher={dataUsedVoucher}
        usedTransaction={dataUsedTransaction}
        totalUserTransaction={subtotal || 0}
        sellerName={seller.name}
        onSubmit={handleSubmitVoucher}
      />
    </>
  );
};

export default SellerCard;
