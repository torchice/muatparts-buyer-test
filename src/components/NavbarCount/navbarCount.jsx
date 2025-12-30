"use client";
import Image from "next/image";
import navbarBack from "./assets/navBarBack.svg";
import { useState } from "react";

export default function NavbarCount({
  count = 0,
  active = 0,
  title = "",
  subtitle = "",
  backAction = () => {},
  action1 = {
    icon: null,
    text: "",
    action: () => {},
  },
  action2 = {
    icon: null,
    text: "",
    action: () => {},
  },
  classname,
}) {
  const [bullet, setBullet] = useState(count > 5 ? 5 : count);

  const renderBullet = () => {
    let bullets = [];
    for (let i = 0; i < bullet; i++) {
      bullets.push(
        <div className={"flex items-center justify-start"} key={i}>
          <span
            className={
              i + 1 == active && active != 0
                ? "text-[12px] text-[#C22716] font-[700] leading-[14.4px] flex justify-center items-center border-[2px] border-[#FFFFFF] rounded-[50px] w-[19px] h-[19px] pt-[1px] bg-[#FFFFFF]"
                : "text-[12px] text-[#FFFFFF] font-[700] leading-[14.4px] flex justify-center items-center border-[2px] border-[#FFFFFF] rounded-[50px] w-[19px] h-[19px] pt-[1px]"
            }
          >
            {i + 1}
          </span>
          {i + 1 < bullet ? (
            <div className={"w-[12px] border-[1px] border-[#FFFFFF]"}></div>
          ) : null}
        </div>
      );
    }

    return bullets;
  };

  return (
    <div
      className={`${classname} w-[360px] bg-[#C22716] px-[12px] py-[12px] flex flex-col gap-[16px]`}
    >
      <div
        className={
          "flex items-center justify-between border-b border-[#FFFFFF] pb-[10px]"
        }
      >
        <div className={"flex gap-[12px]"}>
          <button
            className={
              "bg-[#FFFFFF] w-[24px] h-[24px] rounded-[12px] flex items-center pl-[9px] pr-[10px]"
            }
            onClick={backAction}
          >
            <Image
              src={navbarBack}
              width={5}
              height={10}
              alt={"navbar count back"}
            />
          </button>
          <span
            className={"max-w-[188px] text-[#FFFFFF] text-[16px] font-[700]"}
          >
            {title}
          </span>
        </div>
        <div className={"flex gap-[14px]"}>
          {action1.text && (
            <div
              className={"flex flex-col gap-[2px] items-center cursor-pointer"}
              onClick={action1.action}
            >
              {action1.icon && <Image src={action1.icon} alt={action1.text} />}
              <span
                className={"text-white text-[10px] font-[600] leading-[10px]"}
              >
                {action1.text}
              </span>
            </div>
          )}
          {action2.text && (
            <div
              className={"flex flex-col gap-[2px] items-center cursor-pointer"}
              onClick={action2.action}
            >
              {action2.icon && <Image src={action2.icon} alt={action2.text} />}
              <span
                className={"text-white text-[10px] font-[600] leading-[10px]"}
              >
                {action2.text}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className={"flex items-center justify-between pb-[6px]"}>
        <span
          className={
            "grow text-[white] text-[16px] font-[600] leading-[17.6px]"
          }
        >
          {subtitle}
        </span>
        <div className={"flex"}>{renderBullet()}</div>
      </div>
    </div>
  );
}
