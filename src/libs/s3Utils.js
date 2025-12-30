import { create } from 'zustand';
// import AWS from 'aws-sdk';

// const s3 = new AWS.S3({
//   region: process.env.AWS_REGION,
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

const useTranslationStore = create((set) => ({
  translations: {},
  lang: 'id',
  setLang: (newLang) => set({ lang: newLang }),
  setTranslations: (data) => set({ translations: data }),
  fetchTranslations: async (locale) => {
    const envProd = process.env.NEXT_PUBLIC_ENVIRONMENT;
    const url = `https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/locales/${envProd}/${locale}/common.json`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${locale} translations`);
      const data = await response.json();
      set({ translations: data });
      return data;
    } catch (error) {
      console.error(`Error fetching ${locale} translations:`, error);
      return {};
    }
  }
}));

export async function fetchTranslations(locale) {

  const envProd = process.env.NEXT_PUBLIC_ENVIRONMENT;

  const url = `https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/locales/${envProd}/${locale}/common.json`;

  console.log("tryURL",url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${locale} translations`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${locale} translations:`, error);
    return {}; // Return empty object if fetching fails
  }
}

export default useTranslationStore;