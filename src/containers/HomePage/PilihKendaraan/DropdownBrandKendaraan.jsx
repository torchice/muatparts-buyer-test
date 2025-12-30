import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef, useState } from "react";
import SWRHandler from "@/services/useSWRHook";
import { NumberCircle } from ".";
import Dropdown from "@/components/Dropdown/Dropdown";
import DropdownLazyLoad from "@/components/Dropdown/DropdownLazyLoad";
import { useDebounce } from "@/utils/useDebounce";

export default function DropdownBrandKendaraan({
  filter,
  classname,
  onSelect,
  onClickDropdown,
  isError
}) {
  /* IMPROVEMENT FILTER ON PRODUCTS & HOMEPAGE */
  const { t } = useLanguage();
  const { useSWRHook, useSWRMutateHook } = SWRHandler();

  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    keyword: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // const BRAND_OPTIONS_ENDPOINT = `v1/muatparts/garasi/brand?page=${params.page}&limit=${params.limit}&keyword=${params.keyword}`;
  const BRAND_OPTIONS_ENDPOINT = filter.vehicle.value?`v1/muatparts/garasi/brand?vehicleID=${filter.vehicle.value}`:null;

  const { data, isLoading } = useSWRHook(BRAND_OPTIONS_ENDPOINT);
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0525
  const [options, setOptions] = useState([{ name: t("LabeldropdownFilterKendaraanSemuaBrand"), value: "" }]);

  const isFirstRun = useRef(true);

  const handleChange = () => {
    const temp = [{ name: t("LabeldropdownFilterKendaraanSemuaBrand"), value: "" }];
    // const temp = [...options];
    const converted = data.Data.map((rows) => ({
      name: rows.value.toString(),
      value: rows.id.toString(),
    }));
    temp.push(...converted);
    setOptions(temp);
    // temp.length >= data.Pagination.total ? setHasMore(false) : setHasMore(true);
  };

  const handleLoadMore = () => {
    setParams((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const debouncedValue = useDebounce(searchValue, 1000);

  // const handleSearch = (keyword) => {
  //   setOptions([{ name: "Semua Model", value: "" }]);
  //   setParams({
  //     page: 1,
  //     limit: 10,
  //     keyword: keyword,
  //   });
  // };

  const handleClick = () => {
    filter.vehicle.value.length === 0
      ? setErrorMessage("Pilih jenis kendaraan")
      : setErrorMessage("");
  };

  useEffect(() => {
    if (data) {
      handleChange();
    }
  }, [data]);

  // useEffect(() => {
  //   if (isFirstRun.current) {
  //     isFirstRun.current = false;
  //     return;
  //   }
  //   handleSearch(debouncedValue);
  // }, [debouncedValue]);

  useEffect(()=>{
    if(filter.vehicle.value===""){
      setErrorMessage("")
    }
  },[filter])

  return (
    <div className="!w-full col-span-2">
      <Dropdown
        defaultValue={[filter.brand]}
        options={options}
        // options={options}
        placeholder={t("dropdownPilihBrand")}
        classname={`!w-full col-span-2 ${classname}`}
        onSearchValue={(value) => {
          setSearchValue(value);
        }}
        leftIconElement={
          <NumberCircle number={2} active={filter.brand.value} />
        }
        onSelected={(val) => onSelect(val)}
        // isLazyLoad
        // onLoadMore={() => {
        //   handleLoadMore();
        // }}
        // loading={isLoading}
        // isNextAvailable={hasMore}
        // disabled={filter.vehicle.value === ""}
        onClick={() => {
          onClickDropdown() 
        }}
        // isError={filter.vehicle.value === "" && errorMessage}
        isError={isError.field==="brand"}
      />
      {/* {errorMessage && filter.vehicle.value === "" && (
        <p className="text-red-500 text-xs font-medium mt-2">
          Pilih Jenis Kendaraan terlebih dahulu
        </p>
      )} */}
      {isError.field==='brand' && (
        <p className="text-red-500 text-xs font-medium mt-2">
          {isError.message}
        </p>
      )}
    </div>
  );
}
