"use client";

import { useState, useEffect } from "react";

import AddressForm from "./AddressForm";
import { useLocationStore } from "@/store/locationManagement";

// ***NOTE
// list msg errors pada location management dikirim berupa object, bentuknya seperti di bawah ini:
// {
//     "storeName": "Wajib diisi",
//     "email": "Wajib diisi",
// }
//
//
// untuk default value, kirim berupa object seperti berikut (ubah valuenya saja):
// const formattedManlok = {
//   address: merchantData.Data.addressDetail,
//   location: {
//     title: merchantData.Data.address,
//   },
//   district: {
//     name: merchantData.Data.districtDescription,
//     value: merchantData.Data.districtID,
//   },
//   city: {
//     name: merchantData.Data.cityDescription,
//     id: merchantData.Data.cityID,
//   },
//   province: {
//     name: merchantData.Data.provinceDescription,
//     id: merchantData.Data.provinceID,
//   },
//   postalCode: {
//     name: merchantData.Data.postalCode,
//   },
//   coordinates: {
//     lat: merchantData.Data.latitude,
//     long: merchantData.Data.longitude,
//   },
//   listPostalCodes: merchantData.postalCodes,
//   listDistricts: merchantData.Districts,
// };
// ***NOTE

const LocationManagement = ({ errors, value, defaultValue }) => {
  const { addressData } = useLocationStore();

  useEffect(() => {
    value(addressData);
  }, [addressData]);

  return (
    <div>
      <AddressForm errors={errors} defaultValue={defaultValue} />
    </div>
  );
};

export default LocationManagement;
