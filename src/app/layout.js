import localFont from "next/font/local";
import "./globals.scss";
import App from "@/common/App";
import { Suspense } from "react";
import Head from "next/head";
import GlobalLoading from "@/components/GlobalLoading/GlobalLoading";
import { LanguageProvider } from "@/context/LanguageContext";
import Toast from "@/components/Toast/Toast";
import AlbumWishlist from "@/components/AlbumWishist/AlbumWishlist";

const AvenirNextLTPro = localFont({
  src: [
    {
      path: "../fonts/AvenirNextLTPro-Bold.otf",
      weight: "700",
      style: "bolder",
    },
    {
      path: "../fonts/AvenirNextLTPro-Demi.otf",
      weight: "600",
      style: "bold",
    },
    {
      path: "../fonts/AvenirNextLTPro-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/AvenirNextLTPro-Regular.otf",
      weight: "400",
      style: "lighter",
    },
  ],
});

export const metadata = {
  title: "Muatparts Buyer",
  description: "",
  icons: {
    icon: "https://buyer.muatmuat.com/_resources/themes/muat/image/icon/icon-01.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <Head> */}
      {/* <link rel="icon" href={"/favicon.png"} /> */}
      {/* </Head> */}
      <body className={`${AvenirNextLTPro.className} antialiased`}>
        <Suspense fallback={<GlobalLoading />}>
          <LanguageProvider>
            <App>
              <AlbumWishlist />
              {children}
              <Toast />
            </App>
          </LanguageProvider>
        </Suspense>
      </body>
    </html>
  );
}
