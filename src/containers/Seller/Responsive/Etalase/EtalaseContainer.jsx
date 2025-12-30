import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { EtalaseItem } from "./EtalaseItem";
// 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
import useSellerStore from "@/store/seller";

const EtalaseContainer = ({
  onSelectEtalase,
  // API
  etalase,
  isLoadingTabTwo
}) => {
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
  const { resetFilter, setSearch } = useSellerStore();
  if (isLoadingTabTwo) {
    return null;
  }
  return (
    <div className="flex flex-col p-4 text-black">
      <div className="flex flex-col w-full">
        {etalase.length === 0 ? (
          <DataNotFound
            classname="my-[90px]"
            title="Belum Ada Etalase"
          />
        ) : etalase.map((item, key) => (
          <button
            key={key}
            onClick={() => {
              // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0588
              onSelectEtalase(item);
              resetFilter();
              setSearch("");
            }}
          >
            <EtalaseItem
              {...item}
              isLast={key === etalase.length - 1}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default EtalaseContainer