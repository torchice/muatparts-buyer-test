import { useLanguage } from '@/context/LanguageContext';
// 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
import useSellerStore from '@/store/seller';
import { Fragment } from 'react';

const Sidebar = ({
  etalase = [],
  selectedEtalase = null, // Will be in format { type: 'showcase'|'category', value: string }
  setSelectedEtalase
}) => {
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
  const { resetFilter, setSearch } = useSellerStore();
  const { t } = useLanguage();
  return (
    <div className="flex flex-col w-[264px] gap-y-6">
      {/* Showcases Section */}
      <div className="flex overflow-hidden flex-col justify-center p-4 max-w-full bg-white rounded-md border border-solid border-neutral-400 w-[264px]">
        <div className="flex flex-col w-full gap-y-4">
          <div className="flex-1 shrink gap-2 self-stretch w-full font-bold text-[20px] leading-[24px] whitespace-nowrap">
            {t("labelEtalase")}
          </div>
          {etalase.map((item, key) => {
            const isSelected = selectedEtalase?.id === item.id
            return (
              <Fragment key={key}>
                <div className={etalase.length - 1 === key ? "" : "border-b-neutral-400 border-b pb-4"}>
                  <div className={`${isSelected
                      ? 'text-[#C22716]' : ''}
                      py-2 relative
                    `}
                  >
                    <div
                      onClick={() => {
                        // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
                        setSelectedEtalase(item)
                        resetFilter()
                        setSearch("")
                      }}
                      className={`flex gap-2 items-center px-4 w-ful bg-white cursor-pointer`}
                    >
                      <div className="font-semibold text-[12px] leading-[14.4px]">
                        {item.title}
                      </div>
                    </div>
                    {isSelected ? (
                      <div className="flex absolute top-[4px] left-0 w-1 h-6 bg-[#C22716] rounded-none" />
                    ) : null}
                  </div>
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;