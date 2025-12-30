import ModalComponent from "../Modals/ModalComponent";
import { useEffect, useRef, useState } from "react";
import IconComponent from "../IconComponent/IconComponent";
import SWRHandler from "@/services/useSWRHook";
import bahasaZus from "@/store/zustand/bahasa";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
// Improvement Trigger Multibahasa
export default function BottomSheetMultibahasa() {
  const { t } = useLanguage();
  const { useSWRHook } = SWRHandler();
  const { data, isLoading } = useSWRHook(
    `v1/bo/language/list?supermenuid=6&role=5`
  );

  const dropdownRef = useRef(null);
  const languageListRef = useRef(null);

  const [selectedLang, setSelectedLang] = useState("id");
  const [langs, setLangs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectLanguage = (lang) => {
    window.localStorage.setItem("lang", lang.url);
    window.location.reload();
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        languageListRef.current &&
        !languageListRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (data) {
      setLangs(data.Data);
    }
  }, [data]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const langStorage = window.localStorage.getItem("lang");
      setSelectedLang(langStorage);
    }
  }, []);
  return (
    <>
      <div
        onClick={() => {
          setIsOpen(true);
        }}
        className={`py-4 flex gap-2 border-b border-neutral-400 items-center cursor-pointer text-xs font-semibold`}
      >
        {langs?.length > 0 ? (
          langs
            .filter((lang) => lang.url === selectedLang)
            .map((lang) => (
              <>
                <Image
                  alt="Language Flag"
                  src={lang.image}
                  width={1000}
                  height={1000}
                  className="shrink-0 w-6 h-4"
                />
                <p>{lang.locale}</p>
              </>
            ))
        ) : (
          <>
            <div className="w-6 h-4" />
            {selectedLang === "id"
              ? "Indonesian"
              : selectedLang === "en"
              ? "English"
              : "Chinese"}
          </>
        )}
      </div>
      <ModalComponent
        full
        isOpen={isOpen}
        setClose={() => {
          setIsOpen(false);
        }}
        title={t("LabelScreenLainnyaPilihBahasaPilihBahasa")}
        type="BottomSheet"
      >
        <div className="flex flex-col gap-2 px-4 divide-y divide-neutral-400 pb-10 text-xs font-semibold ">
          {!isLoading ? (
            langs.map((lang, index) => (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelectLanguage(lang);
                }}
                key={`language-${index}`}
                className={`flex items-center justify-between w-full hover:cursor-pointer hover:bg-black/5  py-2`}
              >
                <div className="flex items-center gap-2">
                  {/* <div className="rounded-[4px] w-6 h-4 bg-gray-300 skeleton animate-skeleton" /> */}
                  <Image
                    alt="Language Flag"
                    src={lang.image}
                    width={1000}
                    height={1000}
                    className="shrink-0 w-6 h-4"
                  />
                  <div className="leading-[10px] font-semibold">
                    {lang.locale}({lang.url.toUpperCase()})
                  </div>
                </div>
                {selectedLang === lang.url && (
                  <IconComponent src={`/icons/check-circle.svg`} />
                )}
              </div>
            ))
          ) : (
            <div className="p-2 flex w-full items-center justify-center">
              <Loader2 className="animate-spin text-primary-500" />
            </div>
          )}
        </div>
      </ModalComponent>
    </>
  );
}
