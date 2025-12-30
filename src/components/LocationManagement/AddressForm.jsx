import { useState, useEffect, useRef, useCallback } from "react";
import Dropdown from "../Dropdown/Dropdown";
import TextArea from "../TextArea/TextArea";
import Input from "../Input/Input";
import SWRHandler from "@/services/useSWRHook";
import MiniMap from "@/containers/MapContainer/MiniMap";
import MapContainer from "@/containers/MapContainer/MapContainer";
import ModalComponent from "../Modals/ModalComponent";
import IconComponent from "../IconComponent/IconComponent";
import Image from "next/image";
import Button from "../Button/Button";
import debounce from "@/libs/debounce";
import InputSearchLocation from "./InputSearchLocation";
import { useLocationStore } from "@/store/locationManagement";

const AddressForm = ({ errors, defaultValue }) => {
  // Start State Management
  const {
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
  } = useLocationStore();

  const swrHandler = SWRHandler();
  const locationRef = useRef(null);

  const [isOpenMap, setOpenMap] = useState(false);

  const [getSearchLokasi, setSearchLokasi] = useState("");

  useEffect(() => {
    console.log(defaultValue, "defaultValue");
    if (defaultValue) {
      setAddress(defaultValue.address);
      setLocation({
        id: "",
        title: defaultValue.location.title,
      });
      setCity({
        name: defaultValue.city.name,
        id: defaultValue.city.value,
      });
      setProvince({
        name: defaultValue.province.name,
        id: defaultValue.province.value,
      });
      const newKecamatanList = defaultValue?.listDistrict?.map((i) => ({
        value: i.DistrictID,
        name: i.District,
      }));
      setKecamatanList(newKecamatanList);
      setDistrict({
        name: defaultValue.district.name,
        value: defaultValue.district.value,
      });
      const newPostalCodeList = defaultValue?.listPostalCode?.map((i) => ({
        value: i.ID,
        name: i.PostalCode,
      }));
      setPostalCodeList(newPostalCodeList);
      setPostalCode({
        name: defaultValue.postalCode.name,
        value: defaultValue.postalCode.name,
      });
      setCoordinates({
        lat: Number(defaultValue?.coordinates?.lat),
        long: Number(defaultValue?.coordinates?.long),
      });
    }
  }, []);

  // End State Management

  // Start Handlers

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
  };

  // End Handlers

  return (
    <div className="space-y-4 my-4 mx-12 text-xs">
      <div className="flex items-baseline">
        <label className="w-1/3 text-neutral-600 font-medium">Alamat*</label>
        <div className="w-2/3">
          <TextArea
            status={`${errors?.address && "error"}`}
            supportiveText={{
              title: `${errors?.address ? errors?.address : ""}`,
            }}
            maxLength={60}
            resize="none"
            placeholder="Masukkan alamat lengkap dengan detail. Contoh : Nama Jalan (bila tidak ditemukan), Gedung, No. Rumah/Patokan, Blok/Unit"
            value={address}
            changeEvent={handleAddressChange}
          />
        </div>
      </div>

      <div className="flex items-baseline">
        <label className="w-1/3 text-neutral-600 font-medium">Lokasi*</label>
        <div className="w-2/3 relative" ref={locationRef}>
          <InputSearchLocation
            errors={errors}
            onSelectLocation={(val) => {
              console.log(val, "hello");
            }}
            locationRef={locationRef}
          />
        </div>
      </div>

      <div className="flex items-baseline">
        <label className="w-1/3 text-neutral-600 font-medium">Kecamatan*</label>
        <div className="w-2/3">
          <Dropdown
            options={kecamatanList}
            onSearchValue
            placeholder="Pilih Kecamatan"
            searchPlaceholder="Cari Kecamatan"
            defaultValue={[district]}
            onSelected={(val) =>
              setDistrict({
                name: val[0].name,
                value: val[0].value,
              })
            }
            classname={`${errors?.districtID ? "!border-error-500" : ""}`}
          />
          {errors?.districtID ? (
            <span className="font-medium text-error-400 text-xs block mt-2">
              {errors?.districtID}
            </span>
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="flex items-baseline">
        <label className="w-1/3 text-neutral-600 font-medium">Kota</label>
        <div className="w-2/3 text-neutral-900 font-medium">
          {city.name ? city.name : "-"}
        </div>
      </div>

      <div className="flex items-baseline">
        <label className="w-1/3 text-neutral-600 font-medium">Provinsi</label>
        <div className="w-2/3 text-neutral-900 font-medium">
          {province.name ? province.name : "-"}
        </div>
      </div>

      <div className="flex items-baseline">
        <label className="w-1/3 text-neutral-600 font-medium">Kode Pos*</label>
        <div className="w-2/3">
          <Dropdown
            options={postalCodeList}
            onSearchValue
            placeholder="Pilih Kode Pos"
            searchPlaceholder="Cari Kode Pos"
            defaultValue={[postalCode]}
            onSelected={(val) =>
              setPostalCode({
                name: val[0].name,
                value: val[0].value,
              })
            }
          />
        </div>
      </div>
      <div className="flex items-baseline">
        <label className="w-1/3 text-neutral-600 font-medium">
          Titik Lokasi*
        </label>
        <div className="w-2/3">
          <MiniMap
            lat={coordinates?.lat}
            lng={coordinates?.long}
            onClick={() => setOpenMap(true)}
          />
        </div>
      </div>

      <ModalComponent
        isOpen={isOpenMap}
        setClose={() => setOpenMap(false)}
        hideHeader
      >
        <div className="flex item-start gap-4 pt-[14px] px-3">
          <MapContainer
            width={600}
            height={390}
            lat={coordinates.lat ? coordinates.lat : -7.250445}
            long={coordinates.long ? coordinates.long : 112.768845}
            onPosition={(val) => console.log(val.lat, val.lng)}
          />
          <div className="flex flex-col gap-[22px]">
            <span className="text-base font-semibold text-neutral-900">
              Atur Pin Lokasi
            </span>
            <Input
              classname={"w-[255px] max-w-none"}
              value={getSearchLokasi}
              changeEvent={(e) => setSearchLokasi(e.target.value)}
              placeholder="Cari Lokasi"
              icon={{
                left: (
                  <IconComponent
                    src={
                      process.env.NEXT_PUBLIC_ASSET_REVERSE +
                      "/icons/marker.svg"
                    }
                  />
                ),
                right: getSearchLokasi ? (
                  <span
                    className="flex items-center"
                    onClick={() => setSearchLokasi("")}
                  >
                    <Image
                      src={
                        process.env.NEXT_PUBLIC_ASSET_REVERSE +
                        "/icons/closes.svg"
                      }
                      width={10}
                      height={10}
                      alt="closes"
                    />
                  </span>
                ) : (
                  ""
                ),
              }}
            />
          </div>
        </div>
      </ModalComponent>
    </div>
  );
};

export default AddressForm;
