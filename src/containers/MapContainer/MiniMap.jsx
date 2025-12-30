import React from "react";
import MapContainer from "./MapContainer";

function MiniMap({
  onClick,
  lat = -7.2575,
  lng = 112.7521,
  titleButton = "Atur Pin Lokasi",
}) {
  return (
    <div className="flex flex-col w-[262px]">
      <MapContainer
        width={262}
        height={154}
        classname={"rounded-t-lg rounded-b-none"}
        lat={lat}
        lng={lng}
        viewOnly
      />
      <span
        onClick={onClick}
        className="w-full h-[35px] rounded-b-lg text-white bg-primary-700 grid place-content-center cursor-pointer font-bold text-xs"
      >
        {titleButton}
      </span>
    </div>
  );
}

export default MiniMap;
