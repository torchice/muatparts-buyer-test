"use client";
import React from "react";
import PropTypes from "prop-types";
import style from "./BreadCrumb.module.scss";
import IconComponent from "../IconComponent/IconComponent";
import { useCustomRouter } from "@/libs/CustomRoute";

// import * as Icon from "../../icons";
const BreadCrumb = ({
  data,
  onclick = () => {},
  onActive = () => {},
  classname,
  disableActive = false,
  disableClick=false,
  maxWidth,
}) => {
  const router = useCustomRouter();
  function handleClick(val) {
    // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer LB - 0202
    //24. THP 2 - MOD001 - MP - 035 - QC Plan - Web - MuatParts - General - Daftar Pesanan  LB - 0011
    if(val) {
      if(val.id == 'home') {
        router.push("/");
        return;
      } 
      if(disableClick) return;
      onclick(val);
      onActive(data[data.length - 1]);
    }
  }
  return (
    <div className={`${style.main} ${style.breadcrumb} ${classname}`}>
      {data?.map((val, idx) => {
        return (
          <div className="flex items-center gap-[5px]" key={idx}>
            <div
              style={{ maxWidth: maxWidth ? `${maxWidth}` : "86px" }}
              className={`${style.list + " hover:text-primary-700 "} ${
                // 24. THP 2 - MOD001 - MP - 020 - QC Plan - Web - MuatParts - Profil Seller Sisi Buyer - LB - 0027
                idx === data.length - 1 ? " !max-w-none" : "whitespace-nowrap overflow-hidden text-ellipsis"
              } ${disableActive ? "" : "last:text-primary-700 "} select-none ${!disableClick?'cursor-pointer':''}`}
              key={idx}
              onClick={() => handleClick(val)}
            >
              {val.name}
            </div>
            {idx !== data.length - 1 && (
              <IconComponent
                src={'/icons/chevron-right.svg'}
                classname={style.Icon}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BreadCrumb;
BreadCrumb.propTypes = {
  data: PropTypes.array,
  onclick: PropTypes.func,
  onActive: PropTypes.func,
  classname: PropTypes.string,
  disableActive: PropTypes.bool,
  maxWidth: PropTypes.number,
};
