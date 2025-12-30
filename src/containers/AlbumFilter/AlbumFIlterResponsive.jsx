import NavSelectedMobile from "@/components/Bottomsheet/NavSelectedMobile"
import Button from "@/components/Button/Button"
import { useLanguage } from "@/context/LanguageContext";
import useAlbumStore from "@/store/album";
import { useEffect, useState } from "react";

function transformDataFilters(data) {
    return Object.entries(data).map(([key, value]) => ({
      title: key,
      items: value
    }));
}
  
const AlbumFIlterResponsive = ({
    setScreen,
    dataFilters
}) => {
    const { t } = useLanguage();
    const { filterAlbum, setFilterAlbum } = useAlbumStore();
    const [tempFilter, setTempFilter] = useState({
        brands: [],
        categories: [],
        stock: ""
    })

    useEffect(() => {
        setTempFilter(filterAlbum.filter)
    }, [JSON.stringify(filterAlbum.filter)])

    const filters = transformDataFilters({...dataFilters, Stock: [{ ID: "InStock", Name: t("labelAvailable") }, { ID: "OutStock",  Name: t("labelNotAvailable") }]})
    const filterLabelMap = {
        Categories: t("labelCategory"),
        Brands: t("labelBrandInternal"),
        Stock: t("labelStock")
    }

    // Function to handle filter item selection
    const handleFilterItemClick = (filterType, itemId) => {
        if (filterType.toLowerCase() === "stock") {
            // For Stock filter, we just set the value directly (single selection)
            setTempFilter({
                ...tempFilter,
                stock: tempFilter.stock === itemId ? "" : itemId
            });
        } else {
            // For multi-select filters (categories, brands), we add/remove from array
            const filterKey = filterType.toLowerCase();
            const currentFilter = [...tempFilter[filterKey]];
            
            if (currentFilter.includes(itemId)) {
                // Remove if already selected
                const updatedFilter = currentFilter.filter(id => id !== itemId);
                setTempFilter({
                    ...tempFilter,
                    [filterKey]: updatedFilter
                });
            } else {
                // Add if not selected
                setTempFilter({
                    ...tempFilter,
                    [filterKey]: [...currentFilter, itemId]
                });
            }
        }
    };

    const handleApplyFilter = () => {
        setFilterAlbum({ ...filterAlbum, filter: tempFilter })
        setScreen("list")
    }

    return (
        <>
            <div className="min-h-[calc(100vh_-_56px)] h-full py-5 px-4 flex flex-col gap-y-5">
                <div className="flex flex-col gap-y-5">
                {filters.map((filter, key) => {
                    const isLastChild = filters.length - 1 === key;
                    const selectedFilters = tempFilter[filter.title.toLowerCase()]
                    const selectedItems = filter.items.filter(item => selectedFilters.includes(item.ID))
                    const nonSelectedItems = filter.items.filter(item => !selectedFilters.includes(item.ID))
                    // const sortedItems = getSortedItems(filter.title, filter.items);
                    
                    return (
                    <div key={key} className={`flex flex-col gap-y-4 ${isLastChild ? "" : "pb-5 border-b border-b-neutral-400"}`}>
                        <span className="font-semibold text-[14px] leading-[15.4px] text-neutral-900">
                            {filterLabelMap[filter.title]}
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                            {selectedItems.map((item, index) => (
                                <button
                                    className={`h-[30px] rounded-3xl flex items-center px-3 bg-primary-50 border border-primary-700`}
                                    key={index}
                                    onClick={() => handleFilterItemClick(filter.title, item.ID)}
                                >
                                    <span className={`font-medium text-[14px] leading-[15.4px] text-primary-700`}>
                                        {item.Name}
                                    </span>
                                </button>
                            ))}
                            {nonSelectedItems.map((item, index) => (
                                <button
                                    className={`h-[30px] rounded-3xl flex items-center px-3 bg-neutral-200 border border-neutral-200`}
                                    key={index}
                                    onClick={() => handleFilterItemClick(filter.title, item.ID)}
                                >
                                    <span className={`font-medium text-[14px] leading-[15.4px] text-neutral-900`}>
                                        {item.Name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                    )
                })}
                </div>
                <NavSelectedMobile
                    classname={`left-0 flex items-center w-full py-3 px-4 gap-x-2 z-[12]`}
                >
                <Button
                    Class="flex items-center w-full max-w-full !font-semibold h-10 !leading-[15.4px]"
                    color="primary_secondary"
                    onClick={() => setScreen("list")}
                >
                    {t("buttonCancel")}
                </Button>
                <Button
                    Class="flex items-center w-full max-w-full !font-semibold h-10 !leading-[15.4px]"
                    onClick={handleApplyFilter}
                >
                    {t("buttonSave")}
                </Button>
                </NavSelectedMobile>
            </div>
        </>
    )
}
  
export default AlbumFIlterResponsive