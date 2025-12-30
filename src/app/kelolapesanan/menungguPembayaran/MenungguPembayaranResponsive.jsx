import FilterkelolaPesanan from "../screens/FilterkelolaPesanan";
import DetailKelolaPesanan from "../screens/DetailKelolaPesanan";
import { useHeader } from "@/common/ResponsiveContext";
import { useEffect, useState } from "react";
import TrackOrderMobile from "@/containers/TrackOrderMobile/TrackOrderMobile";
import Checkbox from "@/components/Checkbox/Checkbox";
import IconComponent from "@/components/IconComponent/IconComponent";
import CardManageOrderMobile from "@/components/CardManageOrderMobile/CardManageOrderMobile";
import ModalComponent from "@/components/Modals/ModalComponent";
import RadioButton from "@/components/Radio/RadioButton";
import Button from "@/components/Button/Button";
import style from "./MenungguPembayaran.module.scss";
function MenungguPembayaranResponsive() {
  const {
    setAppBar,
    clearScreen, // reset appBar
    setScreen, // set screen
    screen, // get screen,
    setSearch, // tambahkan payload seperti ini {placeholder:'Pencarian',value:'',type:'text'}
  } = useHeader();

  const [isAturMassal, setAturMassal] = useState(false);
  const [isShowSort, setShowSort] = useState(false);
  const [sortActive, setSortActive] = useState("");
  function handleTerapkan() {
    setSortActive("");
    setShowSort(false);
  }
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!screen) {
      setAppBar({
        appBarType: "header_search",
        renderActionButton: (
          <span
            className="flex flex-col gap-[2px] items-center ml-2 select-none z-10"
            onClick={() => setShowSort(true)}
          >
            <IconComponent
              src={"/icons/sorting.svg"}
              classname={"icon-white"}
              width={24}
              height={24}
            />
            <span className="text-[10px] text-neutral-50 font-semibold">
              Urutkan
            </span>
          </span>
        ),
      });
      setSearch({
        placeholder: "Cari No.Invoice/Nama produk",
      });
    }
    if (screen === "detailPesanan") {
      setAppBar({
        appBarType: "header_title",
        title: "Detail Pesanan",
        renderActionButton: (
          <span
            className="flex flex-col gap-[2px] items-center ml-2 select-none z-10"
            onClick={() => console.log("download")}
          >
            <IconComponent
              src={"/icons/download.svg"}
              classname={"icon-white"}
              width={24}
              height={24}
            />
            <span className="text-[10px] text-neutral-50 font-semibold">
              Unduh
            </span>
          </span>
        ),
        onBack: () => clearScreen(),
      });
    }
    if (screen === "filter") {
      setAppBar({
        appBarType: "header_title_modal_secondary",
        title: "Filter",
        onBack: () => clearScreen(),
        componentBackType: "close",
      });
    }
    if (screen === "lacak_pesanan") {
      setAppBar({
        appBarType: "header_title",
        title: "Lacak Pesanan",
        onBack: () => setScreen("detailPesanan"),
      });
    }
  }, [screen]);

  function handleBatal() {
    clearScreen();
  }
  function handleSimpan(val) {
    console.log(val);
    // hit api
  }
  if (screen === "filter")
    return (
      <FilterkelolaPesanan onBatal={handleBatal} onSimpan={handleSimpan} />
    );
  if (screen === "detailPesanan") return <DetailKelolaPesanan />;
  if (screen === "lacak_pesanan")
    return (
      <TrackOrderMobile
        data={[
          {
            title: "Pengembalian Dana Berhasil",
            date: "26 Jan 2024 11:51 WIB",
            desc: "(Pengembalian Dana berhasil pada Date_pengembalian_dana)",
          },
        ]}
      />
    );
  // main screen
  return (
    <div className={`${style.main} flex flex-col gap-2 bg-neutral-200`}>
      <div className="p-4 flex justify-between items-center w-full bg-neutral-50 text-neutral-900">
        {isAturMassal ? (
          <Checkbox label="Pilih Semua" />
        ) : (
          <div
            className="bg-neutral-200 rounded-3xl py-2 px-3 gap-[10px] select-none flex items-center h-[30px]"
            onClick={() => setScreen("filter")}
          >
            <span className="medium-sm">Filter</span>
            <IconComponent src={"/icons/filter.svg"} width={14} height={14} />
          </div>
        )}
        <span
          className="text-primary-700 semi-sm select-none"
          onClick={() => setAturMassal(!isAturMassal)}
        >
          {isAturMassal ? "Batalkan" : "Atur Massal"}
        </span>
      </div>
      <ul className="list-none ">
        <li>
          <CardManageOrderMobile
            withCheckBox={isAturMassal}
            onClick={() => setScreen("detailPesanan")}
          />
        </li>
      </ul>
    </div>
  );
}

export default MenungguPembayaranResponsive;
