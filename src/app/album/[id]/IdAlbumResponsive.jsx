import { useHeader } from "@/common/ResponsiveContext";
import { Fragment, memo, useEffect, useMemo, useState } from "react";
import style from "./IdAlbum.module.scss";
import useAlbumStore from "@/store/album";
import IconComponent from "@/components/IconComponent/IconComponent";
import Checkbox from "@/components/Checkbox/Checkbox";
import NavSelectedMobile from "@/components/Bottomsheet/NavSelectedMobile";
import Button from "@/components/Button/Button";
import CustomLink from "@/components/CustomLink";
import { formatLargeNumber, ThousandSeparator } from "@/libs/NumberFormat";
import Image from "next/image";
import Modal from "@/components/Modals/modal";
import toast from "@/store/toast";
import SWRHandler from "@/services/useSWRHook";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { useCustomRouter } from "@/libs/CustomRoute";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import Input from "@/components/Input/Input";
import AlbumFIlterResponsive from "@/containers/AlbumFilter/AlbumFIlterResponsive";
import useTroliStore from "@/store/troli";
import { userLocationZustan } from "@/store/manageLocation/managementLocationZustand";
import RadioButton from "@/components/Radio/RadioButton";
import { useLanguage } from "@/context/LanguageContext";

const baseUrl = `${process.env.NEXT_PUBLIC_GLOBAL_API}v1/`

const ProductCard = ({
  // PROPS PRODUK
  id,
  imageSrc,
  // isGrosir,
  // stock,
  grade,
  name,
  originalPrice,
  discount,
  discountedPrice,
  bonus,
  rating,
  sales,

  MinPurchase,
  HaveVariant,
  Variant,

  // PROPS TOKO
  storeName,
  location,
  // PROPS LAINNYA
  isAturMassal,
  isChecked,
  onCheckboxChange,
  onOpenManageItemBottomsheet
}) => {
  const { t } = useLanguage();
  const router = useCustomRouter();
  const { setCartBody } = useTroliStore();
  const { selectedLocation } = userLocationZustan();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent the default anchor behavior
    e.stopPropagation(); // Stop event bubbling
    setCartBody({
      quantity: MinPurchase,
      productId: id,
      notes: "",
      locations: selectedLocation?.ID,
      // PRIO : 8 - 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - Prio 8 - LB - 0557
      variantId: HaveVariant ? Variant?.id : "",
    });
    router.push("/troli");
  };

  const handleManageItem = (e) => {
    e.preventDefault(); // Prevent the default anchor behavior
    e.stopPropagation(); // Stop event bubbling
    onOpenManageItemBottomsheet(id)
  }

  return (
    <div
      className="relative size-full cursor-pointer"
      onClick={() => onCheckboxChange(id)}
    >
      {(isAturMassal && !isChecked) ? <div className="absolute w-full h-full bg-neutral-900 opacity-30 z-10 rounded-md"/> : null}
      {isAturMassal ? (
        <div className="absolute top-2 left-2 z-[11]">
          <Checkbox
            classname={`w-full !gap-0 bg-white rounded-md`}
            label=""
            onChange={(e) => onCheckboxChange(id)}
            checked={isChecked}
            // disabled={isPrimaryDisabled}
          />
        </div>
      ) : null}
      {!isAturMassal ? (
        <button
          className="absolute top-2 right-2 size-7 flex items-center justify-center z-[2] bg-neutral-50 rounded-[48px]"
          onClick={handleManageItem}
        >
          <IconComponent
            src="/icons/three-dots.svg"
          />
        </button>
      ) : null}
      {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0600 */}
      <div className="relative w-full">
        <Image
          className='rounded-t-md w-full object-contain'
          src={imageSrc}
          alt={"photo"}
          width={100}
          height={100}
        />
        {/* {(isGrosir || stock) ? (
          <div className="absolute bottom-1 left-1 flex gap-x-1">
            {isGrosir ? (
              <div className="h-6 px-1 bg-primary-50 rounded-md flex">
                <div className="my-auto font-semibold text-[12px] leading-[14.4px] text-primary-700">
                  Grosir
                </div>
              </div>
            ) : null}
            {stock ? (
              <div className="h-6 px-1 bg-error-50 rounded-md flex">
                <div className="my-auto font-semibold text-[12px] leading-[14.4px] text-error-400">
                  {`Sisa ${stock} Pcs`}
                </div>
              </div>
            ) : null}
          </div>
        ) : null} */}
      </div>
  
      <div className="flex flex-col w-full px-2 pb-4 pt-3 gap-y-2 relative bg-white rounded-b-[6px] h-[253px]">
        <div className="h-6 px-2 -ml-2 rounded-r-[20px] bg-[#FFF9C1] w-fit">
          <span className="font-semibold text-[12px] leading-[14.4px text-warning-900">
            {`${t("labelQuality")} : ${grade}`}
          </span>
        </div>
  
        <div className="font-medium text-[12px] leading-[14.4px] line-clamp-2">{name}</div>
  
        {discount ? (
          <>
            <div className='flex gap-x-1 items-center'>
              <div className="font-medium text-[10px] leading-[13px] text-neutral-600 line-through">
                {`Rp ${ThousandSeparator(originalPrice)}`}
              </div>
              <div className="px-1 h-[14px] sm:bg-neutral-50 bg-error-400 rounded flex">
                <div className="font-semibold my-auto text-[8px] leading-[10.4px] sm:text-error-400 text-neutral-50">
                  {`${discount}% OFF`}
                </div>
              </div>
            </div>
            <div className="font-bold text-[14px] leading-[16.8px]">
              <span>{`Rp ${ThousandSeparator(discountedPrice)}`}</span>
            </div>
          </>
        ) : (
          <div className="font-bold text-[14px] leading-[16.8px]">
            <span>{`Rp ${ThousandSeparator(originalPrice)}`}</span>
          </div>
        )}
  
        {bonus ? (
          <div className="flex items-center gap-x-1">
            <Image src="/img/temp-garansi.png" alt="" width={16} height={16} />
            <span className="font-medium text-[12px] leading-[14.4px] text-neutral-700">{bonus}</span>
          </div>
        ) : null}

        <div className="flex items-center gap-x-1">
          <Image src="/img/temp-nama-toko.png" alt="" width={16} height={16} />
          {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0683 */}
          <span className="font-medium text-[12px] leading-[14.4px] text-neutral-700 line-clamp-1">{storeName}</span>
        </div>
          
        <div className='flex sm:flex-col-reverse flex-col gap-y-2'>
          <div className="flex items-center gap-x-1">
            <Image src="/img/temp-rating.png" alt="" width={16} height={16} />
            <span className="font-medium text-[12px] leading-[14.4px] text-neutral-700">{isNaN(Number(rating)) ? "0" : Math.floor(rating * 10) / 10}</span>
            <div className="w-[2px] h-[2px] bg-neutral-700 rounded" />
            <span className="font-medium text-[12px] leading-[14.4px] text-neutral-700">
              {`${t("labelSold")} ${formatLargeNumber(sales)}`}
              {/* Terjual {sales} */}
            </span>
          </div>
          <div className="flex items-center gap-x-1">
            <Image src="/img/temp-location.png" alt="" width={16} height={16} />
            <span className="font-medium text-[12px] leading-[14.4px] text-neutral-700 line-clamp-1">{location}</span>
          </div>
        </div>
        <div className="mt-auto">
          <Button
            Class="flex items-center justify-center w-full max-w-full !font-semibold h-7 !px-0 !py-0 !text-[12px] !leading-[13.2px]"
            color="primary_secondary"
            onClick={handleAddToCart}
          >
            {t("buttonAddToCart")}
          </Button>
        </div>
      </div>
    </div>
  )
};

