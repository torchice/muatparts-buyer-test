import React, { useEffect, useState } from "react";
import { useHeader } from "@/common/ResponsiveContext";
import style from "./Album.module.scss";
import IconComponent from "@/components/IconComponent/IconComponent";
import { EllipsisVertical, Menu, Plus } from "lucide-react";
import { ImageGrid } from "./AlbumWeb";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import ConfigUrl from "@/services/baseConfig";
import toast from "@/store/toast";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import { modal } from "@/store/modal";
import CustomLink from "@/components/CustomLink";
import useTroliStore from "@/store/troli";
import { userLocationZustan } from "@/store/manageLocation/managementLocationZustand";
import { FavoriteWishlistResponsive } from "@/components/AlbumWishist/AlbumWishlist";
import { useCustomRouter } from "@/libs/CustomRoute";
import { useLanguage } from "@/context/LanguageContext";
import SWRHandler from "@/services/useSWRHook";
import { usePathname } from "next/navigation";
import useAlbumStore from "@/store/album";
import { authZustand } from "@/store/auth/authZustand";

function AlbumResponsive({
  albumItems,
  lastVisited,
  recommendations,
  modalNewAlbum,
  fetchAlbum,
  mutateAlbum,
  loadingAlbum,
}) {
  const {
    appBarType,
    appBar,
    renderAppBarMobile,
    setAppBar,
    handleBack,
    clearScreen,
    setScreen,
    screen,
    search,
    setSearch,
  } = useHeader();
  const {
    setShowBottomsheet,
    setDataBottomsheet,
    setTitleBottomsheet,
    setShowToast,
    setDataToast,
  } = toast();
  const router = useCustomRouter();
  const { t } = useLanguage();
  const [lastViewed, setLastViewed] = useState();
  const { useSWRHook } = SWRHandler();

  const { data: dataLastViewed, mutate: mutateLastViewed } = useSWRHook(
    `/v1/muatparts/product/last_viewed?size=180`
  );

  useEffect(() => {
    if (dataLastViewed?.Data) setLastViewed(dataLastViewed.Data);
  }, [dataLastViewed]);
  const {
    deleteAlbumMessage,
    isSuccessUpdateAlbum,
    isSuccessDeleteAlbum,
    setIsSuccessUpdateAlbum,
    setIsSuccessDeleteAlbum,
    setDeleteAlbumMessage,
  } = useAlbumStore();

  useEffect(() => {
    setScreen("ListPage");
  }, []);

  useEffect(() => {
    if (isSuccessUpdateAlbum) {
      setDataToast({
        type: "success",
        message: t("messageSuccessChangedAlbumName"),
      });
      setShowToast(true);
      setIsSuccessUpdateAlbum(false);
    }
  }, [isSuccessUpdateAlbum]);

  useEffect(() => {
    if (isSuccessDeleteAlbum) {
      setDataToast({
        type: "success",
        message: deleteAlbumMessage,
      });
      setShowToast(true);
      setIsSuccessDeleteAlbum(false);
      setDeleteAlbumMessage("");
    }
  }, [isSuccessDeleteAlbum, deleteAlbumMessage]);

  useEffect(() => {
    if (screen === "ListPage") {
      clearScreen();
      setAppBar({
        renderActionButton: (
          <div className="flex items-center gap-5">
            <span
              className="gap-[2px] flex flex-col items-center z-20"
              onClick={() => router.push("/troli")}
            >
              <IconComponent src={"/icons/cart.svg"} width={20} height={20} />
              <span className="font-semibold text-neutral-50 text-[10px]">
                {t("labeltrolibuyer")}
              </span>
            </span>
            <div
              className="flex items-center flex-col cursor-pointer z-10"
              onClick={() => {
                setAppBar({
                  onBack: () => clearScreen(),
                  title: (
                    <ImageComponent
                      width={100}
                      className={`${style.muatMini} !justify-center !m-auto !content-center !text-center`}
                      height={18}
                      src={"/icons/buyermuaticon.svg"}
                      alt="mini"
                    />
                  ),
                  appBarType: "header_title",
                  defaultType: "default_other_navbar_mobile",
                  blankBackground: true,
                });
              }}
            >
              <Menu color="white" size={20} />
              <span className="font-semibold pt-[2px] text-[10px] !text-white">
                Menu
              </span>
            </div>
          </div>
        ),
        title: "Album",
        appBarType: "header_title",
        bottomTabNavigation: true,
        dataBottomTabNavigation: {
          title: t("AppMuatpartsWishlistSemuaAlbum"),
          link: "//",
          onClick: () => handleNewAlbum(),
        },
      });
    }
  }, [screen]);

  const handleNewAlbum = () => {
    setShowBottomsheet(true);
    // setTitleBottomsheet(
    //   t("ProsesTenderTransporterPenawaranLabelBelumDitentukan")
    // );
    setTitleBottomsheet(t("labelTambahalbumBaru"));
    setDataBottomsheet(<NewAlbumBottomsheet t={t} mutateAlbum={mutateAlbum} />);
  };

  const renderContent = () => (
    <>
      <div className="py-5 px-4 bg-white">
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 bg-white">
          {albumItems?.map((album) => (
            <AlbumCardMobile
              t={t}
              key={album.id}
              mutateAlbum={mutateAlbum}
              data={albumItems}
              {...album}
            />
          ))}

          <div className="w-full h-[144px] aspect-square">
            <button
              className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-primary-700 rounded-xl bg-white"
              onClick={handleNewAlbum}
            >
              <Plus className="w-6 h-6 text-primary-700" />
              <span className="text-sm mt-2 font-semibold">
                {t("labelAlbumbaru")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {!!lastViewed?.length && (
        <section className="mt-2 p-4 pr-0 bg-white">
          <h2 className="text-base font-bold mb-3">
            {t("labelTerakhirDilihat")}
          </h2>
          <div
            className="pr-4 flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              scrollSnapType: "x mandatory",
            }}
          >
            {lastViewed?.map((product) => (
              <ProductCardMobile
                t={t}
                data={albumItems}
                key={product.ID}
                {...product}
                mutateAlbum={mutateAlbum}
                mutateLastViewed={mutateLastViewed}
              />
            ))}
          </div>
        </section>
      )}

      {!!recommendations?.length && (
        <section className="p-4 pt-0 pr-0 bg-white pb-32">
          <h2 className="text-base font-bold mb-3">
            {t("AppMuatpartsWishlistRekomendasiLain")}
          </h2>
          <div
            className="pr-4 flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              scrollSnapType: "x mandatory",
            }}
          >
            {recommendations?.map((product) => (
              <ProductCardMobile
                t={t}
                data={albumItems}
                key={product.ID}
                {...product}
                mutateAlbum={mutateAlbum}
                mutateLastViewed={mutateLastViewed}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );

  if (loadingAlbum)
    return (
      <div className="w-full rounded-lg border h-fit p-3 grid grid-cols-2 gap-2">
        {Array(10)
          .fill()
          .map((_, idx) => {
            return (
              <div
                key={idx}
                className="animate-pulse w-full h-28 rounded-lg border bg-neutral-600"
              ></div>
            );
          })}
      </div>
    );

  if (screen === "ListPage") return renderContent();

  return (
    <div className="h-auto bg-neutral-200 p-0 m-0">
      {albumItems ? (
        renderContent()
      ) : (
        <div className="flex flex-col gap-3 h-full justify-center items-center m-auto text-center w-[328px]">
          <ImageComponent
            src="/img/daftarprodukicon.png"
            alt="Data Not Found"
            width={96}
            height={77}
          />
          <p className="font-semibold text-neutral-600 text-base">
            {t("labelAlbumkamukosong")}
          </p>
          <p className="font-medium text-neutral-600 text-xs">
            {t("labelAlbumisialbummudenganklik")}
          </p>
        </div>
      )}
    </div>
  );
}

export default AlbumResponsive;

const BottomSheetContent = ({
  onChangeView,
  onDelete,
  onSave,
  albumId,
  currentName,
  t,
}) => {
  const [albumName, setAlbumName] = useState(currentName || "");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textError, setTextError] = useState("");
  const {
    dataChildBottomsheet,
    setShowBottomsheet,
    setShowToast,
    setDataToast,
  } = toast();
  const { put } = ConfigUrl();

  const validateAndSave = async () => {
    setError(false);
    setTextError("");

    if (!albumName.trim()) {
      setError(true);
      setTextError(t("AppMuatpartsWishlistNamaAlbumWajib"));
      return;
    }

    setLoading(true);

    try {
      await put({
        path: `v1/muatparts/albums/${albumId}`,
        data: { name: albumName.trim() },
      }).then((x) => {
        if (x.status === 200) {
          onSave();
          setShowBottomsheet(false);
          setDataToast({
            type: "success",
            message: t("AppMuatpartsWishlistBerhasilMengubah"),
          });
          setShowToast(true);
          setLoading(false);
        }
      });
    } catch (error) {
      if (error.status === 400) {
        // setDataToast({ type: "error", message: error.response.data.Data });
        setLoading(false);
        setError(true);
        setTextError(t("AppMuatpartsWishlistAlbumHarusUnik"));
        return;
      } else {
        setShowBottomsheet(false);
        setShowToast(true);
        setDataToast({ type: "error", message: x.message });
      }
    }
  };

  if (dataChildBottomsheet === 1) {
    return (
      <div className="flex flex-col gap-4">
        <Input
          status={error && "error"}
          supportiveText={{
            title: error && textError,
            desc: `${albumName.length}/20`,
          }}
          value={albumName}
          changeEvent={(e) => {
            setAlbumName(e.target.value);
            if (error) {
              setError(false);
              setTextError("");
            }
          }}
          maxLength={20}
          placeholder={t("labelMasukkanNamaAlbum")}
        />
        <Button
          Class="!w-full !min-w-full !font-semibold"
          onClick={validateAndSave}
          disabled={loading}
        >
          {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0766 */}
          {loading ? `${t("labelSaving")}...` : t("labelSimpanButton")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <span
        className="font-semibold text-sm text-neutral-900 cursor-pointer"
        onClick={onChangeView}
      >
        {t("labelUbahNamaAlbum")}
      </span>
      <hr />
      <span
        className="font-semibold text-sm text-error-400 cursor-pointer"
        onClick={onDelete}
      >
        {t("labelHapusAlbum")}
      </span>
    </div>
  );
};

const AlbumCardMobile = ({
  id,
  name,
  itemCount,
  thumbnails,
  type,
  mutateAlbum,
  data,
  t,
}) => {
  const {
    setShowBottomsheet,
    setDataBottomsheet,
    setDataChildBottomsheet,
    setTitleBottomsheet,
  } = toast();
  const { setModalOpen, setModalContent, setModalConfig } = modal();
  const { setShowToast, setDataToast } = toast();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { deleted } = ConfigUrl();

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleted({ path: `v1/muatparts/albums/${id}` }).then((x) => {
        if (x.status === 200) {
          setModalOpen(false);
          setDataToast({
            type: "success",
            message: `${t(
              "AppMuatpartsWishlistBerhasilMenghapusAlbum"
            )} ${name}`,
          });
          setShowToast(true);
          setDeleteLoading(false);
          mutateAlbum();
        }
      });
    } catch (error) {
      setModalOpen(false);
      setShowToast(true);
      if (error.status === 400) {
        setDataToast({ type: "error", message: error.response.data.Data });
      } else {
        setDataToast({ type: "error", message: x.message });
      }
    }
  };

  const handleOpenBottomsheet = (e) => {
    e.stopPropagation();
    setDataChildBottomsheet(0);
    setTitleBottomsheet(t("AppMuatpartsWishlistOpsi"));
    setShowBottomsheet(true);

    setDataBottomsheet(
      <BottomSheetContent
        t={t}
        albumId={id}
        currentName={name}
        mutateAlbum={mutateAlbum}
        onChangeView={() => {
          setDataChildBottomsheet(1);
          setTitleBottomsheet(t("AppMuatpartsWishlistUbahNamaAlbum"));
        }}
        onDelete={() => {
          setModalConfig({
            withHeader: false,
            withClose: true,
            classname: "!w-[296px] h-fit px-[32px] py-[24px]",
          });
          setModalContent(
            <div className="flex flex-col items-center  justify-center">
              <span className="font-bold text-base">
                {t("AppMuatpartsWishlistHapusAlbum")}
              </span>
              <span className="text-sm font-medium mt-4 mb-5 text-center">
                {t("AppMuatpartsWishlistYakinMenghapusAlbum")}
              </span>
              <div className="flex justify-center gap-2">
                <Button
                  children={t("labelBatalButton")}
                  color="primary_secondary"
                  Class="!w-[112px] !min-w-[112px] !h-7 !font-semibold !text-xs"
                  onClick={() => setModalOpen(false)}
                  disabled={deleteLoading}
                />
                <Button
                  children={deleteLoading ? t("labelYes") : t("labelYes")}
                  Class="!w-[112px] !min-w-[112px] !h-7 !font-semibold !text-xs"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                />
              </div>
            </div>
          );
          setModalOpen(true);
          setShowBottomsheet(false);
        }}
        onSave={() => {
          mutateAlbum();
        }}
      />
    );
  };

  return (
    <div className="flex flex-col">
      <CustomLink href={`/album/${id}`} className="w-full flex flex-col">
        <div className="w-full h-[144px] aspect-square relative">
          <ImageGrid images={thumbnails} small={true} />
        </div>
      </CustomLink>
      <div className="w-full flex items-center justify-between">
        <div className="mt-2">
          <h3 className="font-bold text-sm">
            {name === "Semua Album"
              ? t("AppMuatpartsWishlistSemuaAlbum")
              : name}
          </h3>
          <p className="text-xs text-neutral-600 font-semibold">
            {itemCount} {t("AppMuatpartsWishlistBarang")}
          </p>
        </div>
        {type === "CUSTOM" && (
          <EllipsisVertical
            size={24}
            color="#555555"
            onClick={(e) => handleOpenBottomsheet(e)}
          />
        )}
      </div>
    </div>
  );
};

const ProductCardMobile = (props) => {
  const {
    ID,
    Name,
    Photo,
    Bonus,
    PriceBeforeDiscount,
    PriceAfterDiscount,
    Quality,
    Discount,
    Store,
    City,
    Rating,
    SoldCount,
    Variant,
    Wishlist,
    mutateAlbum,
    HaveVariant,
    MinPurchase,
    data,
    mutateLastViewed,
    t,
  } = props;
  const {
    setShowToast,
    setDataToast,
    setShowBottomsheet,
    setDataBottomsheet,
    setTitleBottomsheet,
  } = toast();
  const { accessToken } = authZustand();

  const { setCartBody } = useTroliStore();
  const { selectedLocation } = userLocationZustan();
  const [loading, setLoading] = useState(false);
  const { post, deleted } = ConfigUrl();
  const router = useCustomRouter();
  const path = usePathname();

  const handleWishlist = async (e, val) => {
    e.stopPropagation();
    if (!accessToken) {
      router.push(process.env.NEXT_PUBLIC_INTERNAL_WEB + "login");
      return false;
    }
    // return console.log(path, " cuk");

    if (loading) return;
    setLoading(true);

    if (!val) {
      await post({
        path: "v1/muatparts/wishlist",
        data: { productId: ID },
      }).then(async (x) => {
        if (x.status === 200) {
          setShowBottomsheet(true);
          setTitleBottomsheet(t("AppMuatpartsWishlistTersimpanDiFavorit"));
          setDataBottomsheet(
            <FavoriteWishlistResponsive
              data={data}
              product={ID}
              mutateAlbum={mutateAlbum}
              onAddNewAlbum={() => {
                setShowBottomsheet(true);
                setTitleBottomsheet(t("AppMuatpartsWishlistTambahAlbumBaru"));
                setDataBottomsheet(
                  <NewAlbumBottomsheet
                    product={ID}
                    data={data}
                    mutateAlbum={mutateAlbum}
                    onSuccess={() => {
                      mutateAlbum();
                      setShowBottomsheet(false);
                      setDataToast({
                        type: "success",
                        message: t("labelBerhasilCreateAlbum"),
                      });
                      setShowToast(true);
                    }}
                  />
                );
              }}
            />
          );
          setLoading(false);
          if (path.includes("album")) await mutateLastViewed();
          await mutateAlbum();
        }
      });
    } else {
      try {
        await deleted({
          path: `v1/muatparts/wishlist`,
          options: { data: { productId: ID } },
        }).then(async (x) => {
          if (x.status === 200) {
            await mutateAlbum();
            if (path.includes("album")) await mutateLastViewed();

            setLoading(false);
          }
        });
      } catch (error) {
        setShowToast(true);
        if (error.status === 400)
          setDataToast({ type: "error", message: error.response.data.Data });
        else setDataToast({ type: "error", message: error.message });
      }
    }
  };

  const handleAddTroli = async (e, ID, HaveVariant, MinPurchase) => {
    e.stopPropagation();
    await setCartBody({
      quantity: MinPurchase,
      productId: ID,
      notes: "",
      locations: selectedLocation?.ID,
      variantId: HaveVariant ? Variant?.ID : "",
    });

    router.push("/troli");
  };

  return (
    <div
      onClick={() => router.push(`/${Store}/${Name}`)}
      className="flex-shrink-0 w-[160px] h-fit bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-400"
    >
      <div className="relative aspect-square">
        <img src={Photo} alt={Name} className="w-full h-full object-cover" />
        <button
          className={`absolute top-2 right-2 p-1 rounded-full bg-white ${
            loading ? "opacity-50" : ""
          }`}
          onClick={(e) => handleWishlist(e, Wishlist)}
          disabled={loading}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill={Wishlist ? "currentColor" : "none"}
            stroke="currentColor"
            style={{ color: Wishlist ? "#dc2626" : "currentColor" }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      <div className="p-3">
        <div className="bg-warning-100 text-warning-900 font-semibold text-xs px-2 py-1 rounded inline-block mb-2">
          {t("AppMuatpartsWishlistKualitas")}: {Quality || "OEM"}
        </div>
        <h3 className="text-sm font-medium line-clamp-2 h-[40px]">{Name}</h3>
        <div className="mt-2">
          {Discount > 0 && (
            <div className="flex items-center gap-1 font-medium text-[10px] ">
              <div className="line-through text-neutral-600">
                {PriceBeforeDiscount?.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>
              <div className="text-error-400">
                {Discount}% {t("HomeSellerIndexOff")}
              </div>
            </div>
          )}
          <div className="font-bold text-sm">
            {PriceAfterDiscount?.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </div>
        </div>
        <div className="mt-2 space-y-2">
          {Bonus && (
            <div className="flex items-center text-xs font-medium">
              <img
                src={
                  process.env.NEXT_PUBLIC_ASSET_REVERSE + "/icons/giftred.svg"
                }
                alt="seller"
                className="w-4 h-4 mr-2 -mt-[2px]"
              />
              <span className="truncate">{Bonus}</span>
            </div>
          )}
          {Store && (
            <div className="flex items-center text-xs font-medium">
              <img
                src={
                  process.env.NEXT_PUBLIC_ASSET_REVERSE + "/icons/storered.svg"
                }
                alt="seller"
                className="w-4 h-4 mr-2 -mt-[2px]"
              />
              <span className="truncate">{Store}</span>
            </div>
          )}
          {City && (
            <div className="flex items-center text-xs font-medium capitalize">
              <img
                src={
                  process.env.NEXT_PUBLIC_ASSET_REVERSE +
                  "/icons/locationblue.svg"
                }
                alt="location"
                className="w-4 h-4 mr-2 fill-primary-700 -mt-[2px]"
              />
              <span className="truncate">{City.toLowerCase()}</span>
            </div>
          )}
          <div className="flex items-center text-xs font-medium">
            <img
              src={
                process.env.NEXT_PUBLIC_ASSET_REVERSE + "/icons/starorange.svg"
              }
              alt="location"
              className="w-4 h-4 mr-2 fill-primary-700 -mt-[2px]"
            />
            {Rating.toFixed(1)}{" "}
            <div className="rounded-full w-[2px] h-[2px] bg-neutral-700 mx-1"></div>
            {t("labelTerjual")} {formatNumber(SoldCount)}
          </div>
        </div>
        <button
          className="w-full mt-3 py-2 text-center text-primary-700 font-semibold border border-primary-700 rounded-[20px] h-[28px] flex items-center justify-center text-xs"
          onClick={(e) => handleAddTroli(e, ID, HaveVariant, MinPurchase)}
        >
          {t("labelTambahKeTroli")}
        </button>
      </div>
    </div>
  );
};

const formatNumber = (num) => {
  if (num === null || num === undefined) return "0";

  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(".0", "") + " M";
  }

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(".0", "") + " jt";
  }

  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(".0", "") + " rb";
  }

  return num;
};

export const NewAlbumBottomsheet = ({
  onSuccess,
  mutateAlbum,
  product,
  data,
}) => {
  // return console.log(product, data, " cakcuk");
  const [albumName, setAlbumName] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textError, setTextError] = useState("");
  const {
    setTitleBottomsheet,
    setShowBottomsheet,
    setShowToast,
    setDataToast,
  } = toast();
  const { post } = ConfigUrl();
  const { t } = useLanguage();

  // LB - 0556, 25.03
  const handleSave = async () => {
    setError(false);
    setTextError("");

    if (!albumName.trim()) {
      setError(true);
      setTextError(t("AppMuatpartsWishlistNamaAlbumWajib"));
      return;
    }

    setLoading(true);

    try {
      const albumResponse = await post({
        path: "v1/muatparts/albums",
        data: { name: albumName.trim() },
      });

      if (albumResponse.status === 200) {
        const newAlbumId = albumResponse.data.Data?.album?.id;

        if (product && newAlbumId) {
          try {
            await post({
              path: `v1/muatparts/albums/${newAlbumId}/items`,
              data: { productIds: [product] },
            });

            setDataToast({
              type: "success",
              message: t("AppMuatpartsWishlistBerhasilMenambahAlbumDanProduk"),
            });
          } catch (error) {
            console.error("Gagal menambahkan produk ke album:", error);
            setDataToast({
              type: "success",
              message: t("AppMuatpartsWishlistBerhasilMenambahAlbum"),
            });
          }
        } else {
          setDataToast({
            type: "success",
            message: t("AppMuatpartsWishlistBerhasilMenambahAlbum"),
          });
        }

        setShowBottomsheet(false);
        setShowToast(true);
        setLoading(false);

        if (onSuccess) {
          onSuccess();
        }

        mutateAlbum();
      }
    } catch (error) {
      if (error.status === 400) {
        setLoading(false);
        setError(true);
        setTextError(t("AppMuatpartsWishlistAlbumHarusUnik"));
        return;
      } else {
        setShowBottomsheet(false);
        setShowToast(true);
        setDataToast({ type: "error", message: error.message });
      }
    }
  };

  return (
    <>
      <Input
        status={error && "error"}
        supportiveText={{
          title: error && textError,
          desc: `${albumName.length}/20`,
        }}
        value={albumName}
        changeEvent={(e) => {
          setAlbumName(e.target.value);
          if (error) {
            setError(false);
            setTextError("");
          }
        }}
        maxLength={20}
        placeholder={t("labelMasukkanNamaAlbum")}
      />
      <Button
        Class="!w-full !min-w-full !font-semibold mt-4"
        onClick={handleSave}
        disabled={loading}
      >
        {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0766 */}
        {loading ? `${t("labelSaving")}...` : t("labelSimpanButton")}
      </Button>
    </>
  );
};
