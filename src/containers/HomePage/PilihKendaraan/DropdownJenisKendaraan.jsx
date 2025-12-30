import { filterProduct } from "@/store/products/filter";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import SWRHandler from "@/services/useSWRHook";
import { NumberCircle } from ".";
import Dropdown from "@/components/Dropdown/Dropdown";

export default function DropdownJenisKendaraan({ filter, onSelect }) {
  /* IMPROVEMENT FILTER ON PRODUCTS & HOMEPAGE */
  const { t } = useLanguage();
  const { useSWRHook, useSWRMutateHook } = SWRHandler();

  const VEHICLE_OPTIONS_ENDPOINT = "v1/muatparts/garasi/vehicle";

  const { data } = useSWRHook(VEHICLE_OPTIONS_ENDPOINT);

    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0525
  const [options, setOptions] = useState([
    { name: t("LabeldropdownFilterKendaraanSemuaJenisKendaraan"), value: "" },
  ]);

  const handleVehicleChange = () => {
    const temp = [{ name: t("LabeldropdownFilterKendaraanSemuaJenisKendaraan"), value: "" }];
    const converted = data.Data.map((rows) => ({
      name: rows.value.toString(),
      value: rows.id.toString(),
    }));
    temp.push(...converted);
    setOptions(temp);
  };

  useEffect(() => {
    if (data) {
      handleVehicleChange();
    }
  }, [data]);
  return (
    <div className="!w-full col-span-4">
      <Dropdown
        defaultValue={[filter.vehicle]}
        options={options}
        placeholder={t("dropdownPilihJenisKendaraan")}
        classname="!w-full"
        onSearchValue={() => {}}
        leftIconElement={
          <NumberCircle number={1} active={filter.vehicle.value} />
        }
        onSelected={(val) => onSelect(val)}
      />
    </div>
  );
}
