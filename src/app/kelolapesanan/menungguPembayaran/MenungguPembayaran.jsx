
'use client'

import SWRHandler from "@/services/useSWRHook"
import { viewport } from "@/store/viewport"
import { useState } from "react"
import MenungguPembayaranResponsive from "./MenungguPembayaranResponsive"
import MenungguPembayaranWeb from "./MenungguPembayaranWeb"

function MenungguPembayaran() {
  const [state,setState]=useState()
  const {useSWRHook}=SWRHandler()
  const {isMobile} = viewport()
  if(typeof isMobile!=='boolean') return <></> //buat skeleton
  if(isMobile) return <MenungguPembayaranResponsive/>
  return <MenungguPembayaranWeb/>
}

export default MenungguPembayaran
  