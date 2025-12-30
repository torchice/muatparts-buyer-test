import Bubble from '@/components/Bubble/Bubble';
import Button from '@/components/Button/Button';
import IconComponent from '@/components/IconComponent/IconComponent';
import { Fragment, useState } from 'react';
import AddProvinceModal from './AddProvinceModal';
import ProvinceBubble from './ProvinceBubble';

function ProvinceSection({
  addCourierProvince,
  onRefresh,
  count,
  provinceIds,
  lists
 }) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedProvinces, setSelectedProvinces] = useState([])

  return (
    <>
      <div className="flex flex-col gap-y-3">
        <div className="flex flex-wrap gap-x-8 items-center">
          <div className="self-stretch my-auto font-medium text-[12px] leading-[14.4px] text-neutral-600 w-[178px]">
            Provinsi*
          </div>
          <div className="flex gap-3 items-center self-stretch my-auto text-sm">
            {count > 0 ? (
              <div className="self-stretch my-auto font-medium text-[14px] leading-[16.8px]">
                {count} Provinsi
              </div>
            ) : null}
            <Button
              Class="px-[30px] h-8 flex items-center !font-semibold"
              onClick={() => {
                setIsOpenModal(true)
                setSelectedProvinces(provinceIds)
              }}
            >
              {count === 0 ? "Pilih Provinsi" : "Tambah"}
            </Button>
          </div>
        </div>
        {count > 0 ? (
          <div className="flex flex-row gap-8">
            <div className="font-medium text-[12px] leading-[14.4px] text-neutral-600 w-[178px] min-w-[178px] mt-[8px]">
              Terpilih
            </div>
            <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-scroll">
              {lists.map((province, key) => (
                <Fragment key={key}>
                  <ProvinceBubble {...province} onRefresh={onRefresh} />
                </Fragment>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <AddProvinceModal
        addCourierProvince={addCourierProvince}
        onRefresh={onRefresh}
        isOpen={isOpenModal}
        setIsOpen={setIsOpenModal}
        selectedProvinces={selectedProvinces}
        setSelectedProvinces={setSelectedProvinces}
      />
    </>
  );
}

export default ProvinceSection;