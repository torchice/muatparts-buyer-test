"use client";

import style from "./IdAlbum.module.scss";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Modal from "@/components/Modals/modal";
import Input from "@/components/Input/Input";
import Dropdown from "@/components/Dropdown/Dropdown";
import IconComponent from "@/components/IconComponent/IconComponent";
import ProductGrid from "@/components/ProductsSectionComponent/ProductGrid";
import Button from "@/components/Button/Button";
import useAlbumStore from "@/store/album";
import FilterChips from "@/components/FilterChips/FilterChips";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useCustomRouter } from "@/libs/CustomRoute";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import Checkbox from "@/components/Checkbox/Checkbox";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import { EllipsisVertical } from "lucide-react";
import useWishlist from "@/store/wishlist";
import SWRHandler from "@/services/useSWRHook";
import ModalComponent from "@/components/Modals/ModalComponent";
import { ImageGrid } from "../AlbumWeb";
import AlbumFilter from "@/containers/AlbumFilter/AlbumFilter";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import toast from "@/store/toast";
import ConfigUrl from "@/services/baseConfig";
import { useLanguage } from "@/context/LanguageContext";
import IdAlbumSkeleton from "./IdAlbumSkeleton";

function IdAlbumWeb({
  id,
  dataIdAlbum,
  mutateIdAlbum,
  deleteAlbumItems,
  isLoading,
}) {
  const router = useCustomRouter();
  const { deleted } = ConfigUrl();
  const {
    dataAlbum,
    filterAlbum,
    resetFilterAlbum,
    setFilterAlbum,
    modalMoveAlbum,
    valueAddItems,
    valueMoveAlbum,

    setAddItemsTarget,
    setAddItemsName,
    setAddItems,
    setModalMoveAlbum,
    setMoveAlbumTarget,
    setMoveAlbumName,
    setTriggerAlbum,
  } = useAlbumStore();

  const {
    modalNewAlbum,
    setModalNewAlbum,
    modalListFavorite,
    setModalListFavorite,
    setValueEditWishlist,
    setModalEditAlbum,
    modalEditAlbum,
    valueEditWishlist,
  } = useWishlist();

  const [albumName, setAlbumName] = useState("");
  const [items, setItems] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [isBatch, setIsBatch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [target, setTarget] = useState({});
  const [modalDelete, setModalDelete] = useState(false);
  const [idDelete, setIdDelete] = useState("");
  const [modalDeleteAlbum, setModalDeleteAlbum] = useState(false);

  const [filterChips, setFilterChips] = useState([]);
  const [tempSearch, setTempSearch] = useState("");

  const { useSWRMutateHook, useSWRHook } = SWRHandler();
  const { data: resMoveAlbum, trigger: moveOption } = useSWRMutateHook(
    `${process.env.NEXT_PUBLIC_GLOBAL_API}v1/muatparts/albums/${id}/items/move`,
    "POST"
  );
  const { data: resAllAlbum, trigger: moveOptionAllAlbum } = useSWRMutateHook(
    `${process.env.NEXT_PUBLIC_GLOBAL_API}v1/muatparts/albums/${target?.id}/items`,
    "POST"
  );

  const { data: resDeleteAlbum, trigger: triggerDeleteAlbum } =
    useSWRMutateHook(`v1/muatparts/albums/${idDelete}`, "DELETE");

  const { setShowToast, setDataToast } = toast();

  const deleteALbum = (id) => {
    setIdDelete(id);
    setModalDeleteAlbum(true);
  };

  const onSaveDeleteAlbum = () => {
    triggerDeleteAlbum();
    setModalDeleteAlbum(false);
  };

  useEffect(() => {
    if (resDeleteAlbum) {
      setShowToast(true);
      setDataToast({
        type: "success",
        message: "Berhasil menghapus album " + albumName,
      });
      router.push("/album");
    }
  }, [resDeleteAlbum]);

  useEffect(() => {
    if (target.id != undefined) {
      setShowToast(true);
      moveOptionAllAlbum(valueAddItems);
      setDataToast({
        type: "success",
        message: `Berhasil menambahkan  ke ${target?.name}`,
      });
      refreshAlbum();
    }
  }, [target]);

  const refreshAlbum = () => {
    setModalMoveAlbum(false);
    setTriggerAlbum(Math.random() * 888899);
    mutateIdAlbum();
    setIsBatch(false);
    setItems(
      items.map((item) => ({
        ...item,
        Selected: false,
        IsBatch: false,
      }))
    );
  };

  const hapusAlbumWishlist = () => {
    deleted({
      path: `v1/muatparts/albums/${id}/items`,
      options: {
        data: {
          itemIds: isBatch
            ? items.filter((item) => item.Selected).map((item) => item.ID)
            : items.map((item) => item.ID),
        },
      },
    }).then(() => {
      setShowToast(true);
      setDataToast({
        type: "success",
        message: `Berhasil menghapus album `,
      });
      refreshAlbum();
      setModalDelete(false);
    });
  };

  const moveWishlist = (data) => {
    if (dataIdAlbum?.album?.type != "CUSTOM") {
      setTarget(data);
    } else {
      moveOption({
        targetAlbumId: data.id,
        itemIds: isBatch
          ? items.filter((item) => item.Selected).map((item) => item.ID)
          : valueMoveAlbum.itemIds,
      }).then(() => {
        setShowToast(true);
        setDataToast({
          type: "success",
          message: `Berhasil dipindahkan ke ${data.name}`,
        });
        refreshAlbum();
      });
    }
  };

  // Handle filter selection from AlbumFilter
  const handleFilterSelected = (filter) => {
    setFilterAlbum({
      ...filterAlbum,
      filter,
    });
  };

  // Handle filter chips from AlbumFilter
  const handleFilterChipsSelected = (chips) => {
    setFilterChips(chips);
  };

  const convertChipsToFilter = (chips) => {
    const filter = {
      brands: [],
      categories: [],
      stock: "",
    };

    chips.forEach((chip) => {
      const { section, itemId } = chip;
      if (section === "Categories") {
        filter.categories.push(itemId);
      } else if (section === "Brands") {
        filter.brands.push(itemId);
      } else if (section === "Stock") {
        filter.stock = itemId;
      }
    });

    return filter;
  };

  // Handle removing a single filter
  const handleRemoveFilter = (filterId) => {
    const updatedChips = filterChips.filter((chip) => chip.id !== filterId);
    setFilterChips(updatedChips);

    // Update the filter state from the updated chips
    const newFilter = convertChipsToFilter(updatedChips);
    setFilterAlbum({
      ...filterAlbum,
      filter: newFilter,
    });
  };

  // Handle clearing all filters
  const handleClearAllFilters = () => {
    setFilterChips([]);
    setFilterAlbum({
      ...filterAlbum,
      filter: {
        brands: [],
        categories: [],
        stock: "",
      },
    });
  };

  const handleClickOutside = (event) => {
    if (menuOpen && !event.target.closest(`.toggle-menu`)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    let cekCheckedAll =
      items.filter((item) => item.Selected).length == items.length;
    if (cekCheckedAll) {
      setCheckedAll(true);
    } else {
      setCheckedAll(false);
    }
  }, [items]);

  useEffect(() => {
    if (dataIdAlbum) {
      setAlbumName(
        dataIdAlbum.album.name === "Semua Album"
          ? t("AppMuatpartsWishlistSemuaAlbum")
          : dataIdAlbum.album.name
      );
      setItems(
        dataIdAlbum.items.map((item) => ({
          ...item,
          Selected: false,
          AtAlbum: true,
          IsBatch: false,
          AlbumType: dataIdAlbum?.album?.type,
        }))
      );
    }
  }, [dataIdAlbum]);

  const isEmptyFilter = (filter) => {
    if (!filter) return false;
    const brandsEmpty =
      Array.isArray(filter.brands) && filter.brands.length === 0;
    const categoriesEmpty =
      Array.isArray(filter.categories) && filter.categories.length === 0;
    const stockEmpty = filter.stock === "";
    return brandsEmpty && categoriesEmpty && stockEmpty;
  };

  const pindahkanKe = () => {
    setModalMoveAlbum(true);
    setAddItems(
      items?.filter((item) => item.Selected == true).map((item) => item.ID)
    );
  };

  const { t } = useLanguage();

  useEffect(() => {
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0414
    resetFilterAlbum();
  }, []);

  return (
    <div className="min-h-screen relative">
      <Modal
        isOpen={modalDeleteAlbum}
        setIsOpen={setModalDeleteAlbum}
        closeArea={false}
        closeBtn={true}
        desc={`Apakah kamu yakin ingin menghapus data ini?`}
        action1={{
          action: () => setModalDeleteAlbum(false),
          text: t("labelBatalButton"),
          style: "outline",
          color: "#176CF7",
          customStyle: {
            width: "112px",
          },
        }}
        action2={{
          action: () => onSaveDeleteAlbum(),
          text: t("labelYes"),
          style: "full",
          color: "#176CF7",
          customStyle: {
            width: "112px",
            color: "#ffffff",
          },
        }}
      ></Modal>
      {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 LB - 0697 LB - 0698 */}
      <Modal
        isOpen={modalDelete}
        setIsOpen={setModalDelete}
        closeArea={false}
        closeBtn={true}
        desc={
          <>
            {t("LabeltroliwishlistCekFavoritKamu")}
            <br />
            {items.filter((item) => item.Selected).length} {t("LabeltroliwishlistKamubelumpunyaalbum")}
          </>
        }
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
          action: () => hapusAlbumWishlist(),
          text: t("labelYes"),
          style: "full",
          color: "#176CF7",
          customStyle: {
            width: "112px",
            color: "#ffffff",
          },
        }}
      ></Modal>
      <div className={style.main}>
        <div className="!w-[264px]">
          <Sidebar />
        </div>
        {isLoading ? (
          <IdAlbumSkeleton />
        ) : (
          <div className="!w-[898px]">
            <BreadCrumb
              data={[
                { name: t("AppMuatpartsWishlistAlbum"), url: "/album" },
                { name: albumName, url: "/album/" + id },
              ]}
              onclick={(val) => {
                router.push(val.url);
              }}
            />
            <div className="flex items-center gap-3 relative">
              <PageTitle title={albumName} />
              {dataIdAlbum?.album?.type === "CUSTOM" && (
                <div className={`mb-4 toggle-menu`}>
                  <div
                    className="bg-white rounded-full p-2 cursor-pointer shadow-muatmuat"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    <EllipsisVertical size={18} className="text-neutral-700" />
                  </div>
                  {menuOpen && (
                    <div className="absolute top-0 ml-10 w-[159px] bg-white border border-gray-200 rounded-md shadow-lg z-10 text-xs">
                      <button
                        onClick={() => {
                          setModalEditAlbum(true);
                          setValueEditWishlist({ id, name: albumName });
                        }}
                        className="w-full text-left px-3 py-2 rounded-t-md text-neutral-900 hover:bg-gray-100"
                      >
                        {t("AppMuatpartsWishlistUbahNamaAlbum")}
                      </button>
                      <button
                        onClick={() => deleteALbum(id)}
                        className="w-full text-left px-3 py-2 rounded-b-md text-error-400 hover:bg-gray-100"
                      >
                        {t("AppMuatpartsWishlistHapus")}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            {items.length === 0 && dataIdAlbum?.Filters.Brands.length === 0 ? (
              <DataEmpty
                title={t("AppMuatpartsWishlistAlbumKosong")}
                subtitle="Isi album ini dengan produk impian dari semua album, atau klik ikon hati waktu nemu barang yang kamu sukai."
                buttonText="Tambah Barang ke Album"
                onButtonClick={() => router.push("/")}
                iconPlus
              />
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <Input
                      value={tempSearch}
                      icon={{
                        left: <IconComponent src={"/icons/search.svg"} />,
                        right: tempSearch.length >= 3 && (
                          <IconComponent
                            width={12}
                            height={12}
                            src={"/icons/silang.svg"}
                            onclick={() => {
                              setTempSearch("");
                              setFilterAlbum({
                                ...filterAlbum,
                                search: "",
                              });
                            }}
                          />
                        ),
                      }}
                      placeholder={t(
                        "AppPromosiSellerMuatpartsCariNamaProdukSKU"
                      )}
                      width={{
                        width: 238,
                      }}
                      changeEvent={(e) => {
                        setTempSearch(e.target.value);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          setFilterAlbum({
                            ...filterAlbum,
                            search: tempSearch,
                          });
                        }
                      }}
                    />
                    <Dropdown
                      options={[
                        { name: t("AppMuatpartsWishlistTerbaru"), value: null },
                        {
                          name: t("AppMuatpartsWishlistTerlama"),
                          value: "oldest",
                        },
                        {
                          name: t("AppMuatpartsWishlistTermahal"),
                          value: "priceHighest",
                        },
                        {
                          name: t("AppMuatpartsWishlistTermurah"),
                          value: "priceLowest",
                        },
                      ]}
                      classname={`!w-[128px] ${
                        filterAlbum.sort
                          ? "!text-primary-700 !border-primary-700"
                          : "text-neutral-600"
                      }`}
                      leftIconElement={
                        <IconComponent
                          src={"/icons/sorting.svg"}
                          color={filterAlbum.sort ? "primary" : "default"}
                        />
                      }
                      arrowColor={filterAlbum.sort ? "primary" : "default"}
                      defaultValue={
                        filterAlbum.sort
                          ? filterAlbum.sort
                          : [
                              {
                                name: t("AppMuatpartsWishlistTerbaru"),
                                value: null,
                              },
                            ]
                      }
                      onSelected={(val) => {
                        setFilterAlbum({ ...filterAlbum, sort: val });
                      }}
                    />
                    <div
                      className={`${style.filter} ${
                        isEmptyFilter(filterAlbum.filter) ? "" : style.active
                      }`}
                    >
                      <button
                        id={id}
                        onClick={() => setFilterOpen(!filterOpen)}
                        className={`${style.buttonPlace} select-none`}
                      >
                        <div className="flex gap-2 items-center">
                          <span
                            className={`${
                              isEmptyFilter(filterAlbum.filter)
                                ? "text-neutral-600"
                                : "text-primary-700"
                            } text-xs font-medium`}
                          >
                            {t("AppMuatpartsWishlistFilter")}
                          </span>
                        </div>
                        <IconComponent
                          src={"/icons/filter.svg"}
                          color={`${
                            isEmptyFilter(filterAlbum.filter)
                              ? "default"
                              : "primary"
                          }`}
                        />
                      </button>

                      <AlbumFilter
                        data={{
                          ...dataIdAlbum?.Filters,
                          Stock: [
                            // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0693
                            {
                              ID: "InStock",
                              Name: t("LabelalbumFilterTersedia"),
                            },
                            {
                              // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0692
                              ID: "OutStock",
                              Name: t("LabelalbumFilterTidakTersedia"),
                            },
                          ],
                        }}
                        isOpen={filterOpen}
                        setClose={() => setFilterOpen(false)}
                        onSelected={handleFilterSelected}
                        onSelectedValue={handleFilterChipsSelected}
                        initialFilter={filterAlbum.filter} // Pass the formatted filter object
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="font-semibold">
                      {t("SubscriptionTotal")} :{" "}
                      {dataIdAlbum?.pagination?.totalItems} {t("labelProduct")}
                    </div>
                    <Button
                      Class="rounded-3xl !h-8 !font-semibold"
                      onClick={() => {
                        setIsBatch(!isBatch);
                        setItems(
                          items.map((item) => ({
                            ...item,
                            Selected: false,
                            IsBatch: !isBatch,
                          }))
                        );
                      }}
                      color={isBatch ? "primary_secondary" : "primary"}
                    >
                      <div className="mt-0.5">
                        {isBatch
                          ? t("AppMuatpartsWishlistBatal")
                          : t("AppMuatpartsWishlistAturMassal")}
                      </div>
                    </Button>
                  </div>
                </div>
                <FilterChips
                  filters={filterChips}
                  onRemoveFilter={handleRemoveFilter}
                  onClearAll={handleClearAllFilters}
                />
                <>
                  {items.length > 0 ? (
                    <div className="relative">
                      <ProductGrid
                        grid={5}
                        // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2  LB - 0626
                        totalProducts={items}
                        OnSelect={(val) => {
                          setItems(
                            items.map((item) => {
                              if (item.ID === val) {
                                return { ...item, Selected: !item.Selected };
                              }
                              return item;
                            })
                          );
                        }}
                      />

                      <div className="flex items-center justify-between px-6 mb-4 border-neutral-200">
                        <div className="flex items-center gap-2">
                          {dataIdAlbum?.pagination.totalItems > 0 &&
                            Array.from({
                              length: Math.min(
                                Math.ceil(
                                  dataIdAlbum?.pagination.totalItems /
                                    dataIdAlbum?.pagination.itemsPerPage
                                ),
                                10
                              ),
                            }).map((_, index) => (
                              <button
                                key={index + 1}
                                onClick={() =>
                                  setFilterAlbum({
                                    ...filterAlbum,
                                    page: index + 1,
                                  })
                                }
                                className={`w-8 h-8 text-sm flex items-center justify-center rounded-md
                          ${
                            dataIdAlbum?.pagination.currentPage === index + 1
                              ? "bg-[#C22716] text-white font-bold"
                              : "text-neutral-600 font-medium hover:bg-neutral-50"
                          }`}
                              >
                                {index + 1}
                              </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-1">
                          <p className="font-semibold text-xs text-neutral-600 pr-4">
                            {t("buttonShowDetails")}
                          </p>
                          <div className="flex gap-1 items-center">
                            {[10, 20, 40].map((item, idx) => (
                              <button
                                key={idx}
                                onClick={() =>
                                  setFilterAlbum({
                                    ...filterAlbum,
                                    limit: item,
                                  })
                                }
                                className={`w-8 h-8 text-sm flex items-center justify-center rounded-md
                          ${
                            dataIdAlbum?.pagination.itemsPerPage === item
                              ? "bg-[#C22716] text-white font-bold"
                              : "text-neutral-600 font-medium hover:bg-neutral-50"
                          }`}
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <DataNotFound
                      classname={"mt-12"}
                      // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0691
                      title={t(
                        "LabelalbumNotFoundKeywordTidakDitemukanDiSistem"
                      )}
                    />
                  )}
                </>
              </>
            )}
          </div>
        )}
      </div>

      {isBatch && (
        <div className="sticky bottom-0 bg-white p-4 shadow-muatmuat z-50">
          <div className="flex justify-between items-center">
            <div className="flex gap-6">
              <Checkbox
                label={t("AppMuatpartsWishlistPilihSemua")}
                classname={"font-medium text-xs"}
                checked={checkedAll}
                onChange={(e) => {
                  setItems(
                    items.map((item) => {
                      return { ...item, Selected: e.checked ? true : false };
                    })
                  );
                  setCheckedAll(e.checked);
                }}
              />
              <div className="font-semibold text-xs">
                {items?.filter((item) => item.Selected == true).length}{" "}
                {t("AppMuatpartsWishlistProdukTerpilih")}
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                color="primary_secondary"
                onClick={pindahkanKe}
                Class="!h-8 !font-semibold"
              >
                {t("AppMuatpartsWishlistPindahkanKe")}
              </Button>
              <Button
                color="error"
                onClick={() => setModalDelete(true)}
                Class="!h-8 !font-semibold"
              >
                {t("AppMuatpartsWishlistHapus")}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ModalComponent
        isOpen={modalMoveAlbum}
        full
        hideHeader
        preventAreaClose
        setClose={() => setModalMoveAlbum(false)}
      >
        <div className="flex flex-col w-[471px] py-6 px-5">
          {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0696 */}
          <div className="font-bold mb-3">
            {t("LabelpindahAlbumPindahkeAlbummana")}?
          </div>

          {dataAlbum.filter((item) => item.type === "CUSTOM" && item.id !== id)
            .length > 0 ? (
            dataAlbum
              .filter((item) => item.type === "CUSTOM" && item.id !== id)
              .map((item) => (
                <button
                  role="button"
                  className="flex gap-3 hover:bg-primary-50 text-left my-1 px-1 py-2 rounded-md"
                  onClick={() => moveWishlist(item)}
                >
                  <div className="h-10 w-10">
                    <ImageGrid images={item.thumbnails} small />
                  </div>
                  <div className="font-medium">
                    <div className="text-sm">{item.name}</div>
                    <div className="text-xs text-neutral-600">
                      {item.itemCount} {t("AppMuatpartsWishlistBarang")}
                    </div>
                  </div>
                </button>
              ))
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

          <Button
            color="primary"
            Class="!h-8 !font-semibold !max-w-full !w-full !mt-3"
            onClick={() => {
              setModalNewAlbum(true);
              setModalMoveAlbum(false);
            }}
          >
            {t("AppMuatpartsWishlistTambahAlbumBaru")}
          </Button>
        </div>
      </ModalComponent>
    </div>
  );
}

export default IdAlbumWeb;
