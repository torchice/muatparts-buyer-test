import { formatDate, getAdjustedDate } from '@/libs/DateFormat'
import { numberFormatMoney } from '@/libs/NumberFormat'
import React,{Fragment} from 'react'

function PilihOpsiPengirimanScreen({shippingExpeditions,pickup,storeCourier,onChooseExpedition,id,sellerID}) {
    
  return (
    <div className="bg-neutral-200 gap-2 flex flex-col">
        {
            shippingExpeditions?.map((val,i)=>{
                return(
                    <div key={i} className="bg-neutral-50 p-4 flex flex-col gap-4">
                        {/* // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB-0306 */}
                        <span className='bold-sm' >{val?.groupName}</span>
                        {
                            val?.expeditions?.map((exp,s)=>{
                                return (
                                    <Fragment key={s} >
                                        <div className="flex flex-col gap-3" onClick={()=>onChooseExpedition({groupname:val.groupName,expedisi:exp,id:id,sellerID,tipe:'expedition'})}>
                                            <div className="flex w-full justify-between">
                                                <span className="semi-sm">{exp?.courierName}</span>
                                                <span className="semi-sm">{numberFormatMoney(exp?.buyerCost)}</span>
                                            </div>
                                            <span className='medium-xs text-neutral-600'>Estimasi tiba : {exp?.minEstimatedDay==exp?.maxEstimatedDay?'Hari ini (3 jam setelah dikirim Penjual)':formatDate(getAdjustedDate(exp?.minEstimatedDay),['day','month'],false)+" - "+formatDate(getAdjustedDate(exp?.maxEstimatedDay),['day','month'],false)}</span>
                                        </div>
                                        {val?.expeditions?.length-1==s?'':<span className="h-[1px] w-full bg-neutral-400 my-4"></span>}
                                    </Fragment>
                                )
                            })
                        }
                    </div>
                )
            })
        }
        {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB-0306 */}
        {
            pickup?.isActive&&
            <div className="bg-neutral-50 p-4 flex flex-col gap-4">
                <span className='bold-sm' >Ambil Langsung</span>
                <div className="flex w-full justify-between" onClick={()=>onChooseExpedition({groupname:'takeaway',expedisi:{
                        "id": "takeaway",
                        "courierName": "Ambil Langsung",
                        "destinationAreaId": 1140,
                        "weight": 0,
                        "originalCost": storeCourier?.cost,
                        "sellerCost": 0,
                        "buyerCost": storeCourier?.cost,
                        "originalInsurance": 0,
                        "sellerInsurance": 0,
                        "buyerInsurance": 0,
                    },id:id,sellerID,tipe:'takeaway'})}>
                    {/* takeaway */}
                    <span className="semi-sm">Ambil Langsung</span>
                    <span className="semi-sm">{pickup?.cost?numberFormatMoney(pickup?.cost):'-'}</span>
                </div>
            </div>
        }
        {
            storeCourier?.isActive&&
            <div className="bg-neutral-50 p-4 flex flex-col gap-4">
                <span className='bold-sm' >Kurir Toko</span>
                <div className="flex w-full justify-between" onClick={()=>onChooseExpedition({groupname:'store_courier',expedisi:{
                        "id": "store_courier",
                        "courierName": "Kurir Toko",
                        "destinationAreaId": 1140,
                        "weight": 0,
                        "originalCost": storeCourier?.cost,
                        "sellerCost": 0,
                        "buyerCost": storeCourier?.cost,
                        "originalInsurance": 0,
                        "sellerInsurance": 0,
                        "buyerInsurance": 0,
                    },id:id,sellerID,tipe:'store_courier'})}>
                    <span className="semi-sm">Kurir Toko</span>
                    <span className="semi-sm">{storeCourier?.cost?numberFormatMoney(storeCourier?.cost):'-'}</span>
                </div>
            </div>
        }
    </div>
  )
}

export default PilihOpsiPengirimanScreen
