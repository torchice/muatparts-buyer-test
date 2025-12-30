
import style from "./ModalComponent.module.scss";
import { useEffect, useRef, useState } from "react";
import IconComponent from "../IconComponent/IconComponent";
import Image from "next/image";
import PropTypes from "prop-types";
import { headerProps } from "@/container/HeaderContainer/headerProps";
import ImageComponent from "../ImageComponent/ImageComponent";
function ModalComponent({
  children,
  full,
  hideHeader = false,
  headerSize = "small",
  isOpen,
  setClose,
  preventAreaClose,
  showButtonClose = true,
  classname,
  classnameContent,
  bgTransparent=false,
  type='Modal',
  title='',
  drawerPosition='left'
}) {
  const { headerHeight } = headerProps();
  const [getIsOpen, setIsOpen] = useState();
  const parentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (parentRef.current && !parentRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    setIsOpen(isOpen);
  }, [isOpen]);
  
  if (getIsOpen)
    return (
      <div
        ref={parentRef}
        style={{
          top: (full) ? "0" : `${headerHeight}px`,
          height: (full) ? "100vh" : `calc(100% - ${headerHeight}px)`,
        }}
        className={`${style.main}  w-full overflow-hidden z-[92] flex justify-center items-center ${classname}`}
        onClick={() => {
          if (!preventAreaClose) {
            setIsOpen(false);
            setClose?.();
          }
        }}
      >
        <div
          onClick={(e) => {
            console.log('asd')
            e.stopPropagation()
            if (!preventAreaClose) {
              setIsOpen(false);
              setClose?.();
            }
          }}
          style={{
            top: full ? "0" : `${headerHeight}px`,
            height: full ? "100vh" : `calc(100% - ${headerHeight}px)`,
          }}
          className="bg-neutral-900 opacity-[0.4] w-full h-full fixed z-20"
        />
        {
          type==='Modal'&&
          <>
            {!hideHeader ? <div className="bg-white "></div> : ""}
            {children ? (
              <div
                className={`${bgTransparent?'bg-transparent':'bg-white'} rounded-[10px] p-2 z-40 relative min-w-[260px]  min-h-[108px] ${
                  !hideHeader ? "pt-[78px]" : ""
                } ${classnameContent}`}
                onClick={(e) => e.stopPropagation()}
              >
                {!hideHeader && (
                  <ImageComponent
                    src={`/icons/header-${headerSize}.svg`}
                    width={386}
                    height={208}
                    className="absolute left-0 top-0 z-40"
                    alt="header"
                  />
                )}
                {hideHeader && showButtonClose ? (
                  <span className="cursor-pointer" onClick={setClose}>
                    <IconComponent
                      classname={"absolute z-50 right-2 top-2 " + style.closeBlue}
                      src={"/icons/closes.svg"}
                      width={12}
                      height={12}
                    />
                  </span>
                ) : showButtonClose ? (
                  <span
                    onClick={setClose}
                    className="cursor-pointer w-5 h-5 absolute z-[52] right-2 top-2 flex justify-center items-center bg-white rounded-full"
                  >
                    <IconComponent
                      classname={style.closeRed}
                      width={8}
                      height={8}
                      src={"/icons/closes.svg"}
                    />
                  </span>
                ) : (
                  ""
                )}
                {children}
              </div>
            ) : (
              ""
            )}
          </>
        }
        {
          type==='BottomSheet'&&
            <div onClick={e=> e.stopPropagation()} className={`absolute z-40 w-full h-fit bottom-0 left-0 ${bgTransparent?'bg-transparent':'bg-neutral-50'} rounded-t-2xl flex flex-col gap-4`}>
              <div className="w-[38px] h-1 bg-[#dddddd] rounded-[4px] self-center mt-1"></div>
              <div className="flex w-full relative justify-center px-4">
                <span className="cursor-pointer" onClick={setClose}>
                  <IconComponent
                    classname={"absolute z-40 left-4 " + style.closeBlue}
                    src={"/icons/closes.svg"}
                    width={16}
                    height={16}
                  />
                </span>
                <span className="text-sm font-bold text-[#000000]">{title}</span>
              </div>
              {children}
            </div>
        }
        {
          type==='Drawer'&&
          // <div onClick={e=> {e.stopPropagation()}} className={`flex w-full ${drawerPosition==="left"?'justify-start':'justify-end'} bg-transparent h-full z-40`}>
            <div onClick={e=> {e.stopPropagation()}} style={{top:(full) ? "0" : `${headerHeight}px`,}} className={`!bg-neutral-50 w-fit flex h-full fixed z-40 ${drawerPosition==='right'?'right-0':''} ${drawerPosition==='left'?'left-0':''} `}>
              {children}
            </div>
          // </div>
        }
      </div>
    );
}

export default ModalComponent;

ModalComponent.propTypes = {
  type: PropTypes.oneOf(['Modal','BottomSheet']),
  children: PropTypes.element,
  full: PropTypes.bool,
  hideHeader:PropTypes.bool,
  headerSize:PropTypes.oneOf(['small','big']),
  isOpen:PropTypes.bool,
  setClose:PropTypes.func,
  preventAreaClose:PropTypes.bool,
  showButtonClose:PropTypes.bool,
  classname:PropTypes.string,
  classnameContent:PropTypes.string,
};
