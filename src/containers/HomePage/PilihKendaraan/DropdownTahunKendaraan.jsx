import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef, useState } from "react";
import SWRHandler from "@/services/useSWRHook";
import { NumberCircle } from ".";
import Dropdown from "@/components/Dropdown/Dropdown";
import DropdownLazyLoad from "@/components/Dropdown/DropdownLazyLoad";
import { useDebounce } from "@/utils/useDebounce";

export default function DropdownTahunKendaraan({
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

  const BRAND_OPTIONS_ENDPOINT = filter.brand.value?`v1/muatparts/garasi/years?brandID=${filter.brand.value}`:null;
  // const BRAND_OPTIONS_ENDPOINT = `v1/muatparts/garasi/years?page=${params.page}&limit=${params.limit}&keyword=${params.keyword}`;

  const { data, isLoading } = useSWRHook(BRAND_OPTIONS_ENDPOINT);

  const [options, setOptions] = useState([{ name: t("LabeldropdownFilterKendaraanSemuaTahun"), value: "" }]);

  const isFirstRun = useRef(true);
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0525
  const handleChange = () => {
    const temp = [{ name: t("LabeldropdownFilterKendaraanSemuaTahun"), value: "" }];
    const converted = data.Data.map((rows) => ({
      name: rows.value.toString(),
      value: rows.id.toString(),
    }));
    temp.push(...converted);
    setOptions(temp);
    // temp.length >= data.Pagination.total ? setHasMore(false) : setHasMore(true);
  };

  // const handleLoadMore = () => {
  //   setParams((prev) => ({ ...prev, page: prev.page + 1 }));
  // };

  // const debouncedValue = useDebounce(searchValue, 1000);

  // const handleSearch = (keyword) => {
  //   setOptions([{ name: "Semua Model", value: "" }]);
  //   setParams({
  //     page: 1,
  //     limit: 10,
  //     keyword: keyword,
  //   });
  // };

  const handleClick = () => {
    filter.brand.value.length === 0
      ? setErrorMessage("Pilih jenis kendaraan")
      : setErrorMessage("");
  };


  useEffect(() => {
    if (data) {
      handleChange();
    }
  }, [data]);

  // useEffect(()=>{
  //   if(filter.brand.value===""){
  //     setErrorMessage("")
  //   }
  // },[filter])


  // useEffect(() => {
  //   if (isFirstRun.current) {
  //     isFirstRun.current = false;
  //     return;
  //   }
  //   handleSearch(debouncedValue);
  // }, [debouncedValue]);
  return (
    <div className="!w-full col-span-2">
      <Dropdown
        defaultValue={[filter.year]}
        options={options}
        placeholder={t("dropdownPilihTahun")}
        classname={`!w-full ${classname}`}
        onSearchValue={(value) => {
          setSearchValue(value);
        }}
        leftIconElement={<NumberCircle number={3} active={filter.year.value} />}
        onSelected={(val) => onSelect(val)}
        // isLazyLoad
        // onLoadMore={() => {
        //   handleLoadMore();
        // }}
        // loading={isLoading}
        // isNextAvailable={hasMore}
        // disabled={filter.brand.value === ""}
        onClick={onClickDropdown}
        // isError={filter.brand.value === "" && errorMessage}
        isError={isError.field==='year'}
      />
      {/* {errorMessage && filter.brand.value === "" && (
        <p className="text-red-500 text-xs font-medium mt-2">
          Pilih Brand terlebih dahulu
        </p>
      )} */}
      {isError.field==='year' && (
        <p className="text-red-500 text-xs font-medium mt-2">
          {isError.message}
        </p>
      )}
    </div>
  );
}
