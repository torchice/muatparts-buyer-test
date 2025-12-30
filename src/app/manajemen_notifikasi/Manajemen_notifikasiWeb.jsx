"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import style from "./Manajemen_notifikasi.module.scss";
import Input from "@/components/Input/Input";

// Data untuk setiap tab
const tabsContent = {
  Umum: [
    {
      id: 1,
      title: "Big Fleets",
      type: "bigFleet",
      enabled: false,
      children: [
        { id: 1, name: "Subscription", push: false, email: false },
        { id: 2, name: "Manajemen Mitra", push: false, email: false },
        { id: 3, name: "Info Pre Tender", push: false, email: false },
        { id: 4, name: "Proses Tender", push: false, email: false },
        { id: 5, name: "Pemenang Tender", push: false, email: false },
      ],
    },
    {
      id: 2,
      title: "Transport Market",
      type: "transport",
      enabled: false,
      children: [
        { id: 1, name: "Lelang Muatan", push: false, email: false },
        { id: 2, name: "Cari Harga Transport", push: false, email: false },
        { id: 3, name: "Promo Transporter", push: false, email: false },
      ],
    },
  ],
  Shipper: [
    {
      id: 1,
      title: "Order Management",
      type: "order",
      enabled: false,
      children: [
        { id: 1, name: "Konfirmasi Order", push: false, email: false },
        { id: 2, name: "Status Pengiriman", push: false, email: false },
      ],
    },
  ],
  Transporter: [
    {
      id: 1,
      title: "Delivery Management",
      type: "delivery",
      enabled: false,
      children: [
        { id: 1, name: "Order Baru", push: false, email: false },
        { id: 2, name: "Update Delivery", push: false, email: false },
      ],
    },
  ],
  Buyer: [
    {
      id: 1,
      title: "Purchase Management",
      type: "purchase",
      enabled: false,
      children: [
        { id: 1, name: "Status Pembelian", push: false, email: false },
        { id: 2, name: "Konfirmasi Pembayaran", push: false, email: false },
      ],
    },
  ],
  Muatparts: [
    {
      id: 1,
      title: "Parts Management",
      type: "parts",
      enabled: false,
      children: [
        { id: 1, name: "Stok Update", push: false, email: false },
        { id: 2, name: "Order Parts", push: false, email: false },
      ],
    },
  ],
};

const tabs = ["Umum", "Shipper", "Transporter", "Buyer", "Muatparts"];

function Manajemen_notifikasiWeb() {
  const [activeTab, setActiveTab] = useState("Umum");
  const [searchTerm, setSearchTerm] = useState("");
  const [sections, setSections] = useState(tabsContent[activeTab]);

  // Update sections when tab changes
  useEffect(() => {
    setSections(tabsContent[activeTab]);
  }, [activeTab]);

  // Handle individual toggle
  const handleToggle = (sectionId, childId, field) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        const updatedChildren = section.children.map((child) => {
          if (child.id === childId) {
            return { ...child, [field]: !child[field] };
          }
          return child;
        });

        // Check if all children are active
        const allChildrenActive = updatedChildren.every(
          (child) => child.push && child.email
        );

        return {
          ...section,
          enabled: allChildrenActive,
          children: updatedChildren,
        };
      }
      return section;
    });

    setSections(updatedSections);

    // Log active values
    const activeSection = updatedSections.find(
      (section) => section.id === sectionId
    );
    const activeChild = activeSection?.children.find(
      (child) => child.id === childId
    );
    if (activeSection && activeChild) {
      console.log("Individual Toggle:", {
        section: activeSection.title,
        item: activeChild.name,
        field,
        newValue: !activeChild[field],
        allActiveItems: activeSection.children
          .filter((child) => child.push || child.email)
          .map((child) => ({
            name: child.name,
            push: child.push,
            email: child.email,
          })),
      });
    }
  };

  // Handle parent toggle
  const handleParentToggle = (sectionId) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        const newEnabled = !section.enabled;
        return {
          ...section,
          enabled: newEnabled,
          children: section.children.map((child) => ({
            ...child,
            push: newEnabled,
            email: newEnabled,
          })),
        };
      }
      return section;
    });

    setSections(updatedSections);

    // Log active values
    const activeSection = updatedSections.find(
      (section) => section.id === sectionId
    );
    if (activeSection) {
      console.log("Section Toggle:", {
        section: activeSection.title,
        enabled: activeSection.enabled,
        activeValues: activeSection.children.map((child) => ({
          name: child.name,
          push: child.push,
          email: child.email,
        })),
      });
    }
  };

  // Highlight search text
  const highlightText = (text) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Filter sections based on search
  const filteredSections = sections
    .map((section) => ({
      ...section,
      children: section.children.filter((child) =>
        child.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((section) => section.children.length > 0); // Only show sections with matching children

  return (
    <div className={`${style.main} flex-col mx-auto px-20 py-8 space-y-6`}>
      <h1 className="text-2xl font-bold">Manajemen Notifikasi</h1>

      {/* Search Bar */}
      <div className="relative w-fit">
        <Input
          icon={{ left: "/icons/search.svg" }}
          placeholder="Cari Menu/Modul"
          classname="w-[262px]"
          classInput="pt-[2px]"
          value={searchTerm}
          changeEvent={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm.length > 0 && (
          <X
            size={16}
            className="absolute top-2 right-2 cursor-pointer"
            onClick={() => setSearchTerm("")}
          />
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-8 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-2 px-1 text-sm ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-500 font-bold"
                : "text-[#1b1b1b] font-medium"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {filteredSections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg border">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-sm font-bold">{section.title}</h2>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={section.enabled}
                    onChange={() => handleParentToggle(section.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm font-medium text-[#868686] -mt-[48px]">
                <div></div>
                <div className="text-center">Push Notification</div>
                <div className="text-center">Email</div>
              </div>
            </div>
            {section.children.map((item, idx) => (
              <div
                key={item.id}
                className={`grid grid-cols-3 gap-4 items-center py-3 px-6 bordser-t ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <div className="text-xs font-medium text-[#868686">
                  {highlightText(item.name)}
                </div>
                <div className="flex justify-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.push}
                      onChange={() => handleToggle(section.id, item.id, "push")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex justify-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.email}
                      onChange={() =>
                        handleToggle(section.id, item.id, "email")
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Manajemen_notifikasiWeb;
