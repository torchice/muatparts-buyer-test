import React, { useState, useRef, useEffect } from 'react';
import CityRow from './CityRow';
import Input from '@/components/Input/Input';
import styles from "./RegionCard.module.scss"
import Button from '@/components/Button/Button';
import IconComponent from '@/components/IconComponent/IconComponent';

function RegionCard({
  id,
  cities,
  provinceName,
  formData,
  setFormData
}) {
  const [allCitiesCost, setAllCitiesCost] = useState()
  const [isShowAllCities, setIsShowAllCities] = useState(false)
  const [contentHeight, setContentHeight] = useState('auto')
  const gridRef = useRef(null)

  const shownCities = isShowAllCities ? cities : cities?.slice(0, 10)

  useEffect(() => {
    if (gridRef.current) {
      const height = gridRef.current.scrollHeight
      setContentHeight(height)
    }
  }, [])

  const handleApplyToAllCities = () => {
    setFormData(prevState => prevState.map(item => {
      if (item.id !== id) {
        return item
      }
      return {
        ...item,
        cities: item.cities.map(city => city.isActive ? { ...city, price: allCitiesCost } : city)
      }
    }))
    setAllCitiesCost(0)
  }

  return (
    <div className="flex flex-col gap-y-3 py-5 px-[19.5px] w-full rounded-lg border border-solid border-neutral-400">
      <div className="font-semibold text-[14px] leading-[16.8px] py-[7.5px]">
        {provinceName}
      </div>
      <div className="flex justify-between px-6 py-4 w-full items-center bg-primary-50 rounded-xl">
        <div className='flex gap-x-4 items-center'>
          <span className='font-semibold text-[14px] leading-[15.4px]'>Isi ke Semua Kota/Kab secara Otomatis</span>
          <Input
            classname={`w-[262px] ${styles.input_search}`}
            text={{ left: "Rp" }}
            placeholder="Contoh : 100.000"
            value={allCitiesCost}
            changeEvent={(e) => setAllCitiesCost(e.target.value)}
            type='number'
          />
        </div>
        <Button
          Class="h-8 px-6 flex items-center !font-semibold"
          onClick={handleApplyToAllCities}
        >
          Terapkan ke Semua
        </Button>
      </div>
      <div 
        className="overflow-hidden transition-[max-height] duration-[1200ms] ease-in-out"
        style={{ maxHeight: isShowAllCities ? contentHeight : "270px" }}
      >
        <div 
          ref={gridRef}
          className="grid grid-cols-2 gap-y-[11.5px]"
        >
          {cities.map((city, key) => {
            const isEven = key % 2 === 0
            return (
              <div
                className={`${isEven ? "ml-[18px]" : "pl-2.5"}
                  border-b border-b-neutral-400 pb-3
                `}
                key={key}
              >
                <CityRow {...city} provinceId={id} formData={formData} setFormData={setFormData}/>
              </div>
            )
          })}
          {shownCities.length % 2 !== 0 ? (
            <div
              className={`pl-2.5 border-b border-b-neutral-400 pb-3`}
            />
          ) : null}
        </div>
      </div>
      {cities.length > 10 ? (
        <button className='self-center flex items-center gap-y-1' onClick={() => setIsShowAllCities(prevState => !prevState)}>
          <span className='font-medium text-[12px] leading-[14.4px] text-primary-700'>
            {isShowAllCities ? "Sembunyikan" : "Lihat Selengkapnya"}
          </span>
          <IconComponent
            classname={`transition-transform ${isShowAllCities ? "rotate-180" : "rotate-0"} ${styles.icon_primary}`}
            src="/icons/chevron-down.svg"
          />
        </button>
      ) : null}
    </div>
  );
}

export default RegionCard;