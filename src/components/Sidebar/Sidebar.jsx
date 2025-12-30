import React, { useState } from "react";
import { UserProfile } from "./UserProfile";
import { SidebarGroup } from "./SidebarGroup";
import { useLanguage } from "@/context/LanguageContext";
import { userZustand } from "@/store/auth/userZustand";
export function Sidebar() {
  const { id, name, photo } = userZustand();
  const [activeItem, setActiveItem] = useState(null);
  const { t } = useLanguage();
  const navigationGroups = [
    {
      id: "group1",
      items: [
        {
          id: "favorite",
          icon: "/icons/heart-outline.svg",
          label: t("titleHeaderFavorit"),
          url: "/album",
        },
        {
          id: "voucher",
          icon: "/icons/sidebar/pusatpromosi.svg",
          label: t("titleHeaderVoucher"),
          url: "/voucher/buyer",
        },
      ],
    },
    {
      id: "group2",
      items: [
        {
          id: "orders",
          icon: "/icons/sidebar/kelolapesanan.svg",
          label: t("titleHeaderDaftarPesanan"),
          url: "/daftarpesanan",
        },
        {
          id: "reviews",
          icon: "/icons/sidebar/ulasan.svg",
          label: t("titleHeaderUlasanProduk"),
          url: "/ulasanbuyer",
        },
        {
          id: "complaints",
          icon: "/icons/sidebar/komplain.svg",
          label: t("labelPengajuanKomplain"),
          url: "/complaints",
        },
        {
          id: "insurance",
          icon: "/icons/sidebar/asuransi.svg",
          label: t("labelAsuransiProduk"),
          url: "/insurance",
        },
        {
          id: "discussions",
          icon: "/icons/sidebar/diskusi.svg",
          label: t("labelDiskusiProduk"),
          url: "/discussions",
          hidden: true,
        },
      ],
    },
    {
      id: "group3",
      title: t("labelProfilAkun"),
      items: [
        {
          id: "profile",
          icon: "/icons/sidebar/profile.svg",
          label: t("titleHeaderProfile"),
          url:
            process.env.NEXT_PUBLIC_INTERNAL_WEB +
            "accountmanagement/profileManagementCompany2",
        },
        {
          id: "settings",
          icon: "/icons/sidebar/account-setting.svg",
          label: t("titleHeaderPengaturanAkun"),
          url:
            process.env.NEXT_PUBLIC_INTERNAL_WEB +
            "accountmanagement/pengaturan_akun",
        },
        {
          id: "bank",
          icon: "/icons/sidebar/account-setting.svg",
          label: t("labelRekeningBank"),
          url:
            process.env.NEXT_PUBLIC_INTERNAL_WEB +
            "accountmanagement/rekening_bank",
        },
        {
          id: "location",
          icon: "/icons/sidebar/location-management.svg",
          label: t("labelManajemenLokasi"),
          url:
            process.env.NEXT_PUBLIC_INTERNAL_WEB +
            "accountmanagement/location_management",
        },
        {
          id: "users",
          icon: "/icons/sidebar/user-management.svg",
          label: t("LabelManajemenUser"),
          url:
            process.env.NEXT_PUBLIC_INTERNAL_WEB +
            "accountmanagement/user_management",
        },
        {
          id: "roles",
          icon: "/icons/sidebar/role-management.svg",
          label: t("labelManajemenRole"),
          url:
            process.env.NEXT_PUBLIC_INTERNAL_WEB +
            "accountmanagement/role_management",
        },
      ],
    },
    {
      id: "group4",
      items: [
        {
          id: "help",
          icon: "/icons/sidebar/help-center.svg",
          label: t("linkPusatBantuan"),
          url:
            process.env.NEXT_PUBLIC_INTERNAL_WEB +
            "traffic/redirect_faq?from=gen",
        },
      ],
    },
  ];

  return (
    id && (
      <div className="flex overflow-hidden flex-col p-4 bg-white rounded-md border border-solid border-stone-300 w-[270px]">
        <UserProfile photo={photo} name={name} />
        {navigationGroups.map((group, index) => (
          <SidebarGroup
            key={group.id}
            {...group}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            isLast={index === navigationGroups.length - 1}
          />
        ))}
      </div>
    )
  );
}
