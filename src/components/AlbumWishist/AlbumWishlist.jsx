"use client";
import { useState, useEffect } from "react";
import SWRHandler from "@/services/useSWRHook";
import useWishlist from "@/store/wishlist";
import toast from "@/store/toast";
import Modal from "@/components/Modals/modal";
import Input from "@/components/Input/Input";
import DataNotFound from "../DataNotFound/DataNotFound";
import ImageComponent from "../ImageComponent/ImageComponent";
import { X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import useAlbumStore from "@/store/album";
import { userZustand } from "@/store/auth/userZustand";
import { useCustomRouter } from "@/libs/CustomRoute";
import Button from "../Button/Button";
import { ImageGrid } from "@/app/album/AlbumWeb";
import ConfigUrl from "@/services/baseConfig";

const FavoriteModal = ({ isOpen, onClose, data }) => {
  const { setModalNewAlbum, idProductWishlist } = useWishlist();
  const { id } = userZustand();
  const [open, setOpen] = useState(isOpen);
  const router = useCustomRouter();
  const { useSWRMutateHook, useSWRHook } = SWRHandler();

  const [target, setTarget] = useState(0);

  const [triggerWishlist, setTriggerWishlist] = useState(0);
  const { t } = useLanguage();
  const { data: resMoveAlbum, trigger: moveOption } = useSWRMutateHook(
    `${process.env.NEXT_PUBLIC_GLOBAL_API}v1/muatparts/albums/${target}/items`,
    "POST"
  );
  const { setShowToast, setDataToast } = toast();

  const addAlbumNew = () => {
    onClose();
    setModalNewAlbum(true);
  };

  const ALBUM_ENDPOINT = id ? "v1/muatparts/albums" : null;
  const { data: resAlbum, mutate: mutateAlbum } = useSWRHook(ALBUM_ENDPOINT);

  useEffect(() => {
    if (target != 0) {
      moveOption({
        productIds: [idProductWishlist],
      });
      setShowToast(true);
      setDataToast({
        type: "success",
        message: "Berhasil memindahkan album",
      });
      setOpen(false);
      onClose();
    }
  }, [triggerWishlist]);

  useEffect(() => {
    if (resMoveAlbum) mutateAlbum();
  }, [resMoveAlbum]);

  const moveAlbum = (item) => {
    setTarget(() => {
      return item.id;
    });
    setTriggerWishlist(Math.round(Math.random() * 99999));
  };

  const redirectFavorit = () => {
    onClose();
    router.push("/album");
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-lg w-[471px] relative px-6 py-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5 text-primary-700 " />
        </button>

        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col space-y-2">
              <h2 className="font-bold text-neutral-900">
                {t("labelTersimpanDifavorit")}
              </h2>
              {data?.Data?.albums?.length > 1 && (
                <p className="text-sm text-gray-600">
                  {t("labelSimpanJugakeAlbum")}
                </p>
              )}
            </div>
            <span
              onClick={redirectFavorit}
              className="text-[#176cf7] cursor-pointer text-[12px] "
            >
              {t("labelCekFavoritKamu")}
            </span>
          </div>
          {data?.Data?.albums?.length > 1 ? (
            data?.Data?.albums.map(
              (item) =>
                item.type != "GENERAL" && (
                  <div
                    className="cursor-pointer"
                    onClick={() => moveAlbum(item)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-white border-solid border-[#d7d7d7] rounded-md">
                        {/* <ImageComponent
                          width={20}
                          className={`w-6 h-6 rounded`}
                          src="/img/daftarprodukicon.png"
                          height={30}
                        /> */}

                        <div className="h-10 w-10">
                          <ImageGrid images={item.thumbnails} small />
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        <div className="text-neutral-900">{item.name}</div>
                        <div className="text-neutral-600">
                          {item.itemCount} {t("labelAlbumBarang")}
                        </div>
                      </div>
                    </div>
                  </div>
                )
            )
          ) : (
            <DataNotFound
              title="Kamu Belum Punya Album"
              type="data"
              width={95}
              height={76}
            >
              <div className="font-semibold text-center text-neutral-600">
                {t("labelKamuBelumPunyaAlbum")}
              </div>
              <p className="text-xs text-center font-medium text-neutral-600">
                {t("labelFavoritPunyaFItur")}
              </p>
            </DataNotFound>
          )}
          {/* Content area */}

          {/* Action buttons */}
        </div>
        <div className="mt-4">
          <Button
            children={t("labelTambahalbumBaru")}
            Class="min-w-full h-8 !font-semibold"
            onClick={addAlbumNew}
          />
        </div>
      </div>
    </div>
  );
};

const AlbumWishlist = () => {
  const {
    setDataAlbum,
    setFetchDetail,
    modalMoveAlbum,
    setModalMoveAlbum,
    triggerAlbum,
    valueAddItems,
    clearAddItems,
    setAddItemsName,
    setAddItemsTarget,
    setMoveAlbumTarget,
    setMoveAlbumName
  } = useAlbumStore();
  const { t } = useLanguage();
  const { id } = userZustand();
  const {
    modalNewAlbum,
    setModalNewAlbum,
    modalListFavorite,
    setModalListFavorite,
    setModalEditAlbum,
    modalEditAlbum,
    valueEditWishlist,
  } = useWishlist();
  const [formAlbumText, setFormAlbumText] = useState("");

  const [validateAlbumText, setValidateAlbumText] = useState(false);
  const [formAlbumTextEdit, setFormAlbumTextEdit] = useState(
    valueEditWishlist.name
  );
  const [validateAlbumTextEdit, setValidateAlbumTextEdit] = useState(false);
  const { useSWRHook, useSWRMutateHook } = SWRHandler();
  const { setShowToast, setDataToast } = toast();
  const { data: resAddAlbum, trigger: typeOptions } = useSWRMutateHook(
    `${process.env.NEXT_PUBLIC_GLOBAL_API}v1/muatparts/albums`,
    "POST"
  );
  const { data: resEditAlbum, trigger: triggerUpdateAlbum } = useSWRMutateHook(
    `v1/muatparts/albums/${valueEditWishlist.id}`,
    "PUT"
  );

  const ALBUM_ENDPOINT = id ? "v1/muatparts/albums" : null;
  const { data: resAlbum, mutate: mutateAlbum } = useSWRHook(ALBUM_ENDPOINT);

  useEffect(() => {
    if (!modalNewAlbum) {
      setFormAlbumText("");
      setValidateAlbumText(false);
    }
  }, [modalNewAlbum]);

  useEffect(() => {
    if (resAlbum) {
      setDataAlbum(resAlbum.Data?.albums);
    }
  }, [resAlbum]);

  useEffect(() => {
    setFormAlbumTextEdit(valueEditWishlist.name);
  }, [valueEditWishlist]);

  const onSave = () => {
    if (formAlbumText == "" || formAlbumText.trim() == "") {
      setValidateAlbumText(true);
      return;
    }
    typeOptions({
      name: formAlbumText,
    })
      .then(() => {
        setDataToast({
          type: "success",
          message: t("labelBerhasilAddAlbum"),
        });
      })
      .catch((err) => {
        if (err) {
          setDataToast({
            type: "error",
            message: err?.response?.data?.Data,
          });
        }
      });
    setShowToast(true);
    setModalNewAlbum(false);
  };

  const onSaveUpdate = () => {
    if (formAlbumTextEdit == "") {
      setValidateAlbumTextEdit(true);
      return;
    }
    triggerUpdateAlbum({
      name: formAlbumTextEdit,
    })
      .then((data) => {
        setDataToast({
          type: "success",
          message: t("AppMuatpartsWishlistBerhasilMengubah"),
        });
      })
      .catch((err) => {
        if (err) {
          setDataToast({
            type: "error",
            message: err?.response?.data?.Data,
          });
        }
      });
    setShowToast(true);
    setModalEditAlbum(false);
  };

  useEffect(() => {
    if (resAddAlbum || resEditAlbum || triggerAlbum) {
      mutateAlbum();
    }

    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0147
    if (resAddAlbum) {
      // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0364
      setMoveAlbumName(resAddAlbum.data.Data?.album.name)
      setMoveAlbumTarget(resAddAlbum.data.Data?.album.id)

      setAddItemsName(resAddAlbum.data.Data?.album.name);
      setAddItemsTarget(resAddAlbum.data.Data?.album.id);
    }
  }, [resAddAlbum, resEditAlbum, triggerAlbum]);

  const ADD_ALBUM_ITEMS_ENDPOINT =
    process.env.NEXT_PUBLIC_GLOBAL_API +
    `v1/muatparts/albums/${valueAddItems.targetAlbumId}/items`;
  const { data: resAddItems, trigger: triggerAddItems } = useSWRMutateHook(
    ADD_ALBUM_ITEMS_ENDPOINT,
    "POST"
  );

  useEffect(() => {
    if (valueAddItems.targetAlbumId && valueAddItems?.productIds?.length > 0) {
      triggerAddItems(valueAddItems);
    }
  }, [valueAddItems]);

  useEffect(() => {
    if (resAddItems) {
      mutateAlbum();
      clearAddItems();
    }
  }, [resAddItems]);

  useEffect(() => {
    if (resEditAlbum) {
      setFetchDetail(true);
    }
  }, [resEditAlbum]);

  return (
    <>
      <Modal
        isOpen={modalNewAlbum}
        setIsOpen={setModalNewAlbum}
        closeArea={false}
        closeBtn={true}
        action1={{
          action: () => setModalNewAlbum(false),
          text: t("labelBatalButton"),
          style: "outline",
          color: "#176CF7",
          customStyle: {
            width: "112px",
          },
        }}
        action2={{
          action: onSave,
          text: t("labelSimpanButton"),
          style: "full",
          color: "#176CF7",
          customStyle: {
            width: "112px",
            color: "#ffffff",
          },
        }}
      >
        <div className="flex justify-center align-middle text-center px-[24px] flex-col gap-[24px]">
          <div
            className={`flex justify-center flex-col items-center font-[700] text-[16px] leading-[19.2px] text-[#000000] text-center`}
          >
            {t("labelTambahalbumBaru")}
          </div>
          <div className="flex justify-center gap-8px mb-4">
            <Input
              maxLength="20"
              classname="w-[338px]"
              status={validateAlbumText && "error"}
              changeEvent={(event) => {
                setValidateAlbumText(false);
                setFormAlbumText(event.target.value);
              }}
              supportiveText={{
                title: validateAlbumText && "Nama album wajib diisi",
                desc: `${formAlbumText.length}/20`,
              }}
              placeholder={t("labelMasukkanNamaAlbum")}
            />
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={modalEditAlbum}
        setIsOpen={setModalEditAlbum}
        closeArea={false}
        closeBtn={true}
        action1={{
          action: () => setModalEditAlbum(false),
          text: t("labelBatalButton"),
          style: "outline",
          color: "#176CF7",
          customStyle: {
            width: "112px",
          },
        }}
        action2={{
          action: onSaveUpdate,
          text: t("labelSimpanButton"),
          style: "full",
          color: "#176CF7",
          customStyle: {
            width: "112px",
            color: "#ffffff",
          },
        }}
      >
        <div className="flex justify-center align-middle text-center px-[24px] flex-col gap-[24px]">
          <div
            className={`flex justify-center flex-col items-center font-[700] text-[16px] leading-[19.2px] text-[#000000] text-center`}
          >
            {t("labelUbahNamaAlbum")}
          </div>
          <div className="flex justify-center gap-8px">
            <Input
              maxLength="20"
              classname="w-[338px]"
              status={validateAlbumTextEdit && "error"}
              changeEvent={(event) => {
                setValidateAlbumTextEdit(false);
                setFormAlbumTextEdit(event.target.value);
              }}
              supportiveText={{
                title:
                  validateAlbumTextEdit &&
                  t("AppMuatpartsWishlistNamaAlbumWajib"),
                desc: `${formAlbumTextEdit.length}/20`,
              }}
              value={formAlbumTextEdit}
              placeholder={t("labelUbahNamaAlbum")}
            />
          </div>
        </div>
      </Modal>
      <FavoriteModal
        isOpen={modalListFavorite}
        data={resAlbum}
        onClose={() => setModalListFavorite(false)}
      />
    </>
  );
};

export default AlbumWishlist;

export const FavoriteWishlistResponsive = ({
  data,
  onAddNewAlbum,
  product,
  mutateAlbum,
}) => {
  const router = useCustomRouter();
  const { setShowToast, setDataToast, setShowBottomsheet } = toast();
  const { post } = ConfigUrl();
  const checkAlbumSet = data.find((q) => q.type !== "GENERAL");
  const { t } = useLanguage();

  const handleMoveAlbum = async (album) => {
    try {
      await post({
        path: `v1/muatparts/albums/${album.id}/items`,
        data: { productIds: [product] },
      });
      setShowBottomsheet(false);
      setShowToast(true);
      setDataToast({
        type: "success",
        message: `${t("AppMuatpartsWishlistBerhasilMenambahkanKe")} ${
          album.name
        }`,
      });
      mutateAlbum();
    } catch (error) {
      console.log(error, " err");
      setShowBottomsheet(false);
      setShowToast(true);
      setDataToast({
        type: "error",
        message: error?.message,
      });
    }
  };

  return (
    <>
      {data && checkAlbumSet !== undefined ? (
        <>
          <div className="flex items-center pb-6">
            <p className="text-sm font-semibold">
              {t("AppMuatpartsWishlistSimpanJuga")}{" "}
            </p>
            <label className="text-[10px] -mt-[2px] ml-1">
              ({t("AppMuatpartsWishlistOpsional")})
            </label>
          </div>
          <div className="space-y-3 mb-4 overflow-auto max-h-64">
            {data?.map(
              (album) =>
                album.type !== "GENERAL" && (
                  <div
                    key={album.id}
                    className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => handleMoveAlbum(album)}
                  >
                    <div className="size-[42px] content-center rounded-md overflow-hidden border border-neutral-400">
                      <ImageComponent
                        src={
                          album?.thumbnails[0] || "/img/daftarprodukicon.png"
                        }
                        width={42}
                        height={42}
                        className={`size-full ${
                          !album?.thumbnails[0] && "w-[34px] h-[28px] m-auto"
                        }`}
                      />
                      {/* <ImageGrid images={album.thumbnails} small /> */}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{album.name}</p>
                      <p className="text-xs font-medium text-neutral-600">
                        {album.itemCount} {t("labelProdukBuyer")}
                      </p>
                    </div>
                  </div>
                )
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center pb-3 pt-2 space-y-1">
          <ImageComponent
            src="/img/daftarprodukicon.png"
            alt="Empty Album"
            width={95}
            height={76}
          />
          <p className="font-semibold text-neutral-600 text-base">
            {t("AppMuatpartsWishlistNoAlbumYet")}
          </p>
          <p className="text-xs font-medium text-center text-neutral-600 !w-[328px]">
            {t("labelFavoritPunyaFItur")}
          </p>
        </div>
      )}
      <div className="flex w-full gap-1">
        <Button
          Class="!w-[50%] !min-w-[50%] !h-8 !text-sm !font-semibold"
          onClick={() => {
            setShowBottomsheet(false);
            router.push("/album");
          }}
          children={t("AppMuatpartsWishlistCekFavorit")}
          color="primary_secondary"
        />

        <Button
          iconLeft="/icons/Plus.svg"
          Class="!w-[50%] !min-w-[50%] !h-8 !text-sm !font-semibold"
          onClick={onAddNewAlbum}
          children={t("labelAlbumbaru")}
        />
      </div>
    </>
  );
};
