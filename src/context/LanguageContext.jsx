'use client'
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
// 25. 11 - QC Plan - Web - Ronda Live Mei - LB - 0487
import { usePathname, useSearchParams } from "next/navigation";
import { useCustomRouter } from "@/libs/CustomRoute";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const getLangFromStorage = typeof window !== "undefined" ? window.localStorage.getItem("lang") || undefined : false;
  // 25. 11 - QC Plan - Web - Ronda Live Mei - LB - 0487
  const searchParams = useSearchParams()
  const langParams = searchParams.get("lang");
  const router = useCustomRouter()
  const pathName = usePathname()
  const [language, setLanguage] = useState(getLangFromStorage || 'id');
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    if(langParams) {
      if(getLangFromStorage !== langParams && typeof window !== "undefined") {
        window.localStorage.setItem("lang",langParams);
        setLanguage(langParams)
      } 
      // 25. 11 - QC Plan - Web - Ronda Live Mei - LB - 0487
      const updatedParams = new URLSearchParams(searchParams.toString())
      updatedParams.delete("lang")
      router.replace(`${pathName}?${updatedParams.toString()}`)
    } 
  },[])

  useEffect(() => {
  //lb 276,
    async function fetchTranslations() {
      try {
        const envProd = process.env.NEXT_PUBLIC_ENVIRONMENT;
          let url = `${process.env.NEXT_PUBLIC_S3_URL}/content-general/locales/${process.env.NEXT_PUBLIC_ENVIRONMENT}/${language}/common.json`;
        const res = await axios(url,{
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
        setTranslations(res.data);
      } catch (error) {
        console.error("Error fetching translations:", error);
      }
    }
    fetchTranslations();
  }, [language]);

  const t = (key) => {
    return translations[key] || key;
  }

  return (
    <LanguageContext.Provider value={{ t }}>
      {Object.keys(translations).length !== 0 && children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
