import Checkbox from '@/components/Checkbox/Checkbox';
import Input from '@/components/Input/Input';
import React from 'react';
import styles from "./CityRow.module.scss"

function CityRow({
  provinceId,
  cityID,
  cityName,
  isActive,
  price,
  formData,
  setFormData
}) {

  const handleChangeCheckbox = (checked) => {
    setFormData(prevState => prevState.map(item => {
      if (item.id !== provinceId) {
        return item
      }
      return {
        ...item,
        cities: item.cities.map(city => city.cityID === cityID ? { ...city, isActive: checked, price: 0 } : city)
      }
    }))
  }

  const handleChangeInput = (value) => {
    setFormData(prevState => prevState.map(item => {
      if (item.id !== provinceId) {
        return item
      }
      return {
        ...item,
        cities: item.cities.map(city => city.cityID === cityID ? { ...city, price: value } : city)
      }
    }))
  }

  return (
    <div className="flex gap-x-2 items-center">
      <Checkbox
        label={
          <div className='min-w-[214.5px] w-[214.5px] font-medium text-[12px] leading-[14.4px]'>{cityName}</div>
        }
        checked={isActive}
        onChange={(e) => handleChangeCheckbox(e.checked)}
      />
      <Input
        classname={`w-[262px] ${styles.input_search} ${isActive ? "" : "cursor-not-allowed"}`}
        classInput={`${isActive ? "" : "text-neutral-600 cursor-not-allowed"}`}
        disabled={!isActive}
        text={{ left: "Rp" }}
        placeholder="Contoh : 100.000"
        value={price}
        changeEvent={(e) => handleChangeInput(e.target.value)}
        type='number'
      />
    </div>
  );
}

export default CityRow;