const AddEditAlbumBottomSheet = ({
  detailAlbumData,
  id,
  selectedProductIds,
  type,
  onRefreshPage,
}) => {
  const { t } = useLanguage();
  const [albumName, setAlbumName] = useState("")
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [error, setError] = useState(null)
  const oldAlbumName = detailAlbumData ? detailAlbumData.album.name : "";

  const { setShowBottomsheet, setShowToast, setDataToast } = toast();
  const { setIsSuccessUpdateAlbum } = useAlbumStore();
  const router = useCustomRouter();
  const { useSWRMutateHook } = SWRHandler();
  const { trigger: createAlbum } = useSWRMutateHook(
    selectedProductIds ? `${baseUrl}muatparts/albums/` : null, 
    "POST"
  );
  const { trigger: updateAlbum } = useSWRMutateHook(
    detailAlbumData ? `v1/muatparts/albums/${detailAlbumData.album.id}` : null, 
    "PUT"
  );
  const { trigger: addAlbumItems } = useSWRMutateHook(
    (selectedAlbum && selectedProductIds) ? `${baseUrl}muatparts/albums/${selectedAlbum.id}/items` : null,
    "POST"
  );
  const { trigger: moveAlbumItems } = useSWRMutateHook(
    selectedProductIds ? `${baseUrl}muatparts/albums/${id}/items/move` : null,
    "POST"
  );

  useEffect(() => {
    setAlbumName(oldAlbumName)
  }, [oldAlbumName])

  useEffect(() => {
    const handleAddAlbumItems = async() => {
      await addAlbumItems({
        productIds: selectedProductIds
      })
        .then(() => {
          // Success handling
          setShowToast(true);
          setDataToast({
            type: "success",
            message: `${t("messageSuccessMovedAlbumItemTo")} ${selectedAlbum.name}`,
          });
        })
        .catch((error) => {
          // Error handling
          console.error("Failed to add album items:", error);
          
          // Show error toast
          setShowToast(true);
          setDataToast({
            type: "error",
            message: t("messageFailedToMoveItem"),
          });
        })
        .finally(() => onRefreshPage());
    }
    if (selectedAlbum) {
      handleAddAlbumItems()
    }
  }, [JSON.stringify(selectedAlbum), JSON.stringify(selectedProductIds)])

  const handleAddUpdateAlbum = async() => {
    if (!albumName) {
      setError({
        status: "error",
        message: "Nama Album wajib diisi",
      })
    }
    const body = { name: albumName }
    if (detailAlbumData) {
      await updateAlbum(body)
        .then(() => {
          setIsSuccessUpdateAlbum(true);
          setShowBottomsheet(false);
          router.push(`/album`)
        })
        .catch(err => {
          console.log(err)
          const response = err?.response
          if (response) {
            const isAlbumExist = response.data.Data === "Album with this name already exists"
            if (isAlbumExist) {
              setError({
                status: "error",
                message: t("messageAlbumNameDuplicateValidation"),
              })
            }
          }
        })
    }
    if (selectedProductIds) {
      await createAlbum(body)
        .then(async(res) => {
          const newAlbum = res?.data.Data.album
          if (type === "add") {
            setSelectedAlbum(newAlbum)
          }
          if (type == "move") {
            await moveAlbumItems({
              targetAlbumId: newAlbum.id,
              itemIds: selectedProductIds
            })
              .then(() => {
                // Success handling
                setShowToast(true);
                setDataToast({
                  type: "success",
                  message: `${t("messageSuccessMovedAlbumItemTo")} ${newAlbum.name}`,
                });
              })
              .catch(error => {
                // Error handling
                console.error("Failed to move album items:", error);
                
                // Show error toast
                setShowToast(true);
                setDataToast({
                  type: "error",
                  message: t("messageFailedToMoveItem"),
                });
              }).finally(() => onRefreshPage())
          }
        })
        .catch(err => {
          const response = err?.response
          if (response) {
            const isAlbumExist = response.data.Data === "Album with this name already exists"
            if (isAlbumExist) {
              setError({
                status: "error",
                message: t("messageAlbumNameDuplicateValidation"),
              })
            }
          }
        })
    }
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Input
        width={{ width: "100%" }}
        placeholder={t("placeholderAlbumName")}
        value={albumName}
        changeEvent={(e) => setAlbumName(e.target.value)}
        status={error ? error.status : null}
        supportiveText={{
          title: error ? error.message: "",
          desc: `${albumName.length}/10`
        }}
        maxLength="10"
      />
      <Button
        Class="flex items-center w-full min-w-full !font-semibold h-10 !leading-[15.4px]"
        onClick={handleAddUpdateAlbum}
      >
        {t("buttonSave")}
      </Button>
    </div>
  )
}

