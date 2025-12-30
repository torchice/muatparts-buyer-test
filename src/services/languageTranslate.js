import { useEffect } from 'react';
import useTranslationStore from '../libs/s3Utils';
import { useSearchParams } from 'next/navigation';

export const useTranslation = () => {
    const searchParams = useSearchParams();
    const { translations,lang,setLang, fetchTranslations} = useTranslationStore();

    useEffect(() => {
      const urlLang = searchParams.get('lang') || 'id';
      if(urlLang !== lang || Object.keys(translations).length === 0) {
        setLang(urlLang);
        fetchTranslations(urlLang)
      }
    }, [searchParams])
    
    const t = (key) => translations[key] || key;

    return { t,lang }
}