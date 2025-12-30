import { filterProduct } from "@/store/products/filter";
import style from "../HomePage.module.scss";
import Dropdown from "@/components/Dropdown/Dropdown";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { useEffect, useState } from "react";
import SWRHandler from "@/services/useSWRHook";
import { useLanguage } from "@/context/LanguageContext";
import DropdownJenisKendaraan from "./DropdownJenisKendaraan";
import DropdownBrandKendaraan from "./DropdownBrandKendaraan";
import DropdownTahunKendaraan from "./DropdownTahunKendaraan";
import DropdownModelKendaraan from "./DropdownModelKendaraan";
import DropdownTypeKendaraan from "./DropdownTypeKendaraan";
import { useRouter } from "next/navigation";
import { metaSearchParams } from "@/libs/services";

export const NumberCircle = ({ number, active }) => {
  return (
    <span
      className={`${style.numberCircle} ${
        active ? style.active : style.inactive
      }`}
    >
      {number}
    </span>
  );
};
export default function PilihKendaraanSection({ filter, setVehicle }) {
  // IMPROVEMENT FILTER LANDING PAGE DEPENDENT
  const { t } = useLanguage();
  const router = useRouter();
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0842
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0928
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0929
  const errorMessages = {
    vehicle:t("LabeldropdownFilterKendaraanPilihJenisKendaraanterlebihdahulu"),
    brand: t("LabeldropdownFilterKendaraanPilihBrandterlebihdahulu"),
    year: t("LabeldropdownFilterKendaraanPilihTahunterlebihdahulu"),
    model: t("LabeldropdownFilterKendaraanPilihModelterlebihdahulu"),
    type: t("LabeldropdownFilterKendaraanPilihModelterlebihdahulu"),
  };

  const handleInputChange = (e) => {
    setVehicle({ ...filter, keyword: e.target.value });
  };

  const productFilter = filterProduct();
  function handleCariSparepart() {
    productFilter.setFilterProduct("vehicleID", filter?.["vehicle"]?.["value"]);
    productFilter.setFilterProduct("brandID", filter?.["brand"]?.["value"]);
    productFilter.setFilterProduct("year", filter?.["year"]?.["value"]);
    productFilter.setFilterProduct("modelID", filter?.["model"]?.["value"]);
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0844
    productFilter.setFilterProduct("typeID", filter?.["type"]?.["value"]);
    productFilter.setFilterProduct("q", filter?.["keyword"]);
    const filterProd = productFilter;
    delete filterProd.setFilterProduct;
    delete filterProd.setFilter;
    delete filterProd.setAllFilter;
    router.push(
      `${process.env.NEXT_PUBLIC_ASSET_REVERSE}/products?${metaSearchParams(
        filterProd
      )}`
    );
  }

  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0525
  const handleOnClickBrand = () => {
    if (!filter.vehicle.value) {
      setIsError({
        field: "brand",
        message: t(
          "LabeldropdownFilterKendaraanPilihJenisKendaraanterlebihdahulu"
        ),
      });
    } else {
      setIsError({
        field: "",
        message: "",
      });
    }
  };
  const handleOnClickYear = () => {
    if (!filter.brand.value) {
      setIsError({
        field: "year",
        message: t("LabeldropdownFilterKendaraanPilihBrandterlebihdahulu"),
      });
    } else {
      setIsError({
        field: "",
        message: "",
      });
    }
  };
  const handleOnClickModel = () => {
    if (!filter.year.value) {
      setIsError({
        field: "model",
        message: t("LabeldropdownFilterKendaraanPilihTahunterlebihdahulu"),
      });
    } else {
      setIsError({
        field: "",
        message: "",
      });
    }
  };
  const handleOnClickType = () => {
    if (!filter.model.value) {
      setIsError({
        field: "type",
        message: t("LabeldropdownFilterKendaraanPilihModelterlebihdahulu"),
      });
    } else {
      setIsError({
        field: "",
        message: "",
      });
    }
  };

  const getFirstEmptyFieldBefore = (currentField) => {
    const fieldOrder = ["vehicle", "brand", "year", "model", "type"];

    const currentIndex = fieldOrder.indexOf(currentField);
    if (currentIndex <= 0) return null;

    for (let i = 0; i < currentIndex; i++) {
      const field = fieldOrder[i];
      if (!filter[field].value) {
        return field;
      }
    }

    return null;
  };

  const handleDropdownClick = (field) => {
    const firstEmpty = getFirstEmptyFieldBefore(field);

    if (firstEmpty) {
      setIsError({
        field,
        message: errorMessages[firstEmpty] ||`${firstEmpty} must be filled`,
      });
    } else {
      setIsError({
        field: "",
        message: "",
      });
    }
  };

  const [isError, setIsError] = useState({
    field: "",
    message: "",
  });

  return (
    <div className="grid grid-flow-row-dense grid-cols-4 gap-3">
      {/* IMPROVEMENT FILTER ON PRODUCTS & HOMEPAGE */}
      <DropdownJenisKendaraan
        filter={filter}
        onSelect={(val) => {
          setVehicle((prev) => ({
            ...prev,
            vehicle: val[0],
            brand: { name: "", value: "" },
            year: { name: "", value: "" },
            model: { name: "", value: "" },
            type: { name: "", value: "" },
          }));
        }}
      />
      <DropdownBrandKendaraan
        filter={filter}
        onSelect={(val) => {
          setVehicle((prev) => ({
            ...prev,
            brand: val[0],
            year: { name: "", value: "" },
            model: { name: "", value: "" },
            type: { name: "", value: "" },
          }));
        }}
        isError={isError}
        // onClickDropdown={handleOnClickBrand}
        onClickDropdown={() => {
          handleDropdownClick("brand");
        }}
      />
      <DropdownTahunKendaraan
        filter={filter}
        onSelect={(val) => {
          setVehicle((prev) => ({
            ...prev,
            year: val[0],
            model: { name: "", value: "" },
            type: { name: "", value: "" },
          }));
        }}
        isError={isError}
        // onClickDropdown={handleOnClickYear}
        onClickDropdown={() => {
          handleDropdownClick("year");
        }}
      />
      <DropdownModelKendaraan
        filter={filter}
        onSelect={(val) => {
          setVehicle((prev) => ({
            ...prev,
            model: val[0],
            type: { name: "", value: "" },
          }));
        }}
        isError={isError}
        // onClickDropdown={handleOnClickModel}
        onClickDropdown={() => {
          handleDropdownClick("model");
        }}
      />
      <DropdownTypeKendaraan
        filter={filter}
        onSelect={(val) => {
          setVehicle((prev) => ({ ...prev, type: val[0] }));
        }}
        isError={isError}
        // onClickDropdown={handleOnClickType}
        onClickDropdown={() => {
          handleDropdownClick("type");
        }}
      />
      {/* <Dropdown
        defaultValue={[filter.vehicle]}
        options={vehicleOptions}
        placeholder={t("dropdownPilihJenisKendaraan")}
        classname="!w-full col-span-4"
        onSearchValue={() => {}}
        leftIconElement={
          <NumberCircle number={1} active={filter.vehicle.value} />
        }
        onSelected={(val) => setVehicle({ ...filter, vehicle: val[0] })}
      />
      <Dropdown
        defaultValue={[filter.brand]}
        options={[
          { name: "Semua Brand", value: "" },
          ...brandOptions.map((i) => {
            return {
              name: i.value,
              value: i.id,
            };
          }),
        ]}
        placeholder={t("dropdownPilihBrand")}
        classname="!w-full col-span-2"
        onSearchValue={() => {}}
        leftIconElement={
          <NumberCircle number={2} active={filter.brand.value} />
        }
        onSelected={(val) => setVehicle({ ...filter, brand: val[0] })}
      />
      <Dropdown
        defaultValue={[filter.year]}
        options={[
          { name: "Semua Tahun", value: "" },
          ...yearOptions.map((i) => {
            return {
              name: i.value.toString(),
              value: i.id,
            };
          }),
        ]}
        placeholder={t("dropdownPilihTahun")}
        classname="!w-full col-span-2"
        onSearchValue={() => {}}
        leftIconElement={<NumberCircle number={3} active={filter.year.value} />}
        onSelected={(val) => setVehicle({ ...filter, year: val[0] })}
      />
      <Dropdown
        defaultValue={[filter.model]}
        options={[
          { name: "Semua Model", value: "" },
          ...modelOptions.map((i) => {
            return {
              name: i.value,
              value: i.id,
            };
          }),
        ]}
        placeholder={t("dropdownPilihModel")}
        classname="!w-full col-span-2"
        onSearchValue={() => {}}
        leftIconElement={
          <NumberCircle number={4} active={filter.model.value} />
        }
        onSelected={(val) => setVehicle({ ...filter, model: val[0] })}
      />
      <Dropdown
        defaultValue={[filter.type]}
        options={[
          { name: "Semua Tipe", value: "" },
          ...typeOptions.map((i) => {
            return {
              name: i.value,
              value: i.id,
            };
          }),
        ]}
        placeholder={t("dropdownPilihtipe")}
        classname="!w-full col-span-2"
        onSearchValue={() => {}}
        leftIconElement={<NumberCircle number={5} active={filter.type.value} />}
        onSelected={(val) => setVehicle({ ...filter, type: val[0] })}
      /> */}
      <Input
        placeholder={t("dropdownPilihKeywords")}
        classname="!w-full col-span-4"
        icon={{
          left: (
            <NumberCircle number={6} active={filter.keyword ? true : false} />
          ),
        }}
        value={filter.keyword}
        changeEvent={handleInputChange}
      />
      <Button
        onClick={handleCariSparepart}
        Class="!min-w-full col-span-4 !font-semibold"
      >
        {t("dropdownCariSparePart")}
      </Button>
    </div>
  );
}
