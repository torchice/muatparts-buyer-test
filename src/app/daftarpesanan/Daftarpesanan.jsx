"use client";
import { viewport } from "@/store/viewport";
import React, { useEffect, useState } from "react";
import DaftarpesananResponsive from "./DaftarpesananResponsive";
import DaftarpesananWeb from "./DaftarpesananWeb";
import SWRHandler from "@/services/useSWRHook";
import response from "./list-daftar-pesanan-buyer.json";
import responseDetail from "./detail-daftar-pesanan-buyer.json";
import ProtectComponent from "@/common/ProtectComponent";
import { useCustomRouter } from "@/libs/CustomRoute";
import { mergerUnique, metaSearchParams } from "@/libs/services";

export const status_pesanan = [
  {
    id: "Menunggu Pembayaran",
    status: "Menunggu Pembayaran",
    bg: "bg-warning-100",
    text: "warning-900",
    action_button: "Detail Pesanan",
    action_button_detail:[
      {
        buttonText:"Bayar Sekarang",
        color:'primary'
      }
    ]
  },
  {
    id: "Menunggu Respon Penjual",
    status: "Menunggu Respon Penjual",
    bg: "bg-warning-100",
    text: "warning-900",
    action_button: "Detail Pesanan",
    action_button_detail:[
      {
        buttonText:"Batalkan Pesanan",
        color:'error_secondary'
      },
      {
        buttonText:"Chat Penjual",
        color:'primary'
      }
    ]
  },
  {
    id: "Dikemas",
    status: "Dikemas",
    bg: "bg-primary-50",
    text: "primary-700",
    action_button: "Detail Pesanan",
    action_button_detail:[
      {
        buttonText:"Chat Penjual",
        color:'primary'
      }
    ]
  },
  {
    id: "Pengemasan Produk",
    status: "Pengemasan Produk",
    bg: "bg-primary-50",
    text: "primary-700",
    action_button: "Detail Pesanan",
    action_button_detail:[
      {
        buttonText:"Chat Penjual",
        color:'primary'
      }
    ]
  },
  {
    id: "Dikirim",
    status: "Dikirim",
    bg: "primary-50",
    text: "primary-700",
    action_button: "Lacak Pesanan",
    action_button_detail:[
      {
        buttonText:"Chat Penjual",
        color:'primary_secondary'
      },
      {
        buttonText:"Selesaikan Pesanan",
        color:'primary'
      }
    ]
  },
  {
    id: "Tiba di Tujuan",
    status: "Tiba di Tujuan",
    bg: "success-50",
    text: "success-400",
    action_button: "Lacak Pesanan",
    action_button_detail:[
      {
        buttonText:"Chat Penjual",
        color:'primary_secondary'
      },
      {
        buttonText:"Selesaikan Pesanan",
        color:'primary'
      }
    ]
  },
  {
    id: "Dibatalkan Penjual",
    status: "Dibatalkan Penjual",
    bg: "error-50",
    text: "error-400",
    action_button: "Detail Pesanan",
    action_button_detail:[
      {
        buttonText:"Chat Penjual",
        color:'primary_secondary'
      },
      {
        buttonText:"Bantuan",
        color:'primary_secondary'
      }
    ]
  },
  {
    id: "Dibatalkan Pembeli",
    status: "Dibatalkan Pembeli",
    bg: "error-50",
    text: "error-400",
    action_button: "Detail Pesanan",
    action_button_detail:[
      {
        buttonText:"Chat Penjual",
        color:'primary_secondary'
      },
      {
        buttonText:"Bantuan",
        color:'primary_secondary'
      }
    ]
  },
  {
    id: "Dibatalkan Sistem",
    status: "Dibatalkan Sistem",
    bg: "error-50",
    text: "error-400",
    action_button: "Detail Pesanan",
    action_button_detail:[
      {
        buttonText:"Chat Penjual",
        color:'primary_secondary'
      },
      {
        buttonText:"Bantuan",
        color:'primary_secondary'
      }
    ]
  },
  {
    id: "Dikomplain",
    status: "Dikomplain",
    bg: "error-400",
    text: "error-50",
    action_button: "Detail Komplain",
    action_button_detail:[
      {
        buttonText:"Chat Penjual",
        color:'primary_secondary'
      },
      {
        buttonText:"Detail Komplain",
        color:'primary'
      }
    ]
  },
  {
    id: "Pengembalian Dana Selesai",
    status: "Pengembalian Dana Selesai",
    bg: "success-400",
    text: "success-50",
    action_button: "Detail Pesanan",
    action_button_detail:[
      {
        buttonText:"Chat Penjual",
        color:'primary_secondary'
      },
      {
        buttonText:"Detail Komplain",
        color:'primary'
      }
    ]
  },
  {
    id: "Selesai",
    status: "Selesai",
    bg: "success-400",
    text: "success-50",
    action_button: {
      left: "Berikan Ulasan",
      right: "Beli Lagi",
    },
    action_button_detail:[
      {
        buttonText:"Chat Penjual",
        color:'primary_secondary'
      },
      {
        buttonText:"Berikan Ulasan",
        color:'primary'
      }
    ]
  },
  {
    id: "Komplain Selesai",
    status: "Komplain Selesai",
    bg: "success-400",
    text: "success-50",
    action_button: {
      left: "Berikan Ulasan",
      right: "Beli Lagi",
    },
    action_button_detail:[
      {
        buttonText:"Chat Penjual",
        color:'primary_secondary'
      },
      {
        buttonText:"Detail Komplain",
        color:'primary'
      }
    ]
  },
];
function Daftarpesanan({isLogin}) {
  const [getDatapesanan, setDatapesanan] = useState([]);
  const [getDatapesananCount, setDatapesananCount] = useState();
  const router = useCustomRouter()
  const [paginate,setPaginate]=useState({
    page:1,
    size:10,
    q:'',
    status:'',
    start_date:'',
    end_date:''
  })
  const [totalProduct, setTotalProduct] = useState(0);
  const { useSWRHook} = SWRHandler();
  const [getLabelFilter,setLabelFilter]=useState('')
  const {data,isLoading,mutate}=useSWRHook(`v1/muatparts/order/lists?${metaSearchParams(paginate)}`)
  const {data: dataRekening,isLoading: loadingRekening, mutate: mutateRekening}=useSWRHook(`v1/muatparts/bankAccount`)
  const { isMobile } = viewport();
  
  function handleFilterOrderList(label,value) {
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0088
    setLabelFilter(label)
    setPaginate(val=>({...val,[label]:value}))
  }

  useEffect(() => {
    if(paginate) {
      mutate(`v1/muatparts/order/lists?${metaSearchParams(paginate)}`)
    }
  },[paginate])
  
  useEffect(()=>{
    if(Array.isArray(data?.Data)) {
      if(getLabelFilter==='page') {
        let tmp =mergerUnique(getDatapesanan,data?.Data,'orderID')
        setDatapesanan(tmp)
      }
      else setDatapesanan(data?.Data)
      setLabelFilter('')
      setDatapesananCount(data?.DataCount)
    }

    if(!isMobile) {
      setTotalProduct(data?.Pagination?.Total);
    }
  },[data])
  
  if (typeof isMobile !== "boolean") return <></>; //buat skeleton
  if (isMobile && isLogin)
    return (
      <DaftarpesananResponsive
        data={getDatapesanan}
        detailPesanan={responseDetail?.Data}
        status_pesanan={status_pesanan}
        handleFilterOrderList={handleFilterOrderList}
        data_count={getDatapesananCount}
        page={paginate.page}
        pageSize={paginate.size}
        setPage={setPaginate}
        isLoading={isLoading}
      />
    );
  if(isLogin) return (
    <DaftarpesananWeb
      // 25. 11 - QC Plan - Web - Ronda Live Mei - LB - 0126
      mutate={mutate}
      totalProduct={totalProduct}
      data={getDatapesanan ?? []}
      detailPesanan={responseDetail?.Data}
      status_pesanan={status_pesanan}
      data_count={getDatapesananCount}
      setPage={setPaginate}
      paginate={paginate}
      isLoading={isLoading}
      handleFilterOrderList={handleFilterOrderList}
      dataRekening={dataRekening}
    />
  );
  return router.push(process.env.NEXT_PUBLIC_INTERNAL_WEB)
}

export default ProtectComponent(Daftarpesanan)
