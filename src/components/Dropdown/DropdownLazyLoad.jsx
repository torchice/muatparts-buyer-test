"use client";
import React, { useState, useRef, useEffect, forwardRef, useMemo } from "react";
import PropTypes from "prop-types";
import IconComponent from "../IconComponent/IconComponent";
import style from "./Dropdown.module.scss";
import DatePicker from "react-datepicker";
import Checkbox from "../Checkbox/Checkbox";
import { Loader2 } from "lucide-react";
{
  /* IMPROVEMENT DROPDOWN WITH LAZYLOAD */
}
export const formatDateFE = (val) => {
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date(val).toLocaleDateString("en-GB", options);
};
export const formatDateAPI = (val) => {
  const d = new Date(val);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DropdownLazyLoad = ({
  id,
  options: pilihan = [],
  optionsOther: pilihanLain = [],
  optionsOtherText = "",
  classname,
  onSearchValue,
  onSelected = () => {},
  selectedIconElement,
  leftIconElement,
  placeholder = "Select value",
  searchPlaceholder = "Search...",
  showDropdown = false,
  isMultipleSelected = false,
  onCustom,
  textCustom,
  defaultValue,
  dateStartEnd,
  defaultShow = "",
  fixedPlaceholder,
  arrowColor = "default",
  disabled,
  onClickTextOther = () => {},

  isLazyLoad = false,
  loading = false,
  onLoadMore = () => {},
  isNextAvailable = false,
}) => {
  const [isOpen, setIsOpen] = useState(showDropdown);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);
  const [optionsOther, setOptionsOther] = useState([]);
  // tanggal
  const [datepicker, setDatepicker] = useState(false);
  const [dateRange, setDateRange] = useState(dateStartEnd || [null, null]);
  const [startDate, endDate] = dateRange;
  useEffect(() => {
    setOptions(pilihan);
  }, [pilihan]);
  useEffect(() => {
    if (pilihanLain?.length) setOptionsOther(pilihanLain);
  }, [pilihanLain]);
  useEffect(() => {
    setIsOpen(showDropdown);
  }, [onCustom]);
  useEffect(() => {
    setIsOpen(false);
  }, [datepicker]);

  useEffect(() => {
    if (dateRange[1] !== null) {
      onSelected(dateRange.map((item) => formatDateAPI(item)));
      setDatepicker(false);
      setIsOpen(false);
    }
  }, [dateRange]);

  const dropdownRef = useRef(null);
  const scrollableRef = useRef(null);
  const loaderRef = useRef(null);
  const hasUserScrolledRef = useRef(false);

  // const searchBy =
  //   search
  //     ? [...options, ...optionsOther]?.filter((val) =>
  //         val.name?.toLowerCase().includes(search.toLowerCase())
  //       )
  //     : options?.filter((val) =>
  //         val.name?.toLowerCase().includes(search.toLowerCase())
  //       );

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    if (selected.filter((item) => item.value == option.value).length) {
      if (isMultipleSelected) {
        const val = selected.filter((item) => item.value !== option.value);
        setSelected(val);
        onSelected(val);
      } else {
        setSelected([option]);
        onSelected([option]);
        setIsOpen(false);
        setSearch("");
      }
    } else {
      if (isMultipleSelected) {
        const val = selected.length ? [...selected, option] : [option];
        setSelected(val);
        onSelected(val);
      } else {
        setSelected([option]);
        onSelected([option]);
        setIsOpen(false);
        setSearch("");
      }
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    onSearchValue(e.target.value);
  };

  const handleLoadMore = () => {
    onLoadMore();
  };

  useEffect(() => {
    if (Array.isArray(defaultValue)) setSelected(defaultValue);
  }, [defaultValue]);

  // Detect if user is scrolling
  useEffect(() => {
    const el = scrollableRef.current;
    if (!el) return;

    const handleScroll = () => {
      hasUserScrolledRef.current = true;
    };

    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isLazyLoad) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          hasUserScrolledRef.current &&
          isNextAvailable
        ) {
          handleLoadMore();
        } else {
        }
      },
      { root: scrollableRef.current, threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [options, isOpen, isLazyLoad]);

  // click outside logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setDatepicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const RenderDropDown = useMemo(() => {
    return (
      <ul className={`${style.listOptions} z-50`}>
        {options.map((val, index) => (
          <li
            className={`${style.list} select-none`}
            key={index}
            onClick={(e) => {
              if (!isMultipleSelected) {
                val.value == "tanggal"
                  ? setDatepicker(true)
                  : handleSelect({
                      value: val.value,
                      name: val.name,
                      title: val.title || "",
                    });
              } else {
                e.preventDefault();
                handleSelect({
                  value: val.value,
                  name: val.name,
                  title: val.title || "",
                });
              }
            }}
          >
            {isMultipleSelected && (
              <Checkbox
                classname={style.checkBox}
                label=""
                value={val.value}
                checked={selected.filter((a) => a.value === val.value).length}
              />
            )}
            <span className={style.content}>
              {val?.title && (
                <span className="font-[600] leading-[14px]">{val?.title}</span>
              )}
              <span className="font-[500] line-clamp-2">{val?.name}</span>
            </span>
            {!!selected.filter((a) => a.value === val.value).length &&
              !isMultipleSelected && (
                <span className="w-4 h-4">
                  <IconComponent src={"/icons/check-circle.svg"} />
                </span>
              )}
          </li>
        ))}
        {optionsOther.length && !search ? (
          <>
            <span
              onClick={onClickTextOther}
              className={`${style.list} select-none border-y border-neutral-400 cursor-default hover:unset`}
            >
              {optionsOtherText ? optionsOtherText : "Opsi Lainnya"}
            </span>
            {optionsOther?.map((val) => {
              return (
                <li
                  className={`${style.list} select-none ter`}
                  key={val.name}
                  onClick={(e) => {
                    if (!isMultipleSelected) {
                      val.value == "tanggal"
                        ? setDatepicker(true)
                        : handleSelect({
                            value: val.value,
                            name: val.name,
                            title: val.title || "",
                          });
                    } else {
                      e.preventDefault();
                      handleSelect({
                        value: val.value,
                        name: val.name,
                        title: val.title || "",
                      });
                    }
                  }}
                >
                  {isMultipleSelected && (
                    <Checkbox
                      classname={style.checkBox}
                      label=""
                      value={val.value}
                      checked={
                        selected.filter((a) => a.value === val.value).length
                      }
                    />
                  )}
                  <span className={style.content}>
                    {val?.title && (
                      <span className="font-[600] leading-[14px]">
                        {val?.title}
                      </span>
                    )}
                    <span className="font-[500]">{val?.name}</span>
                  </span>
                </li>
              );
            })}
          </>
        ) : (
          ""
        )}
        {options.length === 1 && (
          <li className="p-2 text-center text-[12px] select-none">
            Data Tidak Ditemukan
          </li>
        )}
      </ul>
    );
  }, [options, selected]);
  const labelName = fixedPlaceholder
    ? placeholder
    : selected
        ?.map((val) => {
          if (defaultShow) return val[defaultShow];
          if (val.title) return val.title;
          return val.name;
        })
        .join(", ");
  return (
    <>
      <div
        ref={dropdownRef}
        className={`${style.main} ${classname} ${
          disabled ? style.disabled : ""
        }`}
      >
        <button
          id={id}
          onClick={handleToggle}
          className={`${style.buttonPlace} ${
            !selected.length && "!text-neutral-600"
          } select-none `}
        >
          <div className="flex gap-2 items-center ">
            {leftIconElement && leftIconElement}
            {isMultipleSelected && selected.length && !fixedPlaceholder > 1 ? (
              <span className="flex gap-[2px]">
                {selected[0]?.title ? selected[0]?.title : selected[0]?.name}
                <span className="bg-neutral-600 rounded-full text-neutral-50 px-1">
                  {selected.length - 1}+
                </span>
              </span>
            ) : labelName?.length ? (
              <span className="w-full line-clamp-1">{labelName}</span>
            ) : dateRange[1] !== null && !fixedPlaceholder ? (
              <span className="text-[12px] text-neutral-600 font-semibold">{`${formatDateFE(
                dateRange[0]
              )} - ${formatDateFE(dateRange[1])}`}</span>
            ) : (
              <span className="text-[12px] text-neutral-600">
                {placeholder}
              </span>
            )}
          </div>
          <span className="w-4 h-4">
            <IconComponent
              src={selectedIconElement ?? "/icons/chevron-down.svg"}
              color={arrowColor}
              classname={`${style.chevron} ${
                isOpen ? style.chevronRotate : ""
              }`}
            />
          </span>
        </button>

        {isOpen && (
          <div
            ref={scrollableRef}
            className={`absolute top-[36px] left-0 border border-neutral-600 bg-white w-full max-h-[212px] overflow-y-auto z-50 rounded-[6px]`}
          >
            {onSearchValue && (
              <div className="w-full px-3 py-2 sticky top-0 bg-white ">
                <div className="h-[32px] border border-neutral-500 rounded flex items-center py-2 px-3 ">
                  <IconComponent src={"/icons/search.svg"} />
                  <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder={searchPlaceholder}
                    className={`w-full h-full outline-none focus:outline-none rounded py-2 px-3 text-[12px] flex-1 text-neutral-900 placeholder:text-neutral-700`}
                  />
                  {search && (
                    <IconComponent
                      src={"/icons/silang.svg"}
                      onclick={(e) => setSearch("")}
                    />
                  )}
                </div>
              </div>
            )}
            {onCustom && (
              <div
                onClick={onCustom}
                className="flex cursor-pointer w-full justify-start items-center gap-2 border-b border-neutral-400 pb-3"
              >
                <IconComponent
                  src={"/icons/Plus.svg"}
                  width={14}
                  height={14}
                  classname={style.customIcon}
                />
                <span className="text-neutral-900 text-[12px]">
                  {textCustom}
                </span>
              </div>
            )}
            {RenderDropDown}
            {loading && (
              <div className="flex items-center justify-center w-full py-3">
                <Loader2 className="size-4 animate-spin" />
              </div>
            )}
            <div
              ref={loaderRef}
              className="flex items-center justify-center w-full h-0.5"
            />
          </div>
        )}
      </div>
      {datepicker && (
        <DatePicker
          // set value yang terpilih
          inline
          selectsRange={true}
          // withPortal
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setDateRange(update);
          }}
        />
      )}
    </>
  );
};

export default DropdownLazyLoad;

DropdownLazyLoad.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,
  children: PropTypes.element,
  onSearchValue: PropTypes.func,
  selectedIconElement: PropTypes.element,
  leftIconElement: PropTypes.element,
  searchPlaceholder: PropTypes.string,
  showDropdown: PropTypes.bool,
  getShowIndicator: PropTypes.func,
  placeholder: PropTypes.string,
  onSelected: PropTypes.func,
  isNotEmpty: PropTypes.bool,
  isMultipleSelected: PropTypes.bool,
  onCustom: PropTypes.func,
  textCustom: PropTypes.string,
  defaultValue: PropTypes.shape(PropTypes.object),
  id: PropTypes.string,
  defaultShow: PropTypes.oneOf(["title", "name"]),
  fixedPlaceholder: PropTypes.bool,
  loading: PropTypes.bool,
  onLoadMore: PropTypes.func,
};
