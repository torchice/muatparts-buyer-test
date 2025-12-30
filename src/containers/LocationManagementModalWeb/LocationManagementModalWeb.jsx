
'use client';
import { mutate } from 'swr';
import style from './LocationManagementModalWeb.module.scss'
import { useEffect, useState } from 'react';
import ModalComponent from '@/components/Modals/ModalComponent';
import AddAddressContainer from '../AddAddressContainer/AddAddressContainer';
import ListAddressContainer from '../ListAddressContainer/ListAddressContainer';
import ProtectComponent from '@/common/ProtectComponent';
import { userLocationZustan } from '@/store/manageLocation/managementLocationZustand';
function LocationManagementModalWeb({
    isOpen,
    setClose,
    onSelectLocation,
    onSaveChange, //jika mau menggunakan custom save, wajib set preventDefaultSave ke true, tapi jangan di sini yaa ngubahnya
    preventDefaultSave=false,
    showMultipleSelection,
    defaultValue,
    ...props
}) {
    const [getModal,setModal]=useState('')
    const {locations}=userLocationZustan()
    function handelIsClose() {
        setModal("")
        setClose?.()
    }
    function onSave(val) {
        setModal("")
        setClose?.()
        if(typeof onSaveChange==='function') onSaveChange?.(val)
    }

    useEffect(()=>{
        if(typeof isOpen==='boolean') setModal(isOpen?'show_location':'')
        if(typeof isOpen==='string') setModal(isOpen)
        if(!isOpen) setModal('')
    },[isOpen,onSelectLocation])
  
    return (
        <>
            <ModalComponent
                full
                hideHeader
                isOpen={getModal === "show_location"}
                setClose={handelIsClose}
                classnameContent={'w-[471px] !p-0'}
            >
                <ListAddressContainer
                    accessToken={props?.accessToken}
                    locations={locations}
                    onChange={() => setModal("add_location")}
                    onAddAddress={() => setModal("add_location")}
                    onSave={onSave}
                    onSelectLocation={onSelectLocation}
                    preventDefaultSave={preventDefaultSave}
                    showMultipleSelection={showMultipleSelection}
                    defaultValue={defaultValue}
                />
            </ModalComponent>
            <ModalComponent
                classnameContent={
                "!py-8 !px-6 !max-h-[500px] !overflow-y-hidden !h-full !w-full !max-w-[471px]"
                }
                full
                hideHeader
                isOpen={getModal === "add_location"}
                setClose={() => {
                    setModal("show_location");
                }}
            >
                <AddAddressContainer
                    onClickSave={() => {
                        setModal("show_location");
                        mutate("v1/muatparts/profile/location");
                    }}
                    classname={"!overflow-auto"}
                />
            </ModalComponent>
      </>
    );
}

export default ProtectComponent(LocationManagementModalWeb)
  