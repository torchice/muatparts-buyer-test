"use client";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import React, { useCallback, useState } from "react";

function MapContainer({
  lat = -7.2575,
  lng = 112.7521,
  zoom = 20,
  width,
  height,
  classname,
  viewOnly,
  textLabel,
  onPosition = () => {},
}) {
  const [getCenter, setCenter] = useState({
    lat,
    lng,
  });
  const [map, setMap] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const onLoad = useCallback((a) => {
    const bounds = new window.google.maps.LatLngBounds(getCenter);
    a.fitBounds(bounds);
    setMap(a);
  }, []);
  const onDragEnd = useCallback(async () => {
    if (map) {
      const newCenter = map.getCenter();
      setCenter({
        lat: newCenter.lat(),
        lng: newCenter.lng(),
      });
      onPosition({
        lat: newCenter.lat(),
        lng: newCenter.lng(),
      });
    }
  }, [map]);

  const cleanUp = useCallback(() => setMap(null), []);
  const handleMarkerClick = () => {
    const contentString = textLabel ?? "<p>Custom Marker Label</p>";

    if (infoWindow) {
      infoWindow.close();
    }

    const newInfoWindow = new window.google.maps.InfoWindow({
      content: contentString,
      position: getCenter,
    });
    newInfoWindow.open(map);
    setInfoWindow(newInfoWindow);
  };
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API,
  });
  if (!isLoaded)
    return (
      <div
        style={{ width: width + "px", height: height + "px" }}
        className={`overflow-hidden rounded-md w-[200px] h-[200px] animate-pulse bg-gray-400 ${classname}`}
      ></div>
    );
  return (
    <div
      style={{ width: width + "px", height: height + "px" }}
      className={`overflow-hidden rounded-md w-[200px] h-[200px] ${classname}`}
    >
      <GoogleMap
        center={getCenter}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        onLoad={onLoad}
        zoom={zoom}
        onUnmount={cleanUp}
        onDragEnd={onDragEnd}
        options={{
          draggable: !viewOnly,
          scrollwheel: !viewOnly,
        }}
      >
        <Marker
          position={getCenter}
          draggable
          onDragEnd={onDragEnd}
          icon={{
            url: "/img/marker.png",
            scaledSize: new window.google.maps.Size(40, 58),
            anchor: new window.google.maps.Point(20, 29),
          }}
          onClick={handleMarkerClick}
        />
      </GoogleMap>
    </div>
  );
}

export default MapContainer;
