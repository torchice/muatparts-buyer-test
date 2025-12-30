import axios from "axios";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import ConfigUrl from "./baseConfig";
import { authZustand } from "@/store/auth/authZustand";
import { userZustand } from "@/store/auth/userZustand";
import { useSearchParams } from "next/navigation";

function SWRHandler() {
  const { get, post, put, deleted } = ConfigUrl();
  // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0718
  const getLang = useSearchParams()
  async function defaultFetcherGet(url, option) {
    if (!url) return false;
    return get({ path: url, options: option }).then((res) => res.data);
  }

  function useSWRHook(url, customFetch, cbError, option, ...props) {
    const fetcher = customFetch
      ? (url) => customFetch(url, option)
      : (url) => defaultFetcherGet(url, option);
    const result = useSWR(url, fetcher, {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onError: (err) => {
        // this.interceptor = err?.status;
        if (cbError) cbError(err);
        if (err.status === 401 || err.status === 403) {
          authZustand.getState().clearToken('use swr mutation error');
          userZustand.getState().removeUser();
        }
        // imp_undermaintenance_uat
        if(err.status === 503 && window){
          window.location.replace(process.env.NEXT_PUBLIC_INTERNAL_WEB + "sistem");
        }
        if (props) props
      },
    });
    return result;
  }

  function useSWRMutateHook(url, method, customFetcher, cbError,headers) {
    const result = useSWRMutation(
      url,
      (url, { arg }) => {
        if (customFetcher) {
          return customFetcher(url, arg);
        } else {
          if(method==='put'||method==='PUT') return put({path:url,data:arg})
          if(method==='delete'||method==='DELETE') { return deleted({path:url,options:arg})}
          return axios({
            data:arg,
            url:url,
            method:method?method:'post',
            headers:{
              "Authorization":'Bearer '+authZustand.getState()?.accessToken,
              "refreshToken":authZustand.getState()?.refreshToken,
              "languageid":getLang.get('lang') || localStorage.getItem('lang') ||'id',
              "platform":"web",
              "loginas":"buyer",
              ...headers
            },
          });
        }
      },
      {
        onError: (err) => {
          if (cbError) cbError(err);
          else {
            if (err.status === 401 || err.status === 403) {
              authZustand.getState().clearToken('use swr mutation error');
              userZustand.getState().removeUser();
            }
            if(err.status === 503 && window){
              window.location.replace(process.env.NEXT_PUBLIC_INTERNAL_WEB + "sistem");
            }
          }
        },
      }
    );
    return result;
  }
  return {
    useSWRHook,
    useSWRMutateHook,
  };
}

export default SWRHandler;
