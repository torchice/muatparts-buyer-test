"use client";
import { useEffect, useRef, useState } from "react";
import style from "./Notifikasi.module.scss";
import { MoreVertical, CircleCheck } from "lucide-react";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import DataNotFound from "@/components/DataNotFound/DataNotFound";

function NotifikasiWeb(sharedProps) {
  const {
    menuItems,
    subCategories,
    selectedSubCategory,
    notificationData,
    onMenuClick,
    onSubCategoryClick,
    onPageChange,
    onMarkAllRead,
    onMarkAsRead,
    onToggleUnread,
  } = sharedProps;

  const [selectedMenu, setSelectedMenu] = useState(0);
  const [activePopover, setActivePopover] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const headerPopoverRef = useRef(null);
  const headerButtonRef = useRef(null);
  const notificationPopoverRefs = useRef({});
  const notificationButtonRefs = useRef({});

  const generatePaginationNumbers = (currentPage, totalPages) => {
    let pages = [1];
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    if (totalPages > 1 && !pages.includes(totalPages)) pages.push(totalPages);
    return pages;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activePopover === "header") {
        if (
          !headerPopoverRef.current?.contains(event.target) &&
          !headerButtonRef.current?.contains(event.target)
        ) {
          setActivePopover(null);
        }
        return;
      }

      if (typeof activePopover === "number") {
        const popoverRef = notificationPopoverRefs.current[activePopover];
        const buttonRef = notificationButtonRefs.current[activePopover];
        if (
          !popoverRef?.contains(event.target) &&
          !buttonRef?.contains(event.target)
        ) {
          setActivePopover(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePopover]);

  return (
    <div className="flex min-h-screen bg-gray-100 px-[72px] py-[34px]">
      <div className="sticky top-[34px] h-fit">
        <div className="w-64 bg-white shadow-muat h-fit p-3 rounded-lg">
          {menuItems?.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedMenu(item.id);
                onMenuClick(item);
              }}
              className={`flex justify-between items-center px-4 py-3 cursor-pointer text-sm ${
                selectedMenu === item.id
                  ? "text-[#CF2E1D] font-bold bg-[#FFEAEC] !border-none"
                  : "text-[#868686] font-semibold"
              } ${idx !== menuItems.length - 1 ? "border-b" : ""}`}
            >
              <span>{item.title || item.categoryName}</span>
              {item.count > 0 && (
                <span className="bg-[#CF2E1D] text-white text-xs px-2 py-1 rounded-full">
                  {item.count}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 pl-8 overflow-y-auto">
        <div className="bg-white rounded-lg shadow px-3">
          <div className="flex justify-between items-center pt-3 pb-6 relative">
            <h2 className="text-base font-bold">Notifikasi</h2>
            <div className="flex items-center gap-3">
              <Button
                Class="flex items-center gap-1 !text-xs !font-semibold !h-6 !w-fit"
                color="primary_secondary"
                onClick={onMarkAllRead}
              >
                <IconComponent src="/icons/crosscheck.svg" />
                Tandai Semua Telah Dibaca
              </Button>

              <button
                ref={headerButtonRef}
                onClick={() =>
                  setActivePopover((prev) =>
                    prev === "header" ? null : "header"
                  )
                }
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {activePopover === "header" && (
                <div
                  ref={headerPopoverRef}
                  className="absolute right-0 top-12 w-[225px] bg-white rounded-md shadow-lg z-20 border"
                >
                  <div
                    className="flex items-center justify-between hover:bg-gray-50 py-3 px-[10px] rounded cursor-pointer"
                    onClick={() => {
                      onToggleUnread(false);
                      setActiveFilter("all");
                      setActivePopover(null);
                    }}
                  >
                    <span className="font-medium text-xs text-neutral-900">
                      Tampilkan Notifikasi
                    </span>
                    {activeFilter === "all" && (
                      <CircleCheck size={16} color="#176cf7" />
                    )}
                  </div>
                  <div
                    className="flex items-center justify-between hover:bg-gray-50 py-3 px-2 rounded cursor-pointer"
                    onClick={() => {
                      onToggleUnread(true);
                      setActiveFilter("unread");
                      setActivePopover(null);
                    }}
                  >
                    <span className="font-medium text-xs text-neutral-900">
                      Tampilkan semua yang belum dibaca
                    </span>
                    {activeFilter === "unread" && (
                      <CircleCheck size={16} color="#176cf7" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {subCategories?.length > 0 ? (
            <div className="border-b">
              <div className="overflow-x-auto no-scrollbar">
                <div className="flex items-center h-12 gap-8 psx-6">
                  {subCategories.map((subCat) => (
                    <button
                      key={subCat.id}
                      onClick={() => onSubCategoryClick(subCat)}
                      className={`h-full text-xs flex items-center px-2 cursor-pointer relative whitespace-nowrap
              ${
                selectedSubCategory?.id === subCat.id
                  ? "text-[#CF2E1D] border-b-2 border-[#CF2E1D] font-bold"
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
            </div>
          ) : (
            <hr className="mx-0" />
          )}

          <div className="pt-6">
            {notificationData.list.length > 0 ? (
              notificationData.list.map((notification) => (
                <div key={notification.id}>
                  <div
                    className={`p-4 relative ${
                      notification.isNew
                        ? "bg-red-50 border-l-2 border-[#CF2E1D]"
                        : "bg-white"
                    } cursor-pointer`}
                    onClick={(e) => {
                       if (!e.target.closest(".notification-popover")) {
                         const decodedUrl = decodeURIComponent(
                           notification?.additional_information?.deeplink
                         );
                         window.location.href = decodedUrl;
                       }
                    }}
                  >
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-sm text-neutral-900">
                        {notification.title}
                      </h3>
                      <div className="relative notification-popover">
                        {" "}
                        {/* Tambah class untuk identifier */}
                        <button
                          ref={(el) =>
                            (notificationButtonRefs.current[notification.id] =
                              el)
                          }
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            setActivePopover((prev) =>
                              prev === notification.id ? null : notification.id
                            );
                          }}
                        >
                          <MoreVertical
                            color={notification.isNew ? "#1b1b1b" : "#d7d7d7"}
                            className="w-5 h-5"
                          />
                        </button>
                        {activePopover === notification.id && (
                          <div
                            ref={(el) =>
                              (notificationPopoverRefs.current[
                                notification.id
                              ] = el)
                            }
                            className="absolute right-0 mt-2 bg-white rounded-md shadow-lg z-10 border w-[140px]"
                          >
                            <div className="py-3 px-[10px]">
                              <button
                                className="block w-full text-left text-xs text-neutral-900 font-medium"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent card click
                                  onMarkAsRead(notification.id);
                                  setActivePopover(null);
                                }}
                              >
                                Tandai sudah dibaca
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-[#868686] font-medium text-xs -mt-[2px]">
                      {notification.content}
                    </p>
                    <p className="text-[#868686] text-xs font-semibold mt-2">
                      {notification.date}
                    </p>
                  </div>
                  {!notification.isNew && <hr />}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <DataNotFound />
              </div>
            )}
          </div>

          {notificationData?.list?.length > 0 && (
            <div className="flex justify-center items-center gap-2 py-4">
              {generatePaginationNumbers(
                notificationData.pagination.currentPage,
                notificationData.pagination.totalPages
              ).map((item, index) =>
                item === "..." ? (
                  <span key={`dot-${index}`} className="text-[#868686] px-1">
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => onPageChange(item)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold ${
                      notificationData.pagination.currentPage === item
                        ? "bg-[#CF2E1D] text-white"
                        : "text-[#868686] hover:bg-gray-100"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotifikasiWeb;
