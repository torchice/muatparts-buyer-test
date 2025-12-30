import { useState, useEffect, useCallback, use } from "react";
import SWRHandler from "@/services/useSWRHook";
import Input from "../Input/Input";
import ModalComponent from "../Modals/ModalComponent";
import Image from "next/image";
import TextArea from "../TextArea/TextArea";
import Dropdown from "../Dropdown/Dropdown";
import Checkbox from "../Checkbox/Checkbox";
import Button from "../Button/Button";
import Modal from "../Modals/modal";
import InputSearch from "./InputSearch";
import debounce from "@/libs/debounce";
import {
  useLocationStore,
  useDetailLocationStore,
} from "@/store/locationManagement";
import IconComponent from "../IconComponent/IconComponent";

const InputSearchLocation = ({ locationRef, onSelectLocation, errors }) => {
  const SAVED_LOCATIONS_ENDPOINT = "v1/muatparts/profile/location";

  const AUTOCOMPLETE_ENDPOINT = process.env.NEXT_PUBLIC_GLOBAL_API + "v1/autocompleteStreet";
  const DISTRICT_ENDPOINT = "v1/district_by_token";
  const MANUALSEARCH_ENDPOINT = "v1/autocompleteStreetLocal";

  const POSTALCODE_BY_DISTRICT_ENDPOINT = "v1/postalcode_by_district";

  const { useSWRHook, useSWRMutateHook } = SWRHandler();

  const {
    setAddressData,
    address,
    setAddress,
    location,
    setLocation,
    district,
    setDistrict,
    city,
    setCity,
    province,
    setProvince,
    postalCode,
    setPostalCode,
    coordinates,
    setCoordinates,

    // options
    postalCodeList,
    setPostalCodeList,
    kecamatanList,
    setKecamatanList,

    // reset
    resetAllStates,
  } = useLocationStore();

  const {
    isDetailLocationOpen,
    isDetailMode,
    openDetailLocation,
    closeDetailLocation,
    detailName,
    detailAddress,
    detailLocation,
    detailDistrict,
    detailCity,
    detailProvince,
    detailPostalCode,
    detailPicName,
    detailPicPhone,
    detailUserId,
    detailIsMainAddess,
    detailCoordinates,
    detailKecamatanList,
    detailPostalCodeList,

    // set
    setDetailName,
    setDetailAddress,
    setDetailLocation,
    setDetailDistrict,
    setDetailCity,
    setDetailProvince,
    setDetailPostalCode,
    setDetailPicName,
    setDetailPicPhone,
    setDetailUserId,
    setDetailIsMainAddess,
    setDetailCoordinates,
    setDetailKecamatanList,
    setDetailPostalCodeList,
  } = useDetailLocationStore();

  const [searchResults, setSearchResults] = useState([]);
  const [manualSearchResults, setManualSearchResults] = useState([]);

  const [oldAddress, setOldAddress] = useState("");
  const [isOpenLocationMenu, setIsOpenLocationMenu] = useState(false);
  const [isModalSavedLocation, setIsModalSavedLocation] = useState(false);
  const [isOpenConfirmChangeLocation, setIsOpenConfirmChangeLocation] =
    useState(false);
  const [locationTes, setLocationTes] = useState("");

  const [isOpenAddManual, setIsOpenAddManual] = useState(false);
  const [selectedManual, setSelectedManual] = useState({});

  const { data: autoCompleteData, trigger: autoCompleteTrigger } =
    useSWRMutateHook(AUTOCOMPLETE_ENDPOINT);

  const {
    data: districtRes,
    trigger: districtTrigger,
    error: districtDataError,
  } = useSWRMutateHook(DISTRICT_ENDPOINT);

  const [savedLocationId, setSavedLocationId] = useState(null);

  const { data: managedLocations } = useSWRHook(SAVED_LOCATIONS_ENDPOINT);

  const { data: resSubmitData, trigger: submitTrigger } = useSWRMutateHook(
    SAVED_LOCATIONS_ENDPOINT,
    savedLocationId ? "PUT" : "POST"
  );

  const { data: resSavedLocation } = useSWRHook(
    savedLocationId ? SAVED_LOCATIONS_ENDPOINT + "/" + savedLocationId : null
  );

  const { data: manualRes, trigger: manualTrigger } = useSWRMutateHook(
    MANUALSEARCH_ENDPOINT
  );

  const handleInputFocus = () => {
    setIsOpenLocationMenu(true);
    if (!location.title && address) {
      setLocation({
        id: null,
        title: address,
      });
      setOldAddress(address);
      setLocationTes(address);
      fetchAutoCompleteData(address);
    } else if (location.id && oldAddress !== address) {
      setIsOpenLocationMenu(false);
      setIsOpenConfirmChangeLocation(true);
    }
  };

  const normalizeDistrictData = (data) => {
    try {
      if (!data?.Districts?.[0]) {
        throw new Error("Invalid district data structure");
      }

      const district = data.Districts[0];
      const location = data.CompleteLocation;

      const newDistrict = {
        name: district.District,
        value: district.DistrictID,
      };

      const newCity = {
        name: location.city,
        id: location.cityid,
      };

      const newProvince = {
        name: location.province,
        id: location.provinceid,
      };

      const newKecamatanList = district.DistrictList.map((item) => ({
        value: item.DistrictID,
        name: item.District,
      }));

      const newPostalCodeList = district.PostalCodes.map((item) => ({
        value: item.ID,
        name: item.PostalCode,
      }));

      const findPostalCode = district.PostalCodes.find(
        (item) => item.PostalCode === location.postal
      );

      if (!findPostalCode) {
        throw new Error("Postal code not found");
      }

      const newPostalCode = {
        name: findPostalCode.Description,
        value: findPostalCode.ID,
      };

      const newCoordinates = {
        lat: data.Lat,
        long: data.Long,
      };

      return {
        district: newDistrict,
        city: newCity,
        province: newProvince,
        kecamatanList: newKecamatanList,
        postalCodeList: newPostalCodeList,
        postalCode: newPostalCode,
        coordinates: newCoordinates,
      };
    } catch (error) {
      throw new Error(`Failed to normalize district data: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocationTes(value);
    handleDebouncedChange(value);
  };

  const handleDebouncedChange = useCallback(
    debounce((value) => {
      fetchAutoCompleteData(value);
    }, 500),
    []
  );

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Current Location:", latitude, longitude);
          setIsOpenLocationMenu(false);
          onSelectLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleOnClickLocation = async (result) => {
    setLocation({
      id: result.ID,
      title: result.Title,
    });

    fetchDistrictData(result.ID);

    setLocationTes(result.Title);
    setIsOpenLocationMenu(false);
  };

  const handleOnClickManagedLocation = async (item) => {
    setIsOpenLocationMenu(false);
    setIsModalSavedLocation(false);

    setLocation({
      id: item.PlaceID,
      title: item.Address,
    });
    setLocationTes(item.Address);
    setOldAddress(item.AddressDetail);
    setAddress(item.AddressDetail);
    setDistrict({
      name: item.District,
      value: item.DistrictID,
    });
    setCity({
      name: item.City,
      id: item.CityID,
    });
    setProvince({
      name: item.Province,
      id: item.ProvinceID,
    });
    setPostalCode({
      name: item.PostalCode,
      value: item.PostalCode,
    });
    setCoordinates({
      lat: item.Latitude,
      long: item.Longitude,
    });

    setAddressData();
  };

  const handleOnClickBookmark = async (result, mode) => {
    setIsOpenLocationMenu(false);
    setIsModalSavedLocation(false);

    if (mode === "add") {
      fetchDistrictData(result.ID);
    } else if (mode === "edit") {
      setSavedLocationId(result.ID);
    }

    openDetailLocation(mode);
  };

  const fetchAutoCompleteData = async (value) => {
    if (!value) {
      setSearchResults([]);
      return;
    }

    const formUrl = new URLSearchParams();
    formUrl.append("phrase", value);

    autoCompleteTrigger(formUrl);
  };

  const fetchDistrictData = async (value) => {
    if (!value) return;

    const formUrl = new URLSearchParams();
    formUrl.append("placeId", value);

    districtTrigger(formUrl);
  };

  const fetchManualSearchData = async (value) => {
    if (!value) return;

    const formUrl = new URLSearchParams();
    formUrl.append("phrase", value);

    manualTrigger(formUrl);
  };

  const handleManualSearch = debounce((e) => {
    const value = e.target.value;

    if (value.length > 2) {
      fetchManualSearchData(value);
    }
  }, 500);

  const handleAutofillFormManual = () => {
    setAddress(selectedManual.Description);
    setOldAddress(selectedManual.Description);
    setDistrict({
      name: selectedManual.DistrictName,
      value: selectedManual.DistrictID,
    });
    setCity({
      name: selectedManual.CityName,
      id: selectedManual.CityID,
    });
    setProvince({
      name: selectedManual.ProvinceName,
      id: selectedManual.ProvinceID,
    });
    setPostalCode({
      name: selectedManual.PostalCode,
      value: null,
    });

    setSelectedManual({});
    setIsOpenAddManual(false);
  };

  const handleSubmitLocation = () => {
    const body = {
      param: {
        Name: detailName,
        Address: detailLocation.title,
        AddressDetail: detailAddress,
        Latitude: detailCoordinates.lat,
        Longitude: detailCoordinates.long,
        Province: detailProvince.name,
        ProvinceID: detailProvince.id,
        City: detailCity.name,
        CityID: detailCity.id,
        District: detailDistrict.name,
        DistrictID: detailDistrict.value,
        PostalCode: detailPostalCode.name,
        PicName: detailPicName,
        PicNoTelp: detailPicPhone,
        UsersID: 2953,
        PlaceID: detailLocation.id,
        IsMainAddress: detailIsMainAddess,
        ...(savedLocationId && { ID: savedLocationId }),
      },
    };

    closeDetailLocation();
    submitTrigger(body);
  };

  useEffect(() => {
    if (!autoCompleteData) return;

    const { data, status } = autoCompleteData;

    if (status === 200) {
      setSearchResults(data.splice(0, 3));
    }
  }, [autoCompleteData]);

  useEffect(() => {
    if (!districtRes) return;

    const { data, status } = districtRes;

    if (status === 200) {
      const item = normalizeDistrictData(data.Data);

      setDistrict(item.district);
      setCity(item.city);
      setProvince(item.province);
      setKecamatanList(item.kecamatanList);
      setPostalCodeList(item.postalCodeList);
      setPostalCode(item.postalCode);
      setCoordinates(item.coordinates);

      setAddressData();
    }

    if (status === 204) {
      setIsOpenAddManual(true);
    }
  }, [districtRes]);

  useEffect(() => {
    if (districtDataError) {
      console.log("Error fetching district data:", districtDataError);
    }
  }, [districtDataError]);

  // handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsOpenLocationMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setLocationTes(location.title);
    setOldAddress(address);

    if (!location.id && location.title) {
      fetchAutoCompleteData(location.title);
    }
  }, [location]);

  useEffect(() => {
    if (!resSubmitData) return;
    if (resSubmitData?.status === 200) {
      setSavedLocationId(null);
    }
  }, [resSubmitData]);

  useEffect(() => {
    if (resSavedLocation) {
      const { Data, Message } = resSavedLocation;

      if (Message.Code === 200) {
        setDetailName(Data.Name);
        setDetailAddress(Data.AddressDetail);
        setDetailLocation({
          id: Data.PlaceID,
          title: Data.Address,
        });
        setDetailDistrict({
          name: Data.District,
          value: Data.DistrictID,
        });
        setDetailCity({
          name: Data.City,
          id: Data.CityID,
        });
        setDetailProvince({
          name: Data.Province,
          id: Data.ProvinceID,
        });
        setDetailPostalCode({
          name: Data.PostalCode,
          value: Data.PostalCode,
        });
        setDetailCoordinates({
          lat: Data.Latitude,
          long: Data.Longitude,
        });
        setDetailPicName(Data.PicName);
        setDetailPicPhone(Data.PicNoTelp);
        setDetailUserId(Data.UsersID);
        setDetailIsMainAddess(Data.IsMainAddress);
      }
    }
  }, [resSavedLocation]);

  useEffect(() => {
    if (!manualRes) return;

    const { data, status } = manualRes;

    if (status === 200) {
      const { Data } = data.Data.data;

      setManualSearchResults(Data);
    }
  }, [manualRes]);

  return (
    <>
      <Input
        placeholder="Masukkan Lokasi Toko"
        value={locationTes}
        changeEvent={handleInputChange}
        focusEvent={handleInputFocus}
        status={errors?.location ? "error" : ""}
        supportiveText={{
          title: errors?.location || "",
        }}
      />

      <div className="absolute w-full flex">
        {isOpenLocationMenu && (
          <div className="flex z-10 flex-col items-start mt-1 pt-3 pb-5 w-full bg-white rounded-md border border-blue-600 border-solid">
            <div
              className="flex mx-5 gap-3 items-center max-w-full text-xs font-medium text-blue-600 cursor-pointer"
              onClick={handleGetCurrentLocation}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/3795d733eb3bad624b2a2982f5874f44be0c8234b8b171d3ddf0475ccfc1ea24?placeholderIfAbsent=true&apiKey=edf1b856b0f745739c22ab52d9ed84da"
                alt=""
                className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square fill-blue-600"
              />
              <div className="self-stretch my-auto h-2.5">Pilih Lokasi</div>
            </div>

            <div className="mt-3 w-full border border-solid bg-stone-300 border-stone-300 min-h-[1px]" />

            <div className="flex flex-col mt-3 px-5 w-full">
              <div className="text-xs font-medium leading-tight text-neutral-500">
                Hasil Pencarian
              </div>

              {searchResults?.map((result) => (
                <div
                  key={result.ID}
                  className="flex gap-3 justify-between items-start w-full mt-3"
                >
                  <button
                    className="flex gap-3 text-start"
                    onClick={() => handleOnClickLocation(result)}
                  >
                    <IconComponent
                      src={
                        process.env.NEXT_PUBLIC_ASSET_REVERSE +
                        "icons/location.svg"
                      }
                      alt="location"
                      size={20}
                    />
                    <div className="flex-1 shrink gap-2.5 self-stretch">
                      {result.Title}
                    </div>
                  </button>
                  <IconComponent
                    src={
                      process.env.NEXT_PUBLIC_ASSET_REVERSE +
                      "icons/bookmark-outline.svg"
                    }
                    alt="bookmark"
                    onclick={() => handleOnClickBookmark(result, "add")}
                  />
                </div>
              ))}

              <div className="flex flex-col justify-center px-3 py-2 mt-3 w-full text-xs font-semibold text-blue-600 bg-white rounded border border-blue-600 border-solid">
                <div className="flex gap-2 items-center w-full">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/18bbc0431f0ef562c9b534b68ee07c2e9210b58ffdb55a266b940f8e172fc591?placeholderIfAbsent=true&apiKey=edf1b856b0f745739c22ab52d9ed84da"
                    alt=""
                    className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
                  />
                  <div className="flex-1 shrink self-stretch my-auto basis-0">
                    Input Lokasi yang terdekat dengan Anda
                  </div>
                </div>
              </div>

              {managedLocations?.Data.length > 0 && (
                <div className="flex-1 shrink gap-3 mt-3 w-full text-xs font-medium leading-tight text-neutral-500">
                  Manajemen Lokasi
                </div>
              )}

              {managedLocations?.Data.map((item) => (
                <div className="flex flex-col mt-5 w-full text-xs">
                  <div className="flex gap-3 items-start w-full text-black">
                    <IconComponent
                      src={
                        process.env.NEXT_PUBLIC_ASSET_REVERSE +
                        "icons/map-icon.svg"
                      }
                      alt="map"
                      width={20}
                      height={20}
                    />
                    <div
                      className="flex flex-1 shrink gap-2 items-start basis-0 min-w-[240px] cursor-pointer"
                      onClick={() => handleOnClickManagedLocation(item)}
                    >
                      <div className="flex-1 shrink my-auto text-xs font-bold leading-3 text-black basis-0 text-ellipsis ">
                        <div className="line-clamp-1">{item.Address}</div>
                        <div className="flex-1 shrink gap-2.5 mt-2 self-stretch w-full font-medium leading-tight text-ellipsis text-neutral-500">
                          {item.AddressDetail}
                        </div>
                      </div>
                      {item.IsMainAddress === 1 && (
                        <div className="gap-1 p-1 text-xs font-semibold leading-tight text-white whitespace-nowrap bg-primary-700 rounded">
                          Utama
                        </div>
                      )}
                    </div>
                    <IconComponent
                      src={
                        process.env.NEXT_PUBLIC_ASSET_REVERSE + "icons/edit.svg"
                      }
                      alt="edit"
                      width={20}
                      height={20}
                      onclick={() =>
                        handleOnClickBookmark(
                          {
                            ID: item.ID,
                            Title: item.Address,
                          },
                          "edit"
                        )
                      }
                    />
                  </div>
                </div>
              ))}

              <div className="mt-3 text-xs font-medium leading-tight flex justify-end text-blue-600">
                {managedLocations?.Data.length < 1 && (
                  <div className="flex-1 shrink gap-3 w-full text-xs font-medium leading-tight text-neutral-500">
                    Manajemen Lokasi
                  </div>
                )}
                <button
                  onClick={() => {
                    setIsModalSavedLocation(true);
                    setIsOpenLocationMenu(false);
                  }}
                >
                  Lihat Manajemen Lokasi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ModalComponent
        isOpen={isModalSavedLocation}
        preventAreaClose
        setClose={() => setIsModalSavedLocation(false)}
        classnameContent="!w-[425px]"
        hideHeader
      >
        <div className="">
          <div className="text-base font-bold p-4">Manajemen Lokasi</div>

          <div className="px-4 pb-5">
            <Input
              placeholder="Cari Lokasi yang disimpan"
              icon={{
                left: (
                  <IconComponent
                    src={
                      process.env.NEXT_PUBLIC_ASSET_REVERSE +
                      "icons/location.svg"
                    }
                    width={20}
                    height={20}
                  />
                ),
              }}
            />
          </div>

          <div className="max-h-96 overflow-auto space-y-4 p-4 pt-0">
            {managedLocations?.Data.map((item) => (
              <div className="flex flex-col w-full text-xs">
                <div className="flex gap-3 items-start w-full font-bold leading-3 text-black">
                  <IconComponent
                    src={
                      process.env.NEXT_PUBLIC_ASSET_REVERSE +
                      "icons/map-icon.svg"
                    }
                    alt="map"
                    width={20}
                    height={20}
                  />
                  <div
                    className="flex flex-1 shrink gap-2 items-start basis-0 min-w-[240px] cursor-pointer"
                    onClick={() => handleOnClickManagedLocation(item)}
                  >
                    <div className="flex-1 shrink my-auto text-xs font-bold leading-3 text-black basis-0 text-ellipsis ">
                      <div className="line-clamp-1">{item.Address}</div>
                      <div className="flex-1 shrink gap-2.5 mt-2 self-stretch w-full font-medium leading-tight text-ellipsis text-neutral-500">
                        {item.AddressDetail}
                      </div>
                    </div>
                    {item.IsMainAddress === 1 && (
                      <div className="gap-1 p-1 text-xs font-semibold leading-tight text-white whitespace-nowrap bg-primary-700 rounded">
                        Utama
                      </div>
                    )}
                  </div>
                  <IconComponent
                    src={
                      process.env.NEXT_PUBLIC_ASSET_REVERSE + "icons/edit.svg"
                    }
                    alt="edit"
                    width={20}
                    height={20}
                    onclick={() =>
                      handleOnClickBookmark(
                        {
                          ID: item.ID,
                          Title: item.Address,
                        },
                        "edit"
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModalComponent>

      <ModalComponent
        isOpen={isOpenAddManual}
        showButtonClose={false}
        full={true}
        hideHeader
        preventAreaClose={true}
        classname="w-[472px] overflow-visible"
      >
        <div className="p-6 relative space-y-6">
          <div className="text-center font-bold text-sm">
            Isi Kelurahan/Kecamatan/Kode Pos
          </div>

          <div className="w-full border border-solid bg-stone-300 border-stone-300 min-h-[1px]" />

          <InputSearch
            name="search"
            placeholder="Cari Kelurahan/Kecamatan/Kode Pos"
            options={manualSearchResults}
            changeEvent={handleManualSearch}
            onSelectValue={(val) => setSelectedManual(val)}
            icon={{ left: "/icons/search.svg" }}
            getOptionLabel={(option) => option.Description}
          />

          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={() => setIsOpenAddManual(false)}
              color="primary_secondary"
            >
              Batalkan
            </Button>
            <Button onClick={() => handleAutofillFormManual()}>Simpan</Button>
          </div>
        </div>
      </ModalComponent>

      <ModalComponent
        isOpen={isDetailLocationOpen}
        preventAreaClose
        setClose={() => closeDetailLocation()}
        classnameContent="w-[400px]"
        hideHeader
      >
        <div className="">
          <div className="text-base font-bold p-4">Detail Alamat</div>

          <div className="max-h-96 overflow-auto space-y-3 p-4 pt-0">
            <div className="">
              <div className="text-[10px] text-neutral-600 font-semibold">
                Label Alamat*
              </div>
              <Input
                placeholder="Masukkan Alamat"
                value={detailName}
                changeEvent={(e) => {
                  setDetailName(e.target.value);
                }}
              />
            </div>
            <div className="">
              <div className="text-[10px] text-neutral-600 font-semibold">
                Lokasi*
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src={
                    process.env.NEXT_PUBLIC_ASSET_REVERSE + "/icons/marker.svg"
                  }
                  width={30}
                  height={30}
                  alt="marker"
                />
                <div className="font-semibold">{detailLocation.title}</div>
              </div>
            </div>
            <div className="">
              <div className="text-[10px] text-neutral-600 font-semibold">
                Alamat*
              </div>
              <TextArea
                placeholder="Masukkan alamat lengkap dengan detail.Contoh : Nama Jalan (bila tidak ditemukan), Gedung, No. Rumah/Patokan, Blok/Unit"
                maxLength={60}
                resize="none"
                hasCharCount={false}
                value={detailAddress}
                changeEvent={(e) => setDetailAddress(e.target.value)}
              />
            </div>
            <div className="">
              <div className="text-[10px] text-neutral-600 font-semibold">
                Kecamatan
              </div>
              <div className="font-semibold">{detailDistrict.name}</div>
            </div>
            <div className="">
              <div className="text-[10px] text-neutral-600 font-semibold">
                Kota
              </div>
              <div className="font-semibold">{detailCity.name}</div>
            </div>
            <div className="">
              <div className="text-[10px] text-neutral-600 font-semibold">
                Provinsi
              </div>
              <div className="font-semibold">{detailProvince.name}</div>
            </div>
            <div className="">
              <div className="text-[10px] text-neutral-600 font-semibold">
                Kode Pos*
              </div>
              <Dropdown
                options={detailPostalCodeList}
                onSearchValue
                placeholder="Pilih Kode Pos"
                searchPlaceholder="Cari Kode Pos"
                defaultValue={[detailPostalCode]}
                onSelected={(val) =>
                  setDetailPostalCode({
                    name: val[0].name,
                    value: val[0].value,
                  })
                }
                classname="!w-full"
              />
            </div>
            <div className="">
              <div className="text-[10px] text-neutral-600 font-semibold">
                Nama PIC*
              </div>
              <Input
                placeholder="Nama PIC Lokasi"
                value={detailPicName}
                changeEvent={(e) => {
                  setDetailPicName(e.target.value);
                }}
              />
            </div>
            <div className="">
              <div className="text-[10px] text-neutral-600 font-semibold">
                No. HP PIC*
              </div>
              <Input
                placeholder="Contoh : 08xxxxxxxxxx"
                value={detailPicPhone}
                changeEvent={(e) => setDetailPicPhone(e.target.value)}
              />
            </div>
            <Checkbox
              label="Jadikan alamat sebagai alamat utama"
              checked={detailIsMainAddess === 1}
              onChange={(e) => {
                setDetailIsMainAddess(e.checked ? 1 : 0);
              }}
            />

            <div className="flex gap-3 justify-center pt-[10px]">
              <Button
                color="primary_secondary"
                onClick={() => closeDetailLocation()}
              >
                Batalkan
              </Button>
              <Button
                onClick={() => {
                  handleSubmitLocation();
                }}
              >
                Simpan
              </Button>
            </div>
          </div>
        </div>
      </ModalComponent>

      <Modal
        isOpen={isOpenConfirmChangeLocation}
        setIsOpen={setIsOpenConfirmChangeLocation}
        closeArea={false}
        closeBtn={true}
      >
        <div className="space-y-6">
          <div className="text-center font-medium text-sm">
            Apakah kamu yakin ingin mengganti lokasi?
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button
              color="primary_secondary"
              onClick={() => {
                setIsOpenConfirmChangeLocation(false);
                setAddress(oldAddress);
              }}
            >
              Tidak
            </Button>
            <Button
              onClick={() => {
                setIsOpenConfirmChangeLocation(false);
                setLocationTes(address);
                setOldAddress(address);
                resetAllStates();
              }}
            >
              Ya
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default InputSearchLocation;
