"use client";

import LocationManagement from "@/components/LocationManagement/LocationManagement";
import registerForm from "@/store/registerForm";
import { useState } from "react";

function page() {
  const { errors } = registerForm();

  const [logData, setLogData] = useState({});

  const data = {
    address: "qweqweqwe",
    location: {
      title: "Jl. Seruni, Ketabang, Surabaya, Jawa Timur, Indonesia",
    },
    district: {
      name: "Genteng",
      value: "357807",
    },
    city: {
      name: "KOTA SURABAYA",
      id: "3578",
    },
    province: {
      name: "JAWA TIMUR",
      id: "35",
    },
    postalCode: {
      name: "60271",
    },
    coordinates: {
      lat: "-7.25418600",
      long: "112.74773650",
    },
    listPostalCode: [
      {
        ID: "49112",
        PostalCode: "60271",
        Description: "60271",
      },
      {
        ID: "49115",
        PostalCode: "60272",
        Description: "60272",
      },
      {
        ID: "49114",
        PostalCode: "60273",
        Description: "60273",
      },
      {
        ID: "49116",
        PostalCode: "60274",
        Description: "60274",
      },
      {
        ID: "49113",
        PostalCode: "60275",
        Description: "60275",
      },
    ],
    listDistrict: [
      {
        DistrictID: "357801",
        District: "Karang Pilang",
      },
      {
        DistrictID: "357802",
        District: "Wonocolo",
      },
      {
        DistrictID: "357803",
        District: "Rungkut",
      },
      {
        DistrictID: "357804",
        District: "Wonokromo",
      },
      {
        DistrictID: "357805",
        District: "Tegalsari",
      },
      {
        DistrictID: "357806",
        District: "Sawahan",
      },
      {
        DistrictID: "357807",
        District: "Genteng",
      },
      {
        DistrictID: "357808",
        District: "Gubeng",
      },
      {
        DistrictID: "357809",
        District: "Sukolilo",
      },
      {
        DistrictID: "357810",
        District: "Tambaksari",
      },
      {
        DistrictID: "357811",
        District: "Simokerto",
      },
      {
        DistrictID: "357812",
        District: "Pabean Cantian",
      },
      {
        DistrictID: "357813",
        District: "Bubutan",
      },
      {
        DistrictID: "357814",
        District: "Tandes",
      },
      {
        DistrictID: "357815",
        District: "Krembangan",
      },
      {
        DistrictID: "357816",
        District: "Semampir",
      },
      {
        DistrictID: "357817",
        District: "Kenjeran",
      },
      {
        DistrictID: "357818",
        District: "Lakarsantri",
      },
      {
        DistrictID: "357819",
        District: "Benowo",
      },
      {
        DistrictID: "357820",
        District: "Wiyung",
      },
      {
        DistrictID: "357821",
        District: "Dukuh Pakis",
      },
      {
        DistrictID: "357822",
        District: "Gayungan",
      },
      {
        DistrictID: "357823",
        District: "Jambangan",
      },
      {
        DistrictID: "357824",
        District: "Tenggilis Mejoyo",
      },
      {
        DistrictID: "357825",
        District: "Gunung Anyar",
      },
      {
        DistrictID: "357826",
        District: "Mulyorejo",
      },
      {
        DistrictID: "357827",
        District: "Sukomanunggal",
      },
      {
        DistrictID: "357829",
        District: "Bulak",
      },
      {
        DistrictID: "357830",
        District: "Pakal",
      },
      {
        DistrictID: "357831",
        District: "Sambikerep",
      },
      {
        DistrictID: "357828",
        District: "Asemrowo",
      },
    ],
  };

  return (
    <div className="w-[758px] py-6">
      <LocationManagement
        value={setLogData}
        defaultValue={data}
        errors={errors}
      />
    </div>
  );
}

export default page;
