export const navigationGroups = [
  {
    id: "group1",
    items: [
      {
        id: "favorite",
        icon: "/icons/heart-outline.svg",
        label: "Favorit",
        url: "/album",
      },
      {
        id: "voucher",
        icon: "/icons/sidebar/pusatpromosi.svg",
        label: "Voucher Saya",
        url: "/voucher",
      },
    ],
  },
  {
    id: "group2",
    items: [
      {
        id: "orders",
        icon: "/icons/sidebar/kelolapesanan.svg",
        label: "Daftar Pesanan",
        url: "/daftarpesanan",
      },
      {
        id: "reviews",
        icon: "/icons/sidebar/ulasan.svg",
        label: "Ulasan Produk",
        url: "/ulasanbuyer",
      },
      {
        id: "complaints",
        icon: "/icons/sidebar/komplain.svg",
        label: "Pengajuan Komplain",
        url: "/complaints",
      },
      {
        id: "insurance",
        icon: "/icons/sidebar/asuransi.svg",
        label: "Asuransi Produk",
        url: "/insurance",
      },
      {
        id: "discussions",
        icon: "/icons/sidebar/diskusi.svg",
        label: "Diskusi Produk",
        url: "/discussions",
      },
    ],
  },
  {
    id: "group3",
    title: "Profil Akun",
    items: [
      {
        id: "profile",
        icon: "/icons/sidebar/profile.svg",
        label: "Profil",
        url:
          process.env.NEXT_PUBLIC_INTERNAL_WEB +
          "accountmanagement/profileManagementCompany2",
      },
      {
        id: "settings",
        icon: "/icons/sidebar/account-setting.svg",
        label: "Pengaturan Akun",
        url:
          process.env.NEXT_PUBLIC_INTERNAL_WEB + "accountmanagement/pengaturan_akun",
      },
      {
        id: "bank",
        icon: "/icons/sidebar/account-setting.svg",
        label: "Rekening Bank",
        url:
          process.env.NEXT_PUBLIC_INTERNAL_WEB + "accountmanagement/rekening_bank",
      },
      {
        id: "location",
        icon: "/icons/sidebar/location-management.svg",
        label: "Manajemen Lokasi",
        url:
          process.env.NEXT_PUBLIC_INTERNAL_WEB +
          "accountmanagement/location_management",
      },
      {
        id: "users",
        icon: "/icons/sidebar/user-management.svg",
        label: "Manajemen User",
        url:
          process.env.NEXT_PUBLIC_INTERNAL_WEB + "accountmanagement/user_management",
      },
      {
        id: "roles",
        icon: "/icons/sidebar/role-management.svg",
        label: "Manajemen Role",
        url:
          process.env.NEXT_PUBLIC_INTERNAL_WEB + "accountmanagement/role_management",
      },
    ],
  },
  {
    id: "group4",
    items: [
      {
        id: "help",
        icon: "/icons/sidebar/help-center.svg",
        label: "Pusat Bantuan",
        url: process.env.NEXT_PUBLIC_INTERNAL_WEB + "traffic/redirect_faq?from=gen",
      },
    ],
  },
];
