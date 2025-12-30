import { useHeader } from "@/common/ResponsiveContext";
import React, { Fragment, useEffect, useState } from "react";
import style from "./Notifikasi.module.scss";
import IconComponent from "@/components/IconComponent/IconComponent";
import { MoreVertical } from "lucide-react";
import toast from "@/store/toast";
import RadioButton from "@/components/Radio/RadioButton";
import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";

function NotifikasiResponsive({
  menuItems,
  subCategories,
  selectedSubCategory,
  notificationData,
  onMenuClick,
  onSubCategoryClick,
  onMarkAllRead,
  onMarkAsRead,
  onToggleUnread,
}) {
  const { appBarType, setAppBar } = useHeader();

  const { setTitleBottomsheet, setShowBottomsheet, setDataBottomsheet } =
    toast();

  const [initLoad, setInitLoad] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedMenuItem, setSelectedMenuItem] = useState(menuItems[0]);

  useEffect(() => {
    if (menuItems.length > 0 && !initLoad) {
      setInitLoad(true);
      setSelectedMenuItem(menuItems[0]);
    }
  }, [menuItems]);

  const [showFilter, setShowFilter] = useState(false); // Tambahkan state ini

  useEffect(() => {
    setAppBar({
      renderActionButton: (
        <div
          className="flex items-center flex-col cursor-pointer z-10"
          onClick={() => setShowFilter(true)}
        >
          <IconComponent src="/icons/menuHeaderIconMobile.svg" />
          <span className="font-semibold text-[10px] !text-white">Menu</span>
        </div>
      ),
      title: "Notifikasi",
      appBarType: "header_title",
    });
  }, [selectedMenuItem]);

  useEffect(() => {
    if (showFilter) {
      setTitleBottomsheet("Pilih Notifikasi");
      setDataBottomsheet(
        <div className="space-y-4">
          <div className="w-full justify-between flex items-center">
            <RadioButton
              name="pilih_notifikasi"
              value="all"
              checked={activeFilter === "all"}
              onClick={handleFilterChange}
              label="Tampilkan Notifikasi"
            />
          </div>
          <hr />
          <div className="w-full justify-between flex items-center">
            <RadioButton
              name="pilih_notifikasi"
              value="unread"
              checked={activeFilter === "unread"}
              onClick={handleFilterChange}
              label="Tampilkan semua yang belum dibaca"
            />
          </div>
          <Button
            Class="!text-sm !font-semibold !min-w-full !w-full !max-w-full"
            onClick={handleApplyFilter}
          >
            Terapkan
          </Button>
        </div>
      );
      setShowBottomsheet(true);
    }
  }, [showFilter, activeFilter]);

  // const handleFilterChange = (event) => {
  //   const eventValue = event?.value || event?.target?.value;
  //   setActiveFilter(eventValue);
  // };

  // const handleApplyFilter = () => {
  //   const selectedValue = document.querySelector(
  //     'input[name="pilih_notifikasi"]:checked'
  //   ).value;
  //   setShowBottomsheet(false);
  //   onToggleUnread(selectedValue === "unread");
  // };

  const handleFilterChange = (event) => {
    const eventValue = event?.value || event?.target?.value;
    setActiveFilter(eventValue);
  };

  const handleApplyFilter = () => {
    setShowFilter(false);
    setShowBottomsheet(false);
    onToggleUnread(activeFilter === "unread");
  };

  const handleShowNotificationMenu = (notification) => {
    setTitleBottomsheet("Menu");
    setShowBottomsheet(true);
    setDataBottomsheet(
      <div className="mt-2">
        <span
          className="font-semibold text-sm text-neutral-900 cursor-pointer"
          onClick={() => {
            setShowBottomsheet(false);
            onMarkAsRead(notification.id);
          }}
        >
          Tandai Sudah Dibaca
        </span>
      </div>
    );
  };

  return (
    <div className={`${style.main} flex-col`}>
      {/* Categories Navigation */}
      <div className="sticky top-0 z-10 bg-white shadow-muatmuat">
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex items-center h-12">
            {menuItems?.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedMenuItem(item);
                  onMenuClick(item);
                }}
                className={`h-full text-sm flex items-center px-6 cursor-pointer relative whitespace-nowrap
                  ${
                    selectedMenuItem?.id === item.id
                      ? "text-[#CF2E1D] border-b-2 border-[#CF2E1D] font-bold"
                      : "text-[#868686] hover:text-[#CF2E1D] font-medium"
                  }`}
              >
                {item.title || item.categoryName}
                {item.count > 0 && (
                  <span className="ml-2 bg-[#CF2E1D] text-white text-xs px-1.5 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Subcategories if available */}
      {subCategories?.length > 0 && (
        <div className="overflow-x-auto no-scrollbar border-t bg-none px-4">
          <div className="flex items-center h-12 gap-2">
            {subCategories.map((subCat) => (
              <button
                key={subCat.id}
                onClick={() => onSubCategoryClick(subCat)}
                className={` border rounded-2xl h-fit w-fit text-xs flex items-center px-3 py-1 cursor-pointer relative whitespace-nowrap
                    ${
                      selectedSubCategory?.id === subCat.id
                        ? "text-[#CF2E1D] border-[#CF2E1D] bg-red-50 font-bold"
                        : "text-[#868686] hover:text-[#CF2E1D] font-medium"
                    }`}
              >
                {subCat.name}
                {subCat.count > 0 && (
                  <span className="ml-2 bg-[#CF2E1D] text-white text-xs px-1.5 py-0.5 rounded-full">
                    {subCat.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {notificationData.list.length > 0 ? (
        <div className={`${subCategories?.length > 0 ? "pt-3" : "pt-5"}`}>
          <span
            className="font-semibold text-sm text-primary-700 block w-full text-right pr-4 cursor-pointer"
            onClick={onMarkAllRead}
          >
            Tandai Sudah Dibaca
          </span>
          <hr className="mt-3 mb-0 border-none" />

          <div>
            {notificationData.list.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 relative border-b ${
                  notification.isNew
                    ? "bg-red-50 border-l-2 border-[#CF2E1D] border-b-[#d7d7d7]"
                    : "bg-white"
                }`}
                onClick={() => {
                  if (notification?.additional_information?.deeplink) {
                    const decodedUrl = decodeURIComponent(
                      notification.additional_information.deeplink
                    );
                    window.location.href = decodedUrl;
                  }
                }}
              >
                <div className="flex justify-between">
                  <h3 className="font-semibold text-sm text-neutral-900">
                    {notification.title}
                  </h3>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowNotificationMenu(notification);
                      }}
                    >
                      <MoreVertical
                        color={notification.isNew ? "#1b1b1b" : "#d7d7d7"}
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </div>
                <p className="text-[#868686] font-medium text-xs -mt-[2px]">
                  {notification.content}
                </p>
                <p className="text-[#868686] text-xs font-semibold mt-2">
                  {notification.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center h-dvh flex justify-center items-center -mt-[130px]">
          <DataNotFound />
        </div>
      )}
    </div>
  );
}

export default NotifikasiResponsive;
