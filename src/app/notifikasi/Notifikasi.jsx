"use client";
import { viewport } from "@/store/viewport";
import { useEffect, useState } from "react";
import NotifikasiResponsive from "./NotifikasiResponsive";
import NotifikasiWeb from "./NotifikasiWeb";
import SWRHandler from "@/services/useSWRHook";
import toast from "@/store/toast";
import ConfigUrl from "@/services/baseConfig";

const api = process.env.NEXT_PUBLIC_GLOBAL_API + "v1";

const transformCategories = (categories) => {
  const allMenuItem = {
    id: 0,
    title: "Semua Notifikasi",
    count: 0,
    type: "all",
    orderNumber: 0,
  };

  const transformedCategories = categories.map((category) => ({
    id: category.id,
    title: category.categoryName,
    count: category.counter || 0,
    type: category.type,
    orderNumber: category.orderNumber,
  }));

  return [allMenuItem, ...transformedCategories].sort(
    (a, b) => a.orderNumber - b.orderNumber
  );
};

function Notifikasi() {
  const { setShowSidebar } = toast();
  const { isMobile } = viewport();
  const { useSWRHook, mutate } = SWRHandler();
  const { get, put, post } = ConfigUrl();

  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [notificationParams, setNotificationParams] = useState("");
  const [notificationData, setNotificationData] = useState({
    list: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    },
    supportingData: { notReadCount: 0, realCountData: 0, countData: 0 },
  });

  const { data: categoryNotif } = useSWRHook(
    `v1/muatparts/notifications/categories`
  );
  const { data: subCatNotif } = useSWRHook(
    selectedMenu?.id
      ? `v1/muatparts/notifications/sub-categories?categoryId=${selectedMenu.id}`
      : null
  );
  const { data: listNotif } = useSWRHook(
    `v1/muatparts/notifications${
      notificationParams || "?page=1&limit=5&sort=newest"
    }`
  );

  const updateNotificationParams = ({
    categoryId,
    type,
    subCategoryId = null,
    page = 1,
    status = null,
  }) => {
    const params = { page, limit: 5, sort: "newest"};
    if (categoryId && categoryId !== 0) params.category_id = categoryId;
    if (type && type !== "all") params.type = type;
    if (subCategoryId) params.sub_category_id = subCategoryId;
    if (status) params.status = status && "unread";
    setNotificationParams(`?${new URLSearchParams(params)}`);
  };

  const handleMenuClick = (item) => {
    setSelectedMenu(item);
    setSelectedSubCategory(null);
  };

  const handleSubCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory);
    updateNotificationParams({
      categoryId: selectedMenu.id,
      type: selectedMenu.type,
      subCategoryId: subCategory.id,
    });
  };

  const handlePageChange = (page) => {
    updateNotificationParams({
      categoryId: selectedMenu?.id,
      type: selectedMenu?.type,
      subCategoryId: selectedSubCategory?.id,
      page,
    });
  };

  const handleMarkAllAsRead = async () => {
    try {
      const body = {
        type: selectedMenu?.type !== "all" ? selectedMenu?.type : undefined,
        category_id: selectedMenu?.id !== 0 ? selectedMenu?.id : undefined,
        sub_category_id: selectedSubCategory?.id,
      };

      post({
        path: `v1/muatparts/notifications/read-all`,
        data: body,
      }).then((lo) => {
        if (lo?.data?.Message?.Code === 200) {
          get({ path: `v1/muatparts/notifications${notificationParams}` });
        }
      });
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      put({
        path: `v1/muatparts/notifications/${notificationId}/read`,
      }).then((lo) => {
        if (lo?.data?.Message?.Code === 200) {
          get({ path: `v1/muatparts/notifications${notificationParams}` });
        }
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleToggleUnread = (showUnreadOnly) => {
    setNotificationParams("");

    setTimeout(() => {
      updateNotificationParams({
        categoryId: selectedMenu?.id,
        type: selectedMenu?.type,
        subCategoryId: selectedSubCategory?.id,
        status: showUnreadOnly,
      });
    }, 0);
  };

  useEffect(() => {
    setShowSidebar(false);
  }, []);

  useEffect(() => {
    if (categoryNotif?.Data?.categories && listNotif?.Data) {
      const transformed = transformCategories(categoryNotif.Data.categories);
      const updatedMenuItems = transformed.map((menuItem) => {
        if (menuItem.id === selectedMenu?.id) {
          return {
            ...menuItem,
            count: listNotif.Data.SupportingData.NotReadCount || 0,
          };
        }
        return {
          ...menuItem,
          count: 0,
        };
      });

      setMenuItems(updatedMenuItems);
      if (!selectedMenu) {
        handleMenuClick(updatedMenuItems[0]);
      }
    }
  }, [categoryNotif, listNotif, selectedMenu]);

  useEffect(() => {
    if (selectedMenu && subCatNotif?.Data?.subCategories?.length > 0) {
      const firstSubCat = subCatNotif.Data.subCategories[0];
      setSelectedSubCategory(firstSubCat);
      updateNotificationParams({
        categoryId: selectedMenu.id,
        type: selectedMenu.type,
        subCategoryId: firstSubCat.id,
      });
    } else {
      setSelectedSubCategory(null);
      updateNotificationParams({
        categoryId: selectedMenu?.id,
        type: selectedMenu?.type,
      });
    }
  }, [selectedMenu, subCatNotif]);

  useEffect(() => {
    if (listNotif?.Data) {
      setNotificationData({
        list: listNotif.Data.notifications.map((notif) => ({
          id: notif.ID,
          title: notif.Judul,
          content: notif.Deskripsi,
          date: notif.time_notif,
          isNew: notif.status_read === 0,
          tipe_action: notif.tipe_action,
          additional_information: notif.additional_information,
        })),
        pagination: listNotif.Data.pagination,
        supportingData: listNotif.Data.SupportingData,
      });
    }
  }, [listNotif]);

  const sharedProps = {
    menuItems,
    subCategories: subCatNotif?.Data?.subCategories || [],
    selectedSubCategory,
    notificationData,
    onMenuClick: handleMenuClick,
    onSubCategoryClick: handleSubCategoryClick,
    onPageChange: handlePageChange,
    onMarkAllRead: handleMarkAllAsRead,
    onMarkAsRead: handleMarkAsRead,
    onToggleUnread: handleToggleUnread,
  };

  if (typeof isMobile !== "boolean") return <></>;
  return isMobile ? (
    <NotifikasiResponsive {...sharedProps} />
  ) : (
    <NotifikasiWeb {...sharedProps} />
  );
}

export default Notifikasi;