const DetailAlbumHeaderResponsive = memo(({ detailAlbumData, onRefreshPage }) => {
  const { setShowBottomsheet, setTitleBottomsheet, setDataBottomsheet, setDataToast, setShowToast } = toast();
  const router = useCustomRouter()
  const { filterAlbum, setFilterAlbum, setIsSuccessDeleteAlbum, setDeleteAlbumMessage } = useAlbumStore();
  const albumName = detailAlbumData ? detailAlbumData.album.name : "";
  const [search, setSearch] = useState("")
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { useSWRMutateHook } = SWRHandler();
  const { trigger: deleteAlbum } =
    useSWRMutateHook(detailAlbumData ? `v1/muatparts/albums/${detailAlbumData.album.id}` : null, "DELETE");

  const handleClearSearch = () => {
    setSearch("")
    setFilterAlbum({ ...filterAlbum, search: "" })
  }

  const sortingItems = [
    {
      title: t("labelProduct"),
      items: [
        {
          name: t("labelNewest"),
          value: "newest"
        },
        {
          name: t("labelOldest"),
          value: "oldest"
        }
      ]
    },
    {
      title: t("labelPrice"),
      items: [
        {
          name: t("labelMostExpensive"),
          value: "priceHighest"
        },
        {
          name: t("labelCheapest"),
          value: "priceLowest"
        }
      ]
    }
  ]

  const handleEditAlbum = () => {
    setTitleBottomsheet(t("titleChangeAlbumName"));
    setShowBottomsheet(true);
    setDataBottomsheet(
      <AddEditAlbumBottomSheet
        detailAlbumData={detailAlbumData}
        onRefreshPage={onRefreshPage}
      />
    )
  }

  const handleOpenDeleteAlbumModalConfirmation = () => {
    setIsModalOpen(true)
    setShowBottomsheet(false)
  }

  const manageAlbumActions = [
    {
      label: t("buttonChangeAlbumName"),
      onClick: handleEditAlbum
    },
    {
      label: t("buttonDelete"),
      onClick: handleOpenDeleteAlbumModalConfirmation
    }
  ]

  const actions = [
    ...(albumName !== "Semua Album" ? [{
      iconSrc: "/icons/edit.svg",
      label: t("buttonChange"),
      onClick: () => {
        setTitleBottomsheet(t("titleOptions"));
        setShowBottomsheet(true);
        setDataBottomsheet(
          <div className="flex flex-col gap-y-4">
            {manageAlbumActions.map((action, key) => {
              const isLastItem = manageAlbumActions.length - 1 === key
              return (
                <button
                  className={`flex items-start ${isLastItem ? "text-error-400" : "pb-4 border-b border-b-neutral-400 text-neutral-900"}`}
                  onClick={action.onClick}
                >
                  <span className="font-semibold text-[14px]">
                    {action.label}
                  </span>
                </button>
              )
            })}
          </div>  
        )
      }
    }] : []),
    {
      iconSrc: "/icons/sorting.svg",
      label: t("titleSort"),
      onClick: () => {
        setTitleBottomsheet(t("titleSort"));
        setShowBottomsheet(true);
        setDataBottomsheet(
          <div className="flex flex-col gap-y-4">
            {sortingItems.map((sort, key) => {
              const isLastChild = sortingItems.length - 1 === key
              return (
                <div className={`flex flex-col gap-y-3 ${isLastChild ? "" : "border-b border-b-neutral-400 pb-4"}`} key={key}>
                  <span className="font-bold text-[14px] leading-[15.4px] text-neutral-900">
                    {sort.title}
                  </span>
                  {sort.items.map((item, index) => (
                    <Fragment key={index}>
                      <RadioButton
                        checked={filterAlbum.sort ? filterAlbum.sort[0].value === item.value : false}
                        onClick={() => {
                          setFilterAlbum({ ...filterAlbum, sort: [item] })
                          setShowBottomsheet(false)
                        }}
                        classnameLabel={`font-semibold !text-[14px] leading-[15.4px]`}
                        label={item.name}
                      />
                    </Fragment>
                  ))}
                </div>
              )
            })}
          </div>
        )
      }
    },
  ]

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setFilterAlbum({ ...filterAlbum, search })
    }
  };

  return (
    <>
      <div className="flex items-center h-[98px] bg-red-600 px-4 relative w-full">
        <div className="flex flex-col gap-y-2 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <button
                className="flex items-center justify-center size-6 bg-neutral-50 rounded-xl"
                onClick={() => router.back()}  
              >
                <IconComponent src={'/icons/chevron-left.svg'} classname={style.iconBackRed} />
              </button>
              <span className="font-bold text-base leading-tight text-neutral-50">
                {albumName === "Semua Album" ? t("titleAllAlbums") : albumName}
              </span>
            </div>
            <div className="flex items-center gap-x-2">
              {actions.map((action, key) => (
                <button className="flex flex-col items-center gap-y-1" key={key} onClick={() => action.onClick()}>
                  <IconComponent
                    classname={style.icon_white}
                    src={action.iconSrc}
                    size="medium"
                  />
                  <span className="font-semibold text-[10px] leading-[10px] text-neutral-50">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <Input
            classname={`borderless-input`}
            width={{ width: "100%" }}
            placeholder={t("placeholderSearchProductSku")}
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
        <ImageComponent src={'/img/fallinstartheader.png'} width={153} height={62} alt='fallin' className='absolute right-0 bottom-0' />
      </div>
      <Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        closeArea={false}
        closeBtn={true}
        title={t("titleDeleteItem")}
        desc={t("messageConfirmDeleteAlbum")}
        action1={{
          action: () => setIsModalOpen(false),
          text: t("buttonCancel"),
          style: "outline",
          color: "#176CF7",
            customStyle: {
            width: "112px",
          },
        }}
        action2={{
          action: async() => {
            await deleteAlbum()
              .then(() => {
                setDeleteAlbumMessage(`${t("messageSuccessDeletedAlbum")} ${detailAlbumData?.album.name}`)
                setIsSuccessDeleteAlbum(true);
                setShowBottomsheet(false);
                router.push(`/album`)
              })
              .catch(() => {
                setDataToast({
                  type: "error",
                  message: t("messageFailedDeletedAlbum"),
                });
                setShowToast(true);
              })
          },
          text: t("buttonConfirm"),
          style: "full",
          color: "#176CF7",
          customStyle: {
            width: "112px",
            color: "#ffffff",
          },
        }}
      />
    </>
  );
});

const IdAlbumResponsive = ({
  deleteAlbumItems,
  onRefreshAlbum,
  resIdAlbum,
}) => {
  const { t } = useLanguage();
  const { setAppBar } = useHeader();
  const { valueAddItems, setAddItems, filterAlbum, resetFilterAlbum } = useAlbumStore();
  const router = useCustomRouter();
  const selectedProductIds = valueAddItems?.productIds || []

  const { setShowToast, setDataToast, setShowBottomsheet, setTitleBottomsheet, setDataBottomsheet, } = toast();
  const { useSWRHook } = SWRHandler();
  const { data: dataAlbums, mutate: mutateAlbums } = useSWRHook(`v1/muatparts/albums`);

  const detailAlbumData = resIdAlbum?.Data
  const albumItems = detailAlbumData ? detailAlbumData.items : []
  const dataFilters = detailAlbumData? detailAlbumData.Filters: {}

  const albums = dataAlbums?.Data ? dataAlbums.Data.albums : []
  const customAlbums = albums.filter(item => item.type === "CUSTOM").filter(item => item.name !== detailAlbumData?.album.name)

  const [isAturMassal, setIsAturMassal] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [screen, setScreen] = useState("list")
  
  const handleRefreshPage = () => {
    onRefreshAlbum()
    mutateAlbums()
    setIsAturMassal(false)
    setAddItems([])
    setShowBottomsheet(false)
  }

  const headerComponent = useMemo(() => 
    <DetailAlbumHeaderResponsive detailAlbumData={detailAlbumData} onRefreshPage={handleRefreshPage} />, [JSON.stringify(detailAlbumData)]);

  useEffect(() => {
    resetFilterAlbum()
  }, [])

  useEffect(() => {
    if (screen === "list") {
      setAppBar({
        appBarType: "header_custom",
        renderAppBar: headerComponent
      })
    }
    if (screen === "filter") {
      setAppBar({
        appBarType: "header_custom",
        renderAppBar: (
          <div className="shadow-muat h-14 p-4 bg-neutral-50 flex items-center">
            <div className="flex justify-center items-center relative w-full">
              <button
                className="absolute top-1/2 -translate-y-1/2 left-0"
                onClick={() => setScreen("list")}
              >
              <IconComponent
                  classname={`icon-blue`}
                  src={"/icons/silang.svg"}
                />
              </button>
              <span className="font-semibold text-[14px] leading-[16.8px] text-neutral-900">
                {t("labelFilterInternal")}
              </span>
            </div>
          </div>
        )
      })
    }
  }, [headerComponent, screen]);

  const handleCheckboxChange = (productId) => {
    if (selectedProductIds.includes(productId)) {
      // Product is already selected, remove it
      setAddItems(selectedProductIds.filter((id) => id !== productId));
    } else {
      // Product is not selected, add it
      setAddItems([...selectedProductIds, productId]);
    }
  };

  const handleOpenMoveItemsBottomsheet = () => {
    setTitleBottomsheet(customAlbums.length === 0 ? t("titleSaveToWhichAlbum") : t("titleMoveTo"));
    setShowBottomsheet(true);
    setDataBottomsheet(
      <MoveAlbumBottomsheet
        customAlbums={customAlbums}
        onRefreshPage={handleRefreshPage}
        detailAlbumData={detailAlbumData}
      />
    )
  }

  const manageItemActions = [
    {
      title: detailAlbumData?.album.type === "GENERAL" ? t("titleAddTo") : t("titleMoveTo"),
      onClick: () => handleOpenMoveItemsBottomsheet()
    },
    {
      title: t("buttonDelete"),
      onClick: () => setIsModalOpen(true)
    }
  ]

  const handleOpenManageItemBottomsheet = (productId) => {
    setAddItems([productId])
    setTitleBottomsheet(t("titleOptions"));
    setShowBottomsheet(true);
    setDataBottomsheet(
      <div className="flex flex-col gap-y-4">
        {manageItemActions.map((action, key) => (
          <button
            className={`${manageItemActions.length - 1 === key ? "text-error-400" : "text-neutral-900 pb-4 border-b border-b-neutral-400"} flex items-start`}
            key={key}
            onClick={action.onClick}
          >
            <span className="font-semibold text-[14px] leading-[15.4px]">
              {action.title}
            </span>
          </button>
        ))}
      </div>
    )
  }

  const handleSelectAllCheckboxChange = ({ checked }) => {
    if (checked) {
      setAddItems(albumItems.map(item => item.ID))
    } else {
      setAddItems([])
    }
  }

  const isShowBottomNavMenu = isAturMassal && selectedProductIds.length > 0
  const isAlbumEmpty = albumItems.length === 0
  const defaultFilter = {
    brands: [],
    categories: [],
    stock: ""
  }
  const isFilterEmpty = JSON.stringify(filterAlbum.filter) === JSON.stringify(defaultFilter)

  if (screen === "filter") {
    return (
      <AlbumFIlterResponsive
        setScreen={setScreen}
        dataFilters={dataFilters}
      />
    )
  }

  if (screen === "list") {
    return (
      <>
        <div className="flex flex-col gap-y-2 bg-neutral-200">
          <div className="flex items-center justify-between p-4 bg-neutral-50">
            <button
              className={`flex gap-x-2 items-center px-3 h-[30px] rounded-3xl border border-solid w-fit disabled:cursor-not-allowed
                ${!isFilterEmpty ? "text-primary-700 border-primary-700 bg-primary-50" : "bg-neutral-200 border-neutral-200 text-neutral-900"}
              `}
              onClick={() => setScreen("filter")}
            >
              <div className="font-medium text-[14px] leading-[15.4px]">{t("labelFilterInternal")}</div>
              <IconComponent
                classname={!isFilterEmpty ? "icon-blue" : ""}
                src="/icons/filter.svg"
                height={14}
                width={14}
              />
            </button>
            {isAlbumEmpty ? null : (
              <button
                onClick={() => {
                  setIsAturMassal(prevState => !prevState)
                  setAddItems([])
                }}
              >
                <span className="font-semibold text-[14px] leading-[15.4px] text-primary-700">
                  {isAturMassal ? t("buttonCancel") : t("buttonBulkSetup")}
                </span>
              </button>
            )}
          </div>
          {isAlbumEmpty ? (
            <>
              {filterAlbum.search ? (
                <div className="h-full min-h-[calc(100vh_-_150px)] flex items-center justify-center flex-col gap-y-3 px-4">
                  <DataNotFound
                    classname={`gap-y-3`}
                    textClass={`!text-[14px] !leading-[15.4px] max-w-[111px]`}
                    title={t("messageKeywordNotFound")}
                    width={134}
                    height={114}
                  />
                </div>
              ) : !isFilterEmpty ? (
                <div className="h-full min-h-[calc(100vh_-_150px)] flex items-center justify-center flex-col gap-y-[18px] px-4">
                  <DataNotFound
                    classname={`gap-y-[18px]`}
                    textClass={`!text-[14px] !leading-[15.4px]`}
                    title={<>{t("titleDataNotFound")}<br/>{t("descTryRemovingSomeFilters")}</>}
                    width={107}
                    height={92}
                  />
                  <span className="font-semibold text-[14px] leading-[15.4px] text-neutral-600">
                    {t("labelOr")}
                  </span>
                  <Button
                    Class="flex items-center px-6 !font-semibold h-7"
                    onClick={() => setScreen("filter")}
                  >
                    <span className="text-[12px] leading-[13.2px]">
                      {t("buttonResetFilter")}
                    </span>
                  </Button>
                </div>
              ) : (
                <div className="h-full min-h-[calc(100vh_-_150px)] flex items-center justify-center flex-col gap-y-3 px-4">
                  <DataNotFound
                    title={t("titleEmptyAlbum")}
                    type="data"
                    width={96}
                    height={77}
                  />
                  <div className="font-medium text-[12px] leading-[14.4px] text-neutral-600 text-center">
                    {t("descEmptyAlbum")}
                  </div>
                  <Button
                    Class="flex items-center px-6 gap-x-1 !font-semibold h-7"
                    onClick={() => router.push("/")}
                  >
                    <IconComponent
                      src="/icons/Plus.svg"
                    />
                    <span className="text-[12px] leading-[13.2px]">
                      {t("buttonAddItemsToAlbum")}
                    </span>
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className={`flex flex-col gap-y-3 p-4 bg-neutral-50 ${isShowBottomNavMenu ? "mb-16" : ""}`}>
              <div className="flex items-center justify-between">
                {isAturMassal ? (
                  <Checkbox
                    onChange={(e) => handleSelectAllCheckboxChange(e)}
                    checked={selectedProductIds.length === albumItems.length}
                  >
                    <span className="font-semibold text-[14px] leading-[15.4px] text-neutral-900">
                      {t("labelSelectAll")}
                    </span>
                  </Checkbox>
                ) : null}
                <span className="font-semibold text-[14px] leading-[15.4px] text-neutral-900">
                  {`${albumItems.length} ${t("labelProductCount")}`}
                </span>
              </div>
              {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0600 */}
              <div className="gap-x-2 gap-y-3 grid grid-cols-2">
                {albumItems.map((product, key) => {
                  const isChecked = selectedProductIds.find(item => item === product.ID)
                  if (isAturMassal) {
                    return (
                      <div className="flex flex-col items-start sm:w-[160px] w-[170px] rounded-md border border-neutral-400" key={key}>
                        <ProductCard
                          // DARI PRODUK
                          id={product.ID}
                          imageSrc={product.Photo}
                          // isGrosir={product.SalesType === "Grosir"}
                          // stock={product.Stock}
                          grade={product.Quality}
                          name={product.Name}
                          originalPrice={product.PriceBeforeDiscount}
                          discount={product.Discount}
                          discountedPrice={product.PriceAfterDiscount}
                          rating={product.Rating}
                          sales={product.SoldCount}
                          MinPurchase={product.MinPurchase}
                          HaveVariant={product.HaveVariant}
                          Variant={product.Variant}
  
                          // DARI SELLER
                          storeName={product.Store}
                          location={product.City}

                          isAturMassal={isAturMassal}
                          isChecked={isChecked}
                          onCheckboxChange={handleCheckboxChange}
                          onOpenManageItemBottomsheet={handleOpenManageItemBottomsheet}
                        />
                      </div>
                    )
                  }
                  return (
                    <CustomLink
                      // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0600
                      className="flex flex-col items-start sm:max-w-[160px] max-w-[170px] rounded-md border border-neutral-400"
                      href={`/${product.Store}/${product.Name}`}
                      key={key}
                    >
                      <ProductCard
                        // DARI PRODUK
                        id={product.ID}
                        imageSrc={product.Photo}
                        isGrosir={product.SalesType === "Grosir"}
                        stock={product.Stock}
                        grade={product.Quality}
                        name={product.Name}
                        originalPrice={product.PriceBeforeDiscount}
                        discount={product.Discount}
                        discountedPrice={product.PriceAfterDiscount}
                        rating={product.Rating}
                        sales={product.SoldCount}

                        MinPurchase={product.MinPurchase}
                        HaveVariant={product.HaveVariant}
                        Variant={product.Variant}
  
                        // DARI SELLER
                        storeName={product.Store}
                        location={product.City}

                        isAturMassal={isAturMassal}
                        isChecked={isChecked}
                        onCheckboxChange={handleCheckboxChange}
                        onOpenManageItemBottomsheet={handleOpenManageItemBottomsheet}
                      />
                    </CustomLink>
                  )
                })}
              </div>
            </div>
          )}
          {isShowBottomNavMenu ? (
            <NavSelectedMobile
              classname={`left-0 flex items-center w-full py-3 px-4 gap-x-2 z-[12]`}
            >
              <Button
                Class="flex items-center w-full max-w-full !font-semibold h-10 !leading-[15.4px]"
                color="primary_secondary"
                onClick={() => setIsModalOpen(true)}
              >
                {t("buttonDelete")}
              </Button>
              <Button
                Class="flex items-center w-full max-w-full !font-semibold h-10 !leading-[15.4px]"
                onClick={handleOpenMoveItemsBottomsheet}
              >
                {detailAlbumData.album.type === "GENERAL" ? t("titleAddTo") : t("titleMoveTo")}
              </Button>
            </NavSelectedMobile>
          ) : null}
        </div>
        <Modal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          closeArea={false}
          closeBtn={true}
          title={t("titleDeleteItem")}
          desc={t("messageConfirmDeleteAlbumItem")}
          action1={{
            action: () => setIsModalOpen(false),
            text: t("buttonCancel"),
            style: "outline",
            color: "#176CF7",
              customStyle: {
              width: "112px",
            },
          }}
          action2={{
            action: async() => {
              await deleteAlbumItems({
                data: {
                  itemIds: selectedProductIds
                }
              })
                .then(() => {
                  setDataToast({
                    type: "success",
                    message: t("messageSuccessDeleteItem"),
                  });
                  setShowToast(true);
                })
                .catch(() => {
                  setDataToast({
                    type: "error",
                    message: "Gagal menghapus barang",
                  });
                  setShowToast(true);
                })
                .finally(() => {
                  handleRefreshPage()
                  setIsModalOpen(false)
                })
            },
            text: t("buttonConfirm"),
            style: "full",
            color: "#176CF7",
            customStyle: {
              width: "112px",
              color: "#ffffff",
            },
          }}
        />
      </>
    );
  }
}

const MoveAlbumBottomsheet = ({
  customAlbums,
  onRefreshPage,
  detailAlbumData,
}) => {
  const { t } = useLanguage();
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const { setShowToast, setDataToast, setShowBottomsheet, setTitleBottomsheet, setDataBottomsheet } = toast();
  const { valueAddItems } = useAlbumStore();
  const selectedProductIds = valueAddItems?.productIds || []

  const { useSWRMutateHook } = SWRHandler();
  const { trigger: addAlbumItems } = useSWRMutateHook(
    selectedAlbum ? `${baseUrl}muatparts/albums/${selectedAlbum.id}/items` : null,
    "POST"
  );
  const { trigger: moveAlbumItems } = useSWRMutateHook(
    detailAlbumData ? `${baseUrl}muatparts/albums/${detailAlbumData.album.id}/items/move` : null,
    "POST"
  );

  useEffect(() => {
    const handleAddAlbumItems = async() => {
      try {
        await addAlbumItems({
          productIds: selectedProductIds
        });

        // Success handling
        setShowToast(true);
        setDataToast({
          type: "success",
          message: `${t("messageSuccessMovedAlbumItemTo")} ${selectedAlbum.name}`,
        });
      } catch (error) {
        // Error handling
        console.error("Failed to add album items:", error);
        
        // Show error toast
        setShowToast(true);
        setDataToast({
          type: "error",
          message: t("messageFailedToMoveItem"),
        });
      } finally {
        // Optional: Add any cleanup code here that should run regardless of success/failure
        // For example, resetting loading state if you have one
        onRefreshPage();
      }
    }
    if (selectedAlbum) {
      handleAddAlbumItems()
    }
  }, [JSON.stringify(selectedAlbum), JSON.stringify(selectedProductIds)])
  
  const handleMoveAlbumItems = async(album) => {
    await moveAlbumItems({
      targetAlbumId: album.id,
      itemIds: selectedProductIds
    })
      .then(() => {
        // Success handling
        setShowToast(true);
        setDataToast({
          type: "success",
          message: `${t("messageSuccessMovedAlbumItemTo")} ${album.name}`,
        });
      })
      .catch((error) => {
        // Error handling
        console.error("Failed to move album items:", error);
        
        // Show error toast
        setShowToast(true);
        setDataToast({
          type: "error",
          message: t("messageFailedToMoveItem"),
        });
      })
      .finally(() => onRefreshPage());
  };

  if (customAlbums.length === 0) {
    return (
      <div className="flex flex-col">
        <DataNotFound
          title={t("titleNoAlbum")}
          type="data"
          width={96}
          height={77}
        />
        <div className="mt-3 font-medium text-[12px] leading-[13.2px] text-neutral-600 text-center">
          {t("descNoAlbum")}
        </div>
        <Button
          Class="flex items-center justify-center gap-x-1 px-0 py-0 w-full min-w-full !font-semibold h-8 !leading-[16.8px] mt-4"
          // onClick={() => setIsModalOpen(true)}
        >
          <IconComponent
            src="/icons/Plus.svg"
          />
          <span>
            {t("buttonNewAlbum")}
          </span>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-3 max-h-[50vh] overflow-y-auto">
        {customAlbums.map((album, key) => {
          return (
            <div
              className="flex gap-x-3 items-center cursor-pointer"
              key={key}
              onClick={() => {
                if (detailAlbumData.album.type === "GENERAL") {
                  setSelectedAlbum(album);
                }
                if (detailAlbumData.album.type === "CUSTOM") {
                  handleMoveAlbumItems(album)
                }
              }}
            >
              {album.thumbnails[0] ? (
                <Image
                  src={album.thumbnails[0]}
                  alt="thumbnail"
                  width={42}
                  height={42}
                  className="rounded-[2.47px]"
                />
              ) : (
                <div className="flex items-center justify-center border border-neutral-400 size-[42px] rounded">
                  <ImageComponent
                    src="/img/daftarprodukicon.png"
                    alt="notfound"
                    width={34}
                    height={28}
                    className="rounded-[2.47px]"
                  />
                </div>
              )}
              
              <div className="flex flex-col gap-y-2">
                <span className="font-semibold text-[14px] leading-[15.4px] text-neutral-900">
                  {album.name}
                </span>
                <span className="font-medium text-[12px] leading-[13.2px] text-neutral-600">
                  {`${album.itemCount} ${t("labelProductCount")}`}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      <Button
        Class="flex items-center w-full min-w-full !font-semibold h-8 !leading-[16.8px]"
        onClick={() => {
          setTitleBottomsheet(t("buttonAddNewAlbum"));
          setShowBottomsheet(true);
          setDataBottomsheet(
            <AddEditAlbumBottomSheet
              selectedProductIds={selectedProductIds}
              id={detailAlbumData.album.id}
              type={detailAlbumData.album.type === "GENERAL" ? "add" : "move"}
              onRefreshPage={onRefreshPage}
            />
          )
        }}
      >
        {t("buttonAddNewAlbum")}
      </Button>
    </div>
  )
}

export default IdAlbumResponsive;
