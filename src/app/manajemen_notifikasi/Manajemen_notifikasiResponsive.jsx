import { useHeader } from "@/common/ResponsiveContext";
import React, { useEffect, useState } from "react";
import style from "./Manajemen_notifikasi.module.scss";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Mail } from "lucide-react";

function Manajemen_notifikasiResponsive() {
  const {
    appBarType, //pilih salah satu : 'header_title_secondary' || 'header_search_secondary' || 'default_search_navbar_mobile' || 'header_search' || 'header_title'
    appBar, // muncul ini : {onBack:null,title:'',showBackButton:true,appBarType:'',appBar:null,header:null}
    renderAppBarMobile, // untuk render komponen header mobile dengan memasukkanya ke useEffect atau by trigger function / closer
    setAppBar, // tambahkan payload seperti ini setAppBar({onBack:()=>setScreen('namaScreen'),title:'Title header',appBarType:'type'})
    handleBack, // dipanggil di dalam button di luar header, guna untuk kembali ke screen sebelumnya
    clearScreen, // reset appBar
    setScreen, // set screen
    screen, // get screen,
    search, // {placeholder:'muatparts',value:'',type:'text'}
    setSearch, // tambahkan payload seperti ini {placeholder:'Pencarian',value:'',type:'text'}
  } = useHeader();

  useEffect(() => {
    if (screen === "") {
      setAppBar({
        title: "Profil Toko",
        appBarType: "header_title_modal",
      });
      // setAppBar({
      //   renderAppBar: (
      //     <div className="flex">
      //       <span
      //         onClick={() => handleBack()}
      //         className="w-6 h-6 rounded-full bg-neutral-50 flex justify-center items-center cursor-pointer"
      //       >
      //         <IconComponent
      //           src={"/icons/chevron-left.svg"}
      //           classname={style.iconBackRed}
      //           width={24}
      //         />
      //       </span>
      //       <span className="font-bold text-base text-white flex justify-center w-full -ml-[25px]">
      //         Profil Toko
      //       </span>
      //     </div>
      //   ),
      // });
    }
    if (screen === "example2") {
      setAppBar({
        title: "Example 2",
        appBarType: "header_search",
        renderAppBar: "",
        onBack: () => {
          setAppBar({
            title: "Profil Toko",
            appBarType: "header_title_modal",
          });
          setScreen("");
        },
      });
      setSearch({
        placeholder: "Cari Menu/Modul",
      });
    }
    if (screen === "example3") {
      setAppBar({
        title: "Example 3",
        appBarType: "header_search",
        renderAppBar: "",
        onBack: () => {
          setAppBar({
            title: "Profil Toko",
            appBarType: "header_title_modal",
          });
          setScreen("");
        },
      });
      setSearch({
        placeholder: "Cari Menu/Modul",
      });
    }
    if (screen === "example4") {
      setAppBar({
        title: "Example 4",
        appBarType: "header_search",
        renderAppBar: "",
        onBack: () => {
          setAppBar({
            title: "Profil Toko",
            appBarType: "header_title_modal",
          });
          setScreen("");
        },
      });
      setSearch({
        placeholder: "Cari Menu/Modul",
      });
    }
  }, [screen]);

  if (screen === "example2") return <NotifEmail search={search} />;
  if (screen === "example3") return <NotifAplikasi search={search} />;
  if (screen === "example4") return <RingkasanNotifikasi search={search} />;
  // main screen
  return (
    <div className={`${style.main} px-4 bg-[#F3F3F3] flex flex-col`}>
      <div
        className="flex items-center justify-between w-full py-6 border-b bg-[#F3F3F3] cursor-pointer"
        onClick={() => {
          setScreen("example2");
        }}
      >
        <span className="text-sm font-semibold text-neutral-900">
          Notifikasi di Email
        </span>
        <IconComponent src="/icons/chevron-right.svg" />
      </div>
      <div
        className="flex items-center justify-between w-full py-6 border-b bg-[#F3F3F3] cursor-pointer"
        onClick={() => {
          setScreen("example3");
          setAppBar({
            title: "Example 3",
            appBarType: "header_search_secondary",
            onBack: () => clearScreen(),
          });
          setSearch({
            placeholder: "Cari Menu/Modul",
          });
        }}
      >
        <span className="text-sm font-semibold text-neutral-900">
          Notifikasi di Aplikasi
        </span>
        <IconComponent src="/icons/chevron-right.svg" />
      </div>
      <div
        className="flex items-center justify-between w-full py-6 border-b bg-[#F3F3F3] cursor-pointer"
        onClick={() => {
          setScreen("example4");
          setAppBar({
            title: "Example 4",
            appBarType: "header_search_secondary",
            onBack: () => clearScreen(),
          });
          setSearch({
            placeholder: "Cari Menu/Modul",
          });
        }}
      >
        <span className="text-sm font-semibold text-neutral-900">
          Ringkasan
        </span>
        <IconComponent src="/icons/chevron-right.svg" />
      </div>
    </div>
  );
}

