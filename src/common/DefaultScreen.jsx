import LocationNavbarMobile from "@/containers/LocationNavbarMobile/LocationNavbarMobile";
import SearchNavbarMobile from "../containers/SearchNavbarMobile/SearchNavbarMobile";
import OtherNavbarMobile from "@/containers/OtherNavbarMobile/OtherNavbarMobile";
import ListLocationManagementMobile from "@/containers/LocationManagementContainerMobile/ListLocationManagementMobile";
import ListAddressContainerMobile from "@/containers/ListAddressContainerMobile/ListAddressContainerMobile";
import { addManagementLocationZustand, userLocationZustan } from "@/store/manageLocation/managementLocationZustand";
import { ResponsiveContext, useHeader } from "./ResponsiveContext";
import AddAddressContainerMobile from "@/containers/AddAddressContainerMobile/AddAddressContainerMobile";
import { useContext } from "react";
import LocationManagementContainerMobile from "@/containers/LocationManagementContainerMobile/LocationManagementContainerMobile";
import { useLanguage } from "@/context/LanguageContext";

export const RegisterDefaultScreen = {
    "default_search_navbar_mobile":<SearchNavbarMobile/>,
    "default_location_navbar_mobile":<ListAddressContainerMobile/>,
    "default_other_navbar_mobile":<OtherNavbarMobile/>,
}

function DefaultScreen({type,setAppBar,setScreen,setSearch}) {
  const { t } = useLanguage()
  if(type==="default_search_navbar_mobile") return <SearchNavbarMobile/>
  if(type==="default_location_navbar_mobile") return <ListAddressContainerMobile 
  onChange={()=>{
    setAppBar({
      defaultType:'default_add_location_navbar_mobile',
      title:t('LabelnavbarResponsiveDetailAlamat'),
      appBarType: "header_title",
      onBack: () => {
        setAppBar({
          defaultType:'default_location_navbar_mobile',
          title:"t('LabelnavbarResponsivePilihAlamatTujuan')",
          appBarType: "header_title"
        });

      },})
  }}  
  onAddAddress={()=>{
    addManagementLocationZustand.getState()?.clearState()
    setAppBar({
      defaultType:'default_add_location_navbar_mobile',
      title:t('LabelnavbarResponsiveDetailAlamat'),
      appBarType: "header_title",
      onBack: () => {
        setAppBar({
          defaultType:'default_location_navbar_mobile',
          title:"t('LabelnavbarResponsivePilihAlamatTujuan')",
          appBarType: "header_title"
        });
      },})
  }}
  />
  if(type==="default_add_location_navbar_mobile") return <AddAddressContainerMobile onFocusLocation={()=>{
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0268
    setAppBar({
        defaultType:'default_managemenet_location',
        appBarType: "header_search_secondary",
        onBack:()=>{
          setAppBar({
            defaultType:"default_add_location_navbar_mobile",
            title:t('LabelnavbarResponsivePilihAlamatTujuan'),
            appBarType: "header_title"
          })
        }
    })
    setSearch({placeholder:'Cari lokasi dari kecamatan'})
  }} onSave={()=>setAppBar({defaultType:'default_location_navbar_mobile',
    title:t('LabelnavbarResponsivePilihAlamatTujuan'),
    appBarType: "header_title"})} />
  if(type==="default_managemenet_location") return <LocationManagementContainerMobile onSelect={()=>{
    setAppBar({
      defaultType:'default_add_location_navbar_mobile',
      title:t('LabelnavbarResponsiveDetailAlamat'),
      appBarType: "header_title",
      onBack: () => {
        setAppBar({
          defaultType:'default_location_navbar_mobile',
          title:"t('LabelnavbarResponsivePilihAlamatTujuan')",
          appBarType: "header_title"
        });
      },})
  }} onClickVieManloc={()=>{
    setAppBar({defaultType:'default_list_managemenet_location',
      title:t('LabelnavbarResponsiveMasukkanAlamat'),
      appBarType: "header_title_modal_secondary"})
  }} />
  if(type==="default_list_managemenet_location") return <ListLocationManagementMobile onEdit={()=>{
    setAppBar({
      defaultType:'default_add_location_navbar_mobile',
      title:t('LabelnavbarResponsiveDetailAlamat'),
      appBarType: "header_title",
      onBack: () => {
        setAppBar({
          defaultType:'default_location_navbar_mobile',
          title:"t('LabelnavbarResponsivePilihAlamatTujuan')",
          appBarType: "header_title"
        });
      }
    })
  }} />
  if(type==="default_other_navbar_mobile") return <OtherNavbarMobile/>
  // return RegisterDefaultScreen?.[type]
}

export default DefaultScreen
