
'use client'
import { viewport } from '@/store/viewport'
import React, { useState } from 'react'
import DaftarpesanansellerResponsive from './DaftarpesanansellerResponsive'
import DaftarpesanansellerWeb from './DaftarpesanansellerWeb'
import SWRHandler from '@/services/useSWRHook'
const menus=[
  {
    name:'Semua',
    notif:3,
  },
  {
    name:'Pesanan Masuk',
    notif:5,
  },
  {
    name:'Siap Dikirim',
    notif:1,
  },
  {
    name:'Dikirim',
    notif:1
  },
  {
    name:'Selesai',
    notif:1
  },
  {
    name:'Batal',
    notif:1
  },
]
const statusOrder={
  menerimaPesanan:{
    status:[
      {
        id:'batasRespon',
        name:'Batas Respon'
      }
    ]
  },
  siapKirim:{
    status:[
      {
        id:'menungguPickUpKurir',
        name:'Menunggu Pick Up oleh Kurir'
      },
      {
        id:'perluDikirim',
        name:'Perlu Dikirim'
      },
    ]
  },
  dikirim:{
    status:[
      {
        id:'dalamPengiriman',
        name:'Dalam Pengiriman'
      },
      {
        id:'diterimaOlehPembeli',
        name:'Diterima oleh Pembeli'
      },
    ]
  },
}
function Daftarpesananseller() {
  const [state,setState]=useState()
  const {useSWRHook,useSWRMutateHook}=SWRHandler()
  const {isMobile} = viewport()
  if(typeof isMobile!=='boolean') return <></> //buat skeleton
  if(isMobile) return <DaftarpesanansellerResponsive menus={menus} />
  return <DaftarpesanansellerWeb menus={menus} />
}

export default Daftarpesananseller
  