
'use client';
import DefaultInputComponent from '@/components/DefaultInputComponent/DefaultInputComponent';
import style from './AddAddressContainerMobile.module.scss'
import Checkbox from '@/components/Checkbox/Checkbox';
import ButtonBottomMobile from '@/components/ButtonBottomMobile/ButtonBottomMobile';
import Button from '@/components/Button/Button';
import { useHeader } from '@/common/ResponsiveContext';
import SWRHandler from '@/services/useSWRHook';
import { useCallback, useEffect, useRef, useState } from 'react';
import { addManagementLocationZustand, userLocationZustan } from '@/store/manageLocation/managementLocationZustand';
import { userZustand } from '@/store/auth/userZustand';
import debounce from '@/libs/debounce';
import { hightlightText } from '@/libs/TypographServices';
import Dropdown from '@/components/Dropdown/Dropdown';
import { useLanguage } from '@/context/LanguageContext';
function AddAddressContainerMobile({state={},setState,onSave,onFocusLocation,alamat}) {
    const { t } = useLanguage()
    const location = addManagementLocationZustand()
    const {locations}=userLocationZustan()
    const user =userZustand()

    const [data,setData]=useState({
        Name: "",
        Address: "",
        AddressDetail: "",
        Latitude: 0,
        Longitude: 0,
        Province: "",
        ProvinceID: 0,
        City: "",
        CityID: 0,
        District: "",
        DistrictID: 0,
        PostalCode: "",
        PicName: "",
        PicNoTelp: "",
        UsersID: user?.id,
        PlaceID: "",
        IsMainAddress: 0
    })
    const [getAlamat,setAlamat] = useState('')
    const [getListAlamat,setListAlamat]=useState([])
    const [getPostalCodes,setPostalCodes] = useState([])
    const [showList,setShowList]=useState(false)
    const [validation,setValidation]=useState([])

    const {setScreen,setSearch} = useHeader()
    const {useSWRMutateHook} = SWRHandler()

    const {trigger:autoComplete,data:listAddress} = useSWRMutateHook(process.env.NEXT_PUBLIC_GLOBAL_API+'v1/autocompleteStreet')
    const {trigger:get_district_by_token,data:detailAddress} = useSWRMutateHook(process.env.NEXT_PUBLIC_GLOBAL_API+'v1/district_by_token')
    const {trigger:updateData,isMutatingUpdated}=useSWRMutateHook('v1/muatparts/profile/location','put')
    const {trigger:addData,isMutatingAdd}=useSWRMutateHook(process.env.NEXT_PUBLIC_GLOBAL_API+'v1/muatparts/profile/location')
    
    const debounchingAlamat = useCallback(debounce((val)=>{
        autoComplete({phrase:val}).then(a=>setListAlamat(a?.data))
    },500),[])
    function getDistricByToken(val) {
        setAlamat(val?.Title)
        location.setState('Address',val.Title)
        handleChange('Address',val.Title)
        get_district_by_token({placeId:val?.ID})
        .then((a)=>{
            let data = a?.data?.Data?.CompleteLocation
            let district = a?.data?.Data?.Districts?.[0]
            let postal_codes = a?.data?.Data?.Districts?.[0]?.PostalCodes
            if(postal_codes?.length>0) setPostalCodes(postal_codes.map(val=>({value:val?.PostalCode,name:val?.PostalCode})))
            if(data&&district){
                location?.setAllState({
                    ...location,
                    Address:val?.Title,
                    Latitude:data?.lat,
                    Longitude:data?.lng,
                    Province:data?.province,
                    ProvinceID:data?.provinceid,
                    City:data?.city,
                    CityID:data?.cityid,
                    District:district?.District,
                    DistrictID:district?.DistrictID,
                    PostalCode:data?.postal,
                    PlaceID:val?.ID,
                    UsersID:Number(user?.id)
                })
                setData(prev=>({
                    ...prev,
                    Address:val?.Title,
                    Latitude:data?.lat,
                    Longitude:data?.lng,
                    Province:data?.province,
                    ProvinceID:data?.provinceid,
                    City:data?.city,
                    CityID:data?.cityid,
                    District:district?.District,
                    DistrictID:district?.DistrictID,
                    PostalCode:data?.postal,
                    PlaceID:val?.ID,
                    UsersID:Number(user?.id)
                }))
                setValidation(validation.filter(a=>!['District','DistrictID','Province','ProvinceID','City','CityID','PostalCode','Address'].includes(a)))
                setShowList(false)
            }else{
                setSearch({value:'',tmp:''})
                location.setState('Latitude',a?.data?.Data?.Message?.lat)
                location.setState('Longitude',a?.data?.Data?.Message?.lng)
                location.setState('PlaceID',val?.ID)
                location.setState('UsersID',user?.id)
                handleChange('Latitude',a?.data?.Data?.Message?.lat)
                handleChange('Longitude',a?.data?.Data?.Message?.lng)
                // callback memanggil kodepos screeen
                onFocusLocation?.()
            }
        })
    }
    function handleChange(label,value) {
        if(value) setValidation(validation.filter(a=>a!==label))
        setData(a=>({...a,[label]:value}))
        setState?.(label,value)   
        location?.setState(label,value)
    }
    
    function handleSave() {
        let newData = Object.fromEntries(Object.entries(data).filter(([key]) => !["createdAt", "updatedAt"].includes(key)))
        const isRquired = Object.entries(newData).map(([key,val])=>{
            if(!val&&key!=='IsMainAddress'&&key!=='ID'&&key!=='Notes'&&key!=='Void'&&key!=='isTroli') return key
            return null
        })?.filter(a=>a)
        if(isRquired.length) return setValidation(isRquired)
        if(newData?.ID){
            updateData({param:newData}).then(a=>{
                if(a.status==200){
                    onSave()
                    location?.clearState()
                }
            })
        }else{
            let newModifyData = newData
            delete newModifyData.ID
            addData({
                param:{...newModifyData,UsersID:Number(user?.id)}
            }).then((a)=>{
                if(a.status==200){
                    onSave()
                    location?.clearState()
                }
            })
        }
    }
    useEffect(()=>{
        if(Object.keys(state).length) setData(state)
        else {
            delete location?.isTroli
            setData(location)
        }
    },[])
    useEffect(()=>{
        if(alamat) setData(a=>({...a,Address:alamat}))
    },[alamat])
    useEffect(()=>{
        if(!locations.length) {
            setData(a=>({...a,IsMainAddress:1}))
            location?.setState('IsMainAddress',1)
        }else{
            setData(a=>({...a,IsMainAddress:0}))
            location?.setState('IsMainAddress',0)
        }
    },[!locations.length])
    useEffect(()=>{
        if(location?.PostalCode) setPostalCodes([{value:location?.PostalCode,name:location?.PostalCode}])
    },[location])
    return (
        <div className={`${style.main} text-neutral-900 flex flex-col gap-6 containerMobile pb-[88px]`}>
            <DefaultInputComponent classSuppertiveTextLeft={'!top-8'} supportiveText={{left:validation?.some(a=>a==='Name')?t('LabelnavbarResponsiveNamewajibdiisi'):''}} isError={validation?.some(a=>a==='Name')} value={data?.Name} onChange={e=>handleChange('Name',e.target.value)} label={`${t('LabelnavbarResponsiveLabelAlamat')}*`} placeholder={t('LabelnavbarResponsiveMasukkanlabelalamatmaks.30karakter')} />  
            <div className='flex flex-col gap-4 relative'>
                <DefaultInputComponent 
                classSuppertiveTextLeft={'!top-8'} 
                supportiveText={{left:validation?.some(a=>a==='Address')?t('LabelnavbarResponsiveAlamatwajibdiisi'):''}} 
                isError={validation?.some(a=>a==='Address')} 
                value={location.Address} 
                // focusEvent={()=>onFocusLocation(data?.Address)} 
                onChange={e=>{
                    location.setState('Address',e.target.value)
                    if(e.target.value) {
                        setShowList(true)
                        debounchingAlamat(e.target.value)
                    }
                    else setShowList(false)
                }}
                label={`${t('LabelnavbarResponsiveAlamat')}*`} 
                placeholder={t('LabelnavbarResponsiveMasukkanAlamat')} /> 
                {/* <span className='medium-xs self-end'>t('LabelnavbarResponsiveAlamat') tidak ditemukan? <span className='text-primary-700'>Isi alamat manual</span></span>  */}
                {(showList&&getListAlamat.length>0)&&<ul className='w-full border bg-neutral-50 border-neutral-400 rounded p-4 absolute left-0 top-[74px] z-40 max-h-[286px] overflow-y-auto list-none flex flex-col gap-2' >
                    {
                        !!(getListAlamat.length)&&getListAlamat.map(val=><li key={val?.ID} onClick={()=>getDistricByToken(val)}>
                            <div className='medium-sm' dangerouslySetInnerHTML={{__html:hightlightText(location.Address,val?.Title)}}></div>
                        </li>)
                    }
                </ul>}
            </div>
            <div className='flex gap-1 flex-col'>
                <span className={`semi-xs ${validation.some(a=>a==='District')?'text-error-500':''}`}>{t('LabelnavbarResponsiveKecamatan/Kota/Provinsi')} {validation.some(a=>a==='District')?t('LabelnavbarResponsivewajibdiisi'):''}</span>
                <span className='semi-sm'>{data?.District}, {data?.City}, {data?.Province}</span>
            </div>
            <div className="flex flex-col gap-3 relative">
                <span className="medium-xs">{t('LabelnavbarResponsiveKodePos')}*</span>
                <Dropdown options={getPostalCodes} onSelected={a=>handleChange('PostalCode',a[0]?.['value'])} defaultValue={getPostalCodes?.filter(a=>a?.value===data?.PostalCode)} placeholder={t('LabelnavbarResponsiveMasukkanKodePos')} classname={`!w-full ${validation.some(a=>a==='PostalCode')?'!border !border-error-500':''}`} />
                {validation.some(a=>a==='PostalCode')&&<span className='absolute top-16 text-error-500 medium-xs'>{t('LabelnavbarResponsiveKodePos')} {t('LabelnavbarResponsivewajibdiisi')}</span>}
            </div>
            <div className='flex flex-col'>
                <DefaultInputComponent classSuppertiveTextLeft={'!top-[70px]'} supportiveText={{left:validation?.some(a=>a==='AddressDetail')?t('LabelnavbarResponsiveDetailAlamatwajibdiisi'):''}} isError={validation?.some(a=>a==='AddressDetail')} type='textarea' value={data?.AddressDetail} label={`${t('LabelnavbarResponsiveDetailAlamat')}*`} placeholder={t('LabelnavbarResponsiveMasukkanDetailAlamat')} classTextarea={'p-1 medium-xs'} onChange={e=>{
                    if(e.target.value.length<225){
                        handleChange('AddressDetail',e?.target?.value)
                    }
                }} />  
                <span className='medium-xs text-neutral-600 self-end mt-3'>{data?.AddressDetail?.length}/225</span>
            </div>
            <DefaultInputComponent classSuppertiveTextLeft={'!top-8'} supportiveText={{left:validation?.some(a=>a==='PicName')?`${t('LabelnavbarResponsiveNamaPIC')} ${t('LabelnavbarResponsivewajibdiisi')}`:''}} isError={validation?.some(a=>a==='PicName')} onChange={e=>handleChange('PicName',e?.target?.value)} label={`${t('LabelnavbarResponsiveNamaPIC')}*`} value={data?.PicName} placeholder={t('LabelnavbarResponsiveMasukkanNamaPICLokasi')} />  
            <DefaultInputComponent classSuppertiveTextLeft={'!top-8'} supportiveText={{left:validation?.some(a=>a==='PicNoTelp')?`${t('LabelnavbarResponsiveNomorPIC')}  ${t('LabelnavbarResponsivewajibdiisi')}`:''}} isError={validation?.some(a=>a==='PicNoTelp')} onChange={e=>handleChange('PicNoTelp',e?.target?.value)} label={`${t('LabelnavbarResponsiveNomorPIC')}*`} value={data?.PicNoTelp} placeholder={t('LabelnavbarResponsiveContoh')} />  
            <Checkbox label={t('LabelnavbarResponsiveJadikanalamatsebagaialamatutama')} disabled={!locations.length} checked={data?.IsMainAddress} value={data?.IsMainAddress} onChange={()=>{
                if(data?.IsMainAddress==1) handleChange('IsMainAddress',0)
                else handleChange('IsMainAddress',1)
            }} />
            <ButtonBottomMobile classname={'py-3 px-4'} >
                <Button Class='!w-full !max-w-full !h-10' onClick={handleSave}>{t('LabelnavbarResponsiveSimpan')}</Button>
            </ButtonBottomMobile>
        </div>
    );
}

export default AddAddressContainerMobile;
