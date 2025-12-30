
'use client';
import { useEffect, useState } from 'react';
import style from './ButtonTambahAlamatMobile.module.scss'
function ButtonTambahAlamatMobile({textvalidation,isInvalid=false,setIsInvalid}) {
    const [validation,setValidation]=useState(isInvalid)
    useEffect(()=>{
        if(typeof setIsInvalid==='function') set
    },[setIsInvalid])
    return (
        <div onClick={()=>{}} className={style.main+' h-12 w-full px-3 border border-neutral-400 rounded-md flex items-center relative'}>
            {validation&&<span className='text-error-400 text-xs font-medium absolute top-3 left-0'>{textvalidation?textvalidation:'Alamat tujuan wajib diisi'}</span>}
        </div>
    );
}

export default ButtonTambahAlamatMobile;
  