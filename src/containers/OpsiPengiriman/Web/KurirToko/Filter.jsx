import IconComponent from '@/components/IconComponent/IconComponent';
import Input from '@/components/Input/Input';
import React from 'react';
import styles from "./Filter.module.scss"
import Checkbox from '@/components/Checkbox/Checkbox';

function Filter({
  search,
  setSearch,
  isOnlyShowSeleted,
  setIsOnlyShowSeleted
}) {
  return (
    <div className="flex gap-x-3 items-center w-full">
        <Input
            classname={`w-[262px] ${styles.input_search}`}
            placeholder="Cari Kota/Kabupaten"
            icon={{
            left: (
                <IconComponent src={"/icons/search.svg"} />
            ),
            right: search ? (
                <IconComponent
                    src={"/icons/silang.svg"}
                    onclick={() => {
                      setSearch("")
                    }}
                />
            ) : null,
            }}
            value={search}
            changeEvent={(e) => setSearch(e.target.value)}
        />
      <Checkbox
        label="Tampilkan yang terpilih saja"
        checked={isOnlyShowSeleted}
        onChange={(e) =>
          setIsOnlyShowSeleted(e.checked)
        }
      />
    </div>
  );
}

export default Filter;