import { categoriesZustand } from '@/store/products/categoriesZustand';
import React, { useEffect, useRef, useState } from 'react';
import { headerProps } from './headerProps';
import IconComponent from '@/components/IconComponent/IconComponent';
import Input from '@/components/Input/Input';
import { viewport } from '@/store/viewport';
import { filterProduct } from '@/store/products/filter';

function CategoryNested({ isOpen, setClose, onSelected,onSelectedValue }) {
    const {widthScreen}=viewport()
    const { categories } = categoriesZustand();
    const { headerHeight } = headerProps();
    const parentRef = useRef(null);
    const [activeCategories, setActiveCategories] = useState([]); // To store nested categories
    const [getIdCategoy, setIdCategoy] = useState([]); // To store nested categories
    const [getValueCategoy, setValueCategoy] = useState([]); // To store nested categories
    const [search, setSearch] = useState('');
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (parentRef.current && !parentRef.current.contains(event.target)) {
                setClose?.();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setClose]);
    useEffect(() => {
        if (isOpen) {
            setActiveCategories([[categories]]);
        } else {
            setActiveCategories([]);
        }
    }, [isOpen, categories]);
    const handleMouseEnter = (level, children,id,value) => {
        let tmp = getIdCategoy
        let tmpVal = getValueCategoy
        tmp[level]=id
        tmpVal[level]=value
        setIdCategoy(tmp)
        setValueCategoy(tmpVal)
        if(level==2 || !children.length) {
            tmp[level]=id
            const result = tmp.slice(0,level+1)
            const resultVal = tmpVal.slice(0,level+1)
            setIdCategoy(result)
            setValueCategoy(resultVal)
            return
        }
        if (children && children.length > 0) {
            const newActiveCategories = activeCategories.slice(0, level + 1);
            newActiveCategories.push([children]);
            setActiveCategories(newActiveCategories);
        } else {
            setActiveCategories(activeCategories.slice(0, level + 1));
        }
    };
    const handleSelectedCategories=()=>{
        setClose()
        onSelected(getIdCategoy)
        onSelectedValue(getValueCategoy)
    }
    const filterCategories = (categoriesList,level) => {
        if(level==2&&search) return categoriesList.filter((cat) => cat.value.toLowerCase().includes(search.toLowerCase())) || [{id:'',value:'Tidak ada data'}]
        return categoriesList;
    };

    return isOpen ? (
        <div
            ref={parentRef}
            className="w-full h-full z-[92] flex justify-center items-start fixed left-0 top-0"
            onClick={() => setClose?.()}
        >
            <div
                className="z-50 relative max-w-[750px] w-full mx-auto"
                onClick={(e) => e.stopPropagation()} // Prevent click propagation to parent
            >
                <div className={`bg-neutral-50 rounded-[10px] p-4 min-w-[262px] absolute top-[95px] h-[292px] overflow-y-auto -left-[62px] flex gap-3 overflow-x-hidden`}>
                    {activeCategories.map((levelCategories, level) => (
                        <div
                            key={level}
                            className="flex flex-col pr-3 border-r border-neutral-400 last:border-none h-full overflow-y-auto"
                        >
                            {level === 2 && (
                                <div className='bg-neutral-50'>
                                    <Input
                                        icon={{ left: '/icons/search.svg',right:search?<span onClick={()=>setSearch('')}><IconComponent src={'/icons/closes.svg'} width={12} height={12} /></span>:'' }}
                                        placeholder="Search categories"
                                        value={search}
                                        changeEvent={(e) => {
                                            if(e.target.value.length>100) return
                                            setSearch(e.target.value)
                                        }}
                                        classname={'absolute top-4 right-6 w-[262px]'}
                                    />
                                </div>
                            )}
                            {
                                !filterCategories(levelCategories?.[0],level)?.length?
                                <div
                                    className={` rounded-md px-[10px] py-3 hover:bg-neutral-200 flex justify-between w-[204px] items-center cursor-pointer ${(level==2)?'mt-9 w-[262px]':''}`}
                                >
                                    <span className={`medium-xs text-neutral-700 ${level==2?'w-full':''}`}>Tidak Ada Data</span>
                                </div>:
                                <>
                                    {level==0&&<div
                                            className={` rounded-md px-[10px] py-3 hover:bg-neutral-200 flex justify-between w-[204px] items-center cursor-pointer `}
                                            onClick={()=>{
                                                onSelected([''])
                                                onSelectedValue(['Semua Kategori'])
                                                setClose()
                                            }}
                                        >
                                            <span className={`medium-xs text-neutral-900 ${level==0?'w-full':''}`}>Semua Kategori</span>
                                    </div>}
                                    {filterCategories(levelCategories?.[0],level).map((category,i) => (
                                        <div
                                            key={category.id}
                                            className={` rounded-md px-[10px] py-3 hover:bg-neutral-200 flex justify-between w-[204px] items-center cursor-pointer ${(level==2&&i==0)?'mt-9 w-[262px]':''}`}
                                            onMouseEnter={() => handleMouseEnter(level, category.children,category.id,category?.value)}
                                            onClick={handleSelectedCategories}
                                        >
                                            <span className={`medium-xs text-neutral-900 ${level==2?'w-full':''}`}>{category.value}</span>
                                            <span className='w-4 h-4'>
                                                {
                                                    (category.children?.length > 0)&(level<=1) ?<IconComponent src={'/icons/chevron-right.svg'} />:''
                                                }
                                            </span>
                                        </div>
                                    ))}
                                </>
                            }
                        </div>
                    ))}
                    {
                        !categories?.length&&<span>No Categories</span>
                    }
                </div>
            </div>
            <div
                style={{
                    top: `${headerHeight}px`,
                    height: `calc(100% - ${headerHeight}px)`,
                }}
                className="bg-neutral-900 opacity-[0.4] w-full h-full fixed"
            />
        </div>
    ) : null;
}

export default CategoryNested;
