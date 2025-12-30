"use client";
import { useCallback, useEffect, useState } from "react";
import style from "./Troli.module.scss";
import Checkbox from "@/components/Checkbox/Checkbox";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import ProductGrid from "@/components/ProductsSectionComponent/ProductGrid";
import SellerCard from "@/components/Troli/SellerCard";
import { useRouter } from "next/navigation";
import OrderSummary from "@/components/Troli/OrderSummary";
import useTroliStore from "@/store/troli";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useLanguage } from "@/context/LanguageContext";
import SWRHandler from "@/services/useSWRHook";
import LocationManagementModalWeb from "@/containers/LocationManagementModalWeb/LocationManagementModalWeb";
import Modal from "@/components/Modals/modal";
import Button from "@/components/Button/Button";
import debounce from "@/libs/debounce";

const TroliWeb = ({
  carts: initialCarts,
  summary,
  voucherData,
  yourWishlist,
  recommendedProducts,
  mutateCart,
}) => {
  const { useSWRMutateHook } = SWRHandler();
  const router = useRouter();
  const { t } = useLanguage();
  const { setCartDelete, setCartPut } = useTroliStore();

  const PUT_CART_ENDPOINT = "v1/muatparts/cart/items";
  const { data: resBatchUpdate, trigger: triggerBatchUpdate } =
    useSWRMutateHook(PUT_CART_ENDPOINT + `/batch-update`, "PUT");

  const [carts, setCarts] = useState([]);
  const [modalDelete, setModalDelete] = useState(false);

  const [changeAddress, setChangeAddress] = useState(false);

  const allItemsChecked = carts.every((order) =>
    order.items.every((item) => item.Checked === true)
  );

  const someItemsChecked = carts.some((order) =>
    order.items.some((item) => item.Checked === true)
  );

  useEffect(() => {
    setCarts(initialCarts);
  }, [initialCarts]);

  const setAllChecked = (checked) => {
    setCarts((prevCarts) =>
      prevCarts.map((cart) => ({
        ...cart,
        items: cart.items.map((item) => ({
          ...item,
          Checked: checked,
        })),
      }))
    );
  };

  const handleOnUseVoucher = (index, data) => {
    setCarts((prevCarts) => {
      const newCarts = [...prevCarts];
      newCarts[index] = {
        ...newCarts[index],
        usedVouchers: data,
      };
      return newCarts;
    });
  };

  const handleSelectAll = async (checked, itemIds) => {
    const payload = {
      itemIds,
      isChecked: checked,
    };

    await triggerBatchUpdate(payload);

    setAllChecked(checked);
  };

  useEffect(() => {
    if (resBatchUpdate?.data?.Message.Code === 200) {
      mutateCart();
    }
  }, [resBatchUpdate]);

  const handleSaveAlamatMultiple = (val) => {
    const payload = {
      itemIds: carts.flatMap((order) =>
        order.items.filter((item) => item.Checked).map((item) => item.ID)
      ),
      locationId: val.ID,
    };

    triggerBatchUpdate(payload);
  };

  const debouncedEffect = useCallback(
    debounce((checked, itemIds) => {
      handleSelectAll(checked, itemIds);
    }, 500),
    []
  );

  return (
    <div className={style.main}>
      <PageTitle title={t("labeltrolibuyer")} />
      {carts?.length === 0 ? (
        <DataEmpty
          title={t("labelwahtrolibelanja")}
          subtitle={t("labelyukisidenganbarang")}
          buttonText={t("labelariprodukbuyer")}
          onButtonClick={() => router.push("/")}
        />
      ) : (
        <div className="flex gap-4">
          <div className="w-[846px]">
            <div className="flex justify-between px-8 py-5 shadow-muatmuat rounded-xl">
              <Checkbox
                label={t("labelPilihSemuaBuyer")}
                classname="font-medium"
                checked={allItemsChecked}
                onChange={(e) => {
                  debouncedEffect(
                    e.checked,
                    carts.flatMap((order) => order.items.map((item) => item.ID))
                  );
                }}
              />
              <div className="flex gap-6">
                <button
                  disabled={!someItemsChecked}
                  className={`${style.textButtonPrimary} ${
                    someItemsChecked ? style.active : ""
                  }`}
                  onClick={() => {
                    setChangeAddress(true);
                  }}
                >
                  {t("labelUbahAlamatTujuan")}
                </button>
                <button
                  disabled={!someItemsChecked}
                  className={`${style.textButtonError} ${
                    someItemsChecked ? style.active : ""
                  }`}
                  onClick={() => {
                    setModalDelete(true);
                  }}
                >
                  {t("labelHapusAlbum")}
                </button>
              </div>
            </div>
            {carts?.map((item, index) => (
              <SellerCard
                key={item.id}
                index={index}
                seller={item.seller}
                items={item.items}
                destinationAddress={item.destinationAddress}
                onDeleteCart={(body) => setCartDelete(body)}
                onPutCart={(body) => setCartPut(body)}
                onUseVoucher={handleOnUseVoucher}
                mutateCart={mutateCart}
                subtotal={item.subtotal}
              />
            ))}
          </div>

          <div className="w-[338px]">
            <OrderSummary summary={summary} data={carts} />
          </div>
        </div>
      )}

      {yourWishlist.length > 0 && (
        <ProductGrid
          totalProducts={yourWishlist.map((item) => ({ ...item, AtTroli: true }))}
          grid={6}
          title={t("labelProdukWishlist")}
        />
      )}
      {recommendedProducts.length > 0 && (
        <ProductGrid
          totalProducts={recommendedProducts.map((item) => ({ ...item, AtTroli: true }))}
          grid={6}
          title={t("labelRekomendasiProdukLain")}
        />
      )}

      <LocationManagementModalWeb
        isOpen={changeAddress}
        setClose={() => setChangeAddress(false)}
        onSaveChange={handleSaveAlamatMultiple}
        preventDefaultSave={true}
        defaultValue={{ID: null}}
      />

      <Modal
        isOpen={modalDelete}
        setIsOpen={setModalDelete}
        closeArea={false}
        closeBtn={true}
      >
        <div className="space-y-6">
          <div className="text-center font-medium text-sm">
            Apakah kamu yakin ingin menghapus isi Troli?
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button
              color="primary_secondary"
              onClick={() => {
                setModalDelete(false);
              }}
              Class="!h-8 !font-semibold !pb-2"
            >
              {t('buttonCancel')}
            </Button>
            <Button
              onClick={() => {
                setModalDelete(false);
                setCartDelete({
                  itemIds: carts.flatMap((order) =>
                    order.items
                      .filter((item) => item.Checked)
                      .map((item) => item.ID)
                  ),
                });
              }}
              Class="!h-8 !font-semibold !pb-2"
            >
              {t('buttonYes')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TroliWeb;
