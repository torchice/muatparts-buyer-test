"use client"

import React, { useState , useEffect, useRef} from 'react'
import style from './Tooltip.module.scss'
import IconComponent from "../IconComponent/IconComponent"

const Tooltip = ({ text, children, title, icon, position = 'bottom', trigger='hover', ...props}) => {
  const [isOpen, setIsOpen] = useState(false)
  // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB-0172
  const tooltipRef = useRef(null);
  useEffect(() => {
    if (trigger !== 'click') return;

    const handleClickOutside = (event) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [trigger]);
  return (
    <div ref={tooltipRef} onClick={()=>{if(trigger==='click')setIsOpen(!isOpen)}}  className="group flex relative cursor-pointer justify-center items-center" {...props}>
        <div className={`absolute ${trigger==='hover'?'group-hover:block':''} ${trigger==='click'&&isOpen?"block":"hidden"} w-[312px]`}>
              <div className={`flex flex-col-reverse relative justify-start items-center ${style[`position_${position}`]}`}>
                  <div className={`flex gap-[8px] bg-neutral-50 ${style[`box_shadow_${position}`]} rounded-[12px] z-[1] p-[12px] cursor-default`}>
                    <div className={`w-[16px] mt-[2px] `}>
                      {
                        icon && (
                          <IconComponent loader={false} src={{src: '/icons/info.svg'}} height={16} width={16} classname={style.fill_black}/>
                        )
                      }
                    </div>
                    <div className='flex flex-col gap-[8px]'>
                      {
                        title && <div className={`${style.title}`}>{title}</div>
                      }
                      {
                        text && <div className={`${style.text}`}>{text}</div>
                      }
                    </div>
                  </div>
                  <div className={`w-[15px] h-[15px] absolute bg-neutral-50 ${style[`tooltip_${position}`]}`}></div>
              </div>
        </div>
        {children}
    </div>
  );
};

export default Tooltip;
