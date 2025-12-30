import React, { useMemo, useState } from 'react';
import ProvinceSection from './ProvinceSection';
import Filter from './Filter';
import RegionCard from './RegionCard';
import DataNotFound from '@/components/DataNotFound/DataNotFound';

function ShippingArea({
  addCourierProvince,
  onRefresh,
  count,
  provinceIds,
  lists,
  formData,
  setFormData
}) {
  const [search, setSearch] = useState("")
  const [isOnlyShowSeleted, setIsOnlyShowSeleted] = useState(false)

  const filteredFormData = useMemo(() => {
    return formData.reduce((arr, item) => {
      let cities = [...item.cities]
      if (search) {
        cities = cities.filter(city => city.cityName.toLowerCase().includes(search.toLowerCase()))
      }
      if (isOnlyShowSeleted) {
        cities = cities.filter(city => city.isActive)
      }
      if (cities.length > 0) {
        return [...arr, { ...item, cities }]
      }
      return arr
    }, [])
  }, [JSON.stringify(formData), search, isOnlyShowSeleted])

  return (
    <div className="flex flex-col gap-y-6 p-8 pb-5 bg-white rounded-xl shadow-muat">
      <div className="flex-1 shrink gap-6 w-full text-lg font-bold leading-tight text-black">
        Batasan Area Pengiriman
      </div>
      <ProvinceSection
        addCourierProvince={addCourierProvince}
        onRefresh={onRefresh}
        count={count}
        lists={lists}
        provinceIds={provinceIds}
      />
      {count > 0 ? (
        <>
          <Filter 
            search={search}
            setSearch={setSearch}
            isOnlyShowSeleted={isOnlyShowSeleted}
            setIsOnlyShowSeleted={setIsOnlyShowSeleted}
          />
          {filteredFormData.length > 0 ?
            filteredFormData.map((province, index) => (
              <RegionCard key={index} {...province} formData={formData} setFormData={setFormData} />
            ))
          : (
          <div className='flex justify-center'>
            <DataNotFound
              title="Keyword Tidak Ditemukan"
            />
          </div>
        )}
        </>
      ) : null}
    </div>
  );
}

export default ShippingArea;