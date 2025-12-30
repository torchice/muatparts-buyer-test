"use client";

import { useState, useEffect, useMemo } from "react";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import style from "./Album.module.scss";
import ProductGrid from "@/components/ProductsSectionComponent/ProductGrid";
import Image from "next/image";
import { EllipsisVertical, Plus } from "lucide-react";
import Modal from "@/components/Modals/modal";
import { useCustomRouter } from "@/libs/CustomRoute";
import SWRHandler from "@/services/useSWRHook";
import toast from "@/store/toast";
import useWishlist from "@/store/wishlist";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import useAlbumStore from "@/store/album";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { useLanguage } from "@/context/LanguageContext";
import AlbumSkeleton from "./AlbumSkeleton";

function NewAlbumCard({ setModalNewAlbum }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col flex-1 shrink self-stretch pb-12 text-sm font-semibold leading-tight text-center text-black basis-0">
      <button
        className={`flex flex-col justify-center items-center bg-white rounded-xl border-primary-700 border-dashed border h-48 w-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        aria-label="Create new album"
        onClick={() => setModalNewAlbum(true)}
      >
        <Plus size={24} className="text-primary-700" />
        <div className="mt-2.5">{t("labelAlbumbaru")}</div>
      </button>
    </div>
  );
}

function ImageGrid({ images, small = false }) {
  const { t } = useLanguage();
  if (!images || images.length === 0) {
    return (
      <div
        className={`w-full sm:h-full sm:flex sm:items-center justify-center hover:bg-gray-50 bg-white h-${
          small ? "10" : "48"
        } relative rounded-xl overflow-hidden border border-neutral-400 flex`}
      >
        {small ? (
          <div className="sm:flex flex-col gap-3 sm:gap-2">
            <ImageComponent
              src={"/img/daftarprodukicon.png"}
              alt="Data Not Found"
              width={100}
              height={100}
              className={"w-7 h-6 mx-auto mt-2 sm:!w-[75px] sm:!h-[60px]"}
            />
            <span className="hidden sm:block text-neutral-600 text-xs font-semibold">
              {t("labelAlbumKamuKosong")}
            </span>
          </div>
        ) : (
          <DataNotFound
            classname={`w-${small ? "8" : "24"} mx-auto`}
            title={t("labelAlbumKamuKosong")}
            type="data"
          ></DataNotFound>
        )}
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div
        className={`w-full h-${
          small ? "10" : "48"
        } relative rounded-xl overflow-hidden border border-neutral-400 sm:!h-full`}
      >
        <Image
          src={images[0]}
          fill
          alt="album-cover-1"
          className="object-cover"
        />
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div
        className={`grid grid-cols-2 sm:h-[144px] gap-1 h-${
          small ? "10" : "48"
        } sm:!h-full`}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative rounded-xl overflow-hidden border border-neutral-400 ${
              index === 0 ? "rounded-r-none" : "rounded-l-none"
            }`}
          >
            <Image
              src={image}
              alt="album-cover-2"
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div
        className={`grid grid-cols-2 sm:h-[144px] gap-1 h-${
          small ? "10" : "48"
        }`}
      >
        <div className="relative rounded-xl overflow-hidden rounded-r-none border border-neutral-400">
          <Image
            src={images[0]}
            alt="album-cover-3"
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-rows-2 gap-1">
          {images.slice(1).map((image, index) => (
            <div
              key={index}
              className={`relative rounded-xl rounded-l-none overflow-hidden border border-neutral-400 ${
                index === 0 ? "rounded-b-none" : "rounded-t-none"
              }`}
            >
              <Image
                src={image}
                alt="album-cover-3"
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 4) {
    const getRoundStyle = (index) => {
      switch (index) {
        case 0:
          return "rounded-tl-xl";
        case 1:
          return "rounded-tr-xl";
        case 2:
          return "rounded-bl-xl";
        case 3:
          return "rounded-br-xl";
      }
    };

    return (
      <div
        className={`grid grid-cols-2 sm:h-[144px] gap-1 h-${
          small ? "10" : "48"
        }`}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative overflow-hidden border border-neutral-400 ${getRoundStyle(
              index
            )}`}
          >
            <Image
              src={image}
              alt={`album-cover-4-${index}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function AlbumCard({
  id,
  name,
  itemCount,
  type,
  thumbnails,
  fetchAlbum,
  mutateAlbum,
}) {
  const router = useCustomRouter();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const { useSWRMutateHook } = SWRHandler();
  const { setShowToast, setDataToast } = toast();
  const [idDelete, setIdDelete] = useState("");
  const [modalDelete, setModalDelete] = useState(false);

  const { setFetchAlbum } = useAlbumStore();
  const { setValueEditWishlist, setModalEditAlbum } = useWishlist();

  const menuContainerClass = `menu-container-${name.replace(
    /\s+/g,
    "-"
  )}-${itemCount}`;

  const handleClickOutside = (event) => {
    if (menuOpen && !event.target.closest(`.${menuContainerClass}`)) {
      setMenuOpen(false);
    }
  };

  const { data: resDeleteAlbum, trigger: triggerDeleteAlbum } =
    useSWRMutateHook(`v1/muatparts/albums/${idDelete}`, "DELETE");

  const deleteALbum = (id) => {
    setIdDelete(id);
    setModalDelete(true);
  };

  const onSaveDelete = (name) => {
    triggerDeleteAlbum();
    setModalDelete(false);
  };

  const ubahAlbum = (id, name) => {
    setValueEditWishlist({ id, name });
    setModalEditAlbum(true);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (resDeleteAlbum) {
      setShowToast(true);
      setDataToast({
        type: "success",
        message: "Berhasil menghapus album " + name,
      });
      mutateAlbum();
    }
  }, [resDeleteAlbum]);

  return (
    <>
      <Modal
        isOpen={modalDelete}
        setIsOpen={setModalDelete}
        closeArea={false}
        closeBtn={true}
        desc={t("AppMuatpartsWishlistYakinMenghapusAlbum")}
        action1={{
          action: () => setModalDelete(false),
          text: t("labelBatalButton"),
          style: "outline",
          color: "#176CF7",
          customStyle: {
            width: "112px",
          },
        }}
        action2={{
          action: () => onSaveDelete(name),
          text: t("labelYes"),
          style: "full",
          color: "#176CF7",
          customStyle: {
            width: "112px",
            color: "#ffffff",
          },
        }}
      ></Modal>

      <div className="flex flex-col self-stretch my-auto">
        <div
          className="cursor-pointer"
          onClick={() => router.push("/album/" + id)}
        >
          <ImageGrid images={thumbnails} />
        </div>
        <div className="flex flex-col mt-3 w-full leading-tight">
          <div className="flex justify-between text-base ">
            <div className="font-bold text-black">
              {name === "Semua Album"
                ? t("AppMuatpartsWishlistSemuaAlbum")
                : name}
            </div>
            {type !== "GENERAL" && (
              <div className={`relative ${menuContainerClass}`}>
                <EllipsisVertical
                  size={18}
                  className="text-neutral-700 cursor-pointer"
                  onClick={() => setMenuOpen(!menuOpen)}
                />
                {menuOpen && (
                  <div className="absolute top-5 right-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10 text-xs">
                    <button
                      onClick={() => ubahAlbum(id, name)}
                      className="w-full text-left px-3 py-2 rounded-t-md text-neutral-900 hover:bg-gray-100"
                    >
                      {t("labelUbahNamaAlbum")}
                    </button>
                    <button
                      onClick={() => deleteALbum(id)}
                      className="w-full text-left px-3 py-2 rounded-b-md text-error-400 hover:bg-gray-100"
                    >
                      {t("labelHapusAlbum")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="mt-2 text-xs font-medium text-neutral-600">
            {itemCount} {t("labelAlbumBarang")}
          </div>
        </div>
      </div>
    </>
  );
}

function AlbumGrid({ albumItems, setModalNewAlbum, fetchAlbum, mutateAlbum }) {
  return (
    <div className="flex flex-col justify-center p-6 bg-white rounded-xl shadow-muatmuat">
      <div className="grid grid-cols-3 gap-6">
        {albumItems.map((album) => (
          <AlbumCard
            mutateAlbum={mutateAlbum}
            key={album.id}
            fetchAlbum={fetchAlbum}
            {...album}
          />
        ))}
        <NewAlbumCard setModalNewAlbum={setModalNewAlbum} />
      </div>
    </div>
  );
}

function AlbumWeb({
  albumItems,
  lastVisited,
  recommendations,
  modalNewAlbum,
  fetchAlbum,
  mutateAlbum,
  loadingAlbum,
}) {
  const router = useCustomRouter();
  const { setModalNewAlbum } = useWishlist();
  const { t } = useLanguage();
  // console.log(albumItems)
  return (
    <>
      <div className={style.main}>
        <div className="!w-[264px]">
          <Sidebar />
        </div>
        <div className="w-[900px] space-y-6">
          {loadingAlbum ? (
            <AlbumSkeleton />
          ) : (
            <>
              <div className="flex gap-3">
                <h1 className="text-xl font-bold">{t("labelAlbumtitle")}</h1>
              </div>
              {albumItems.length === 0 ? (
                <DataEmpty
                  title={t("labelAlbumkamukosong")}
                  subtitle={t("labelAlbumisialbummudenganklik")}
                  buttonText={t("labelCariBarangyangdisukai")}
                  onButtonClick={() => router.push("/")}
                />
              ) : (
                <AlbumGrid
                  mutateAlbum={mutateAlbum}
                  albumItems={albumItems}
                  setModalNewAlbum={setModalNewAlbum}
                  fetchAlbum={fetchAlbum}
                />
              )}
              <div className="">
                <ProductGrid
                  title={t("labelAlbumTerakhirKamuLihat")}
                  grid={5}
                  totalProducts={lastVisited}
                />
                <ProductGrid
                  title={t("labelRekomendasiProdukLain")}
                  grid={5}
                  totalProducts={recommendations}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
export { ImageGrid };
export default AlbumWeb;