export default Manajemen_notifikasiResponsive;

const NotifEmail = ({ search }) => {
  const emailNotifications = {
    id: 1,
    title: "Notifikasi di Email",
    enabled: false,
    children: [
      { id: 1, name: "Umum", enabled: false },
      { id: 2, name: "Pengajuan Dokumen Legalitas", enabled: false },
      { id: 3, name: "Pembelian Paket", enabled: false },
      { id: 4, name: "Posting Iklan", enabled: false },
    ],
  };
  const [notifState, setNotifState] = useState(emailNotifications);
  const [searchTerm, setSearchTerm] = useState(search.value);

  useEffect(() => {
    setSearchTerm(search?.value || "");
  }, [search?.value]);

  // Handle parent toggle
  const handleParentToggle = () => {
    const newEnabled = !notifState.enabled;
    setNotifState({
      ...notifState,
      enabled: newEnabled,
      children: notifState.children.map((child) => ({
        ...child,
        enabled: newEnabled,
      })),
    });

    console.log("Parent Toggle:", {
      enabled: newEnabled,
      activeChildren: newEnabled
        ? notifState.children.map((child) => child.name)
        : [],
    });
  };

  // Handle child toggle
  const handleChildToggle = (childId) => {
    const updatedChildren = notifState.children.map((child) =>
      child.id === childId ? { ...child, enabled: !child.enabled } : child
    );

    // Check if all children are active
    const allChildrenActive = updatedChildren.every((child) => child.enabled);

    setNotifState({
      ...notifState,
      enabled: allChildrenActive,
      children: updatedChildren,
    });

    console.log("Child Toggle:", {
      child: notifState.children.find((c) => c.id === childId)?.name,
      activeChildren: updatedChildren
        .filter((child) => child.enabled)
        .map((child) => child.name),
    });
  };

  // Highlight search text
  const highlightText = (text) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="font-bold text-neutral-900">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Filter children based on search
  const filteredChildren = notifState.children.filter((child) =>
    searchTerm
      ? child.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  // Only show content if there are matching results
  const shouldShowContent = filteredChildren.length > 0;

  return (
    <div className="max-w-md mx-auto py-5 px-4 bg-[#F3F3F3] space-y-[14px]">
      {shouldShowContent ? (
        <>
          {/* Parent Toggle */}
          <div className="flex justify-between items-center border-b pb-4 bg-white rounded-lg border p-4">
            <span className="font-semibold text-sm text-[#676767]">
              {notifState.title}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifState.enabled}
                onChange={handleParentToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {/* Children Toggles */}
          <div className="flex flex-col gap-4 justify-between items-center border-b pb-4 bg-white rounded-lg border p-4">
            {filteredChildren.map((child) => (
              <div
                key={child.id}
                className="flex justify-between items-center w-full"
              >
                <span className="font-semibold text-sm text-[#676767]">
                  {highlightText(child.name)}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={child.enabled}
                    onChange={() => handleChildToggle(child.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </>
      ) : (
        "not found e ruben"
      )}
    </div>
  );
};

const NotifAplikasi = ({ search }) => {
  const emailAplikasi = {
    id: 1,
    title: "Notifikasi di Aplikasi",
    enabled: false,
    children: [
      { id: 1, name: "Umum", enabled: false },
      { id: 2, name: "Pengajuan Dokumen Legalitas", enabled: false },
      { id: 3, name: "Pembelian Paket", enabled: false },
      { id: 4, name: "Posting Iklan", enabled: false },
    ],
  };
  const [notifState, setNotifState] = useState(emailAplikasi);
  const [searchTerm, setSearchTerm] = useState(search.value);

  useEffect(() => {
    setSearchTerm(search?.value || "");
  }, [search?.value]);

  // Handle parent toggle
  const handleParentToggle = () => {
    const newEnabled = !notifState.enabled;
    setNotifState({
      ...notifState,
      enabled: newEnabled,
      children: notifState.children.map((child) => ({
        ...child,
        enabled: newEnabled,
      })),
    });

    console.log("Parent Toggle:", {
      enabled: newEnabled,
      activeChildren: newEnabled
        ? notifState.children.map((child) => child.name)
        : [],
    });
  };

  // Handle child toggle
  const handleChildToggle = (childId) => {
    const updatedChildren = notifState.children.map((child) =>
      child.id === childId ? { ...child, enabled: !child.enabled } : child
    );

    // Check if all children are active
    const allChildrenActive = updatedChildren.every((child) => child.enabled);

    setNotifState({
      ...notifState,
      enabled: allChildrenActive,
      children: updatedChildren,
    });

    console.log("Child Toggle:", {
      child: notifState.children.find((c) => c.id === childId)?.name,
      activeChildren: updatedChildren
        .filter((child) => child.enabled)
        .map((child) => child.name),
    });
  };

  // Highlight search text
  const highlightText = (text) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="font-bold text-neutral-900">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Filter children based on search
  const filteredChildren = notifState.children.filter((child) =>
    searchTerm
      ? child.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  // Only show content if there are matching results
  const shouldShowContent = filteredChildren.length > 0;

  return (
    <div className="max-w-md mx-auto py-5 px-4 bg-[#F3F3F3] space-y-[14px]">
      {shouldShowContent ? (
        <>
          {/* Parent Toggle */}
          <div className="flex justify-between items-center border-b pb-4 bg-white rounded-lg border p-4">
            <span className="font-semibold text-sm text-[#676767]">
              {notifState.title}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifState.enabled}
                onChange={handleParentToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {/* Children Toggles */}
          <div className="flex flex-col gap-4 justify-between items-center border-b pb-4 bg-white rounded-lg border p-4">
            {filteredChildren.map((child) => (
              <div
                key={child.id}
                className="flex justify-between items-center w-full"
              >
                <span className="font-semibold text-sm text-[#676767]">
                  {highlightText(child.name)}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={child.enabled}
                    onChange={() => handleChildToggle(child.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </>
      ) : (
        "not found e ruben"
      )}
    </div>
  );
};

const RingkasanNotifikasi = ({ search }) => {
  const notifications = [
    { id: 1, name: "Pengajuan Dokumen Legalitas", email: true, push: false },
    { id: 2, name: "Pembelian Paket", email: false, push: true },
    { id: 3, name: "Posting Iklan", email: true, push: false },
  ];
  const [searchTerm, setSearchTerm] = useState(search?.value || "");

  useEffect(() => {
    setSearchTerm(search?.value || "");
  }, [search?.value]);

  // Highlight search text
  const highlightText = (text) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="font-bold text-neutral-900">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) =>
    searchTerm
      ? notif.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  return (
    <div className="mx-auto py-5 px-4 bg-[#F3F3F3]">
      <h2 className="text-sm font-bold text-[#676767]">
        Ringkasan Notifikasi yang Aktif
      </h2>
      {filteredNotifications.length > 0 && (
        <div className="bg-white rounded-lg border p-[14px] mt-[14px]">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className="flex items-center justify-between py-2"
            >
              <span className="text-sm text-[#676767] font-semibold">
                {highlightText(notif.name)}
              </span>
              <div className="flex gap-3 items-center">
                <Mail
                  size={20}
                  className={`${
                    notif.email ? "text-[#176CF7]" : "text-[#CECECE]"
                  }`}
                />
                {notif.push ? (
                  <IconComponent src="/icons/bellnotifactive.svg" />
                ) : (
                  <IconComponent src="/icons/bellnotif.svg" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
