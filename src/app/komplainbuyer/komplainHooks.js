import SWRHandler from "@/services/useSWRHook";

export const useAlasanKomplain = () => {
  const { useSWRHook } = SWRHandler();
  const { data, error, isLoading } = useSWRHook('/v1/muatparts/buyer/complaints-reasons');

  return {
    alasanKomplain: data?.Data || [],
    isLoading,
    error
  };
};

export const useSolusiKomplain = (reasonId) => {
  const { useSWRHook } = SWRHandler();
  const { data, error, isLoading } = useSWRHook(
    reasonId ? `/v1/muatparts/buyer/complaints-solutions?reasonID=${reasonId}` : null
  );

  return {
    solusiKomplain: data?.Data || [],
    isLoading,
    error
  };
};

export const useDaftarKomplain = (params = {}) => {
  const { useSWRHook } = SWRHandler();
  
  const queryString = new URLSearchParams({
    page: params.page || 1,
    limit: params.limit || 10,
    ...(params.status && { status: params.status }),
    ...(params.search && { search: params.search }),
    ...(params.startDate && { startDate: params.startDate }),
    ...(params.endDate && { endDate: params.endDate }),
    ...(params.sort && { sort: params.sort })
  }).toString();

  const { data, error, isLoading, mutate } = useSWRHook(
    `/v1/muatparts/buyer/complaints?${queryString}`
  );

  return {
    daftarKomplain: data?.Data?.complaints || [],
    pagination: data?.Data?.pagination,
    isLoading,
    error,
    mutate
  };
};

export const useDetailKomplain = (complaintId) => {
  const { useSWRHook } = SWRHandler();
  const { data, error, isLoading, mutate } = useSWRHook(
    complaintId ? `/v1/muatparts/buyer/complaints/${complaintId}` : null
  );

  return {
    detailKomplain: data?.Data,
    isLoading,
    error,
    mutate
  };
};