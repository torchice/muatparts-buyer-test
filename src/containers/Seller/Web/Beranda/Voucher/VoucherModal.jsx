import styles from "./VoucherModal.module.scss"
import IconComponent from '@/components/IconComponent/IconComponent';
import { useParams } from 'next/navigation';
import SWRHandler from '@/services/useSWRHook';
// FIX BUG Pengecekan Ronda Muatparts LB-0065
import VoucherCard from '@/containers/Seller/Component/VoucherCard';

const VoucherModal = ({ isOpen, setIsOpen, sellerProfile, setSelectedVoucher, setIsVoucherDetailModalOpen }) => {
  const params = useParams()

  const { useSWRHook } = SWRHandler();
  const { data: dataAllSellerVoucher, isLoading: isLoadingAllSellerVoucher, mutate: mutateAllSellerVoucher } = useSWRHook(
    // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0206
    `v1/muatparts/voucher-buyer/${params.id}?page=1&page_size=100&target=Publik&status=Aktif&list_type=seller`,
  );

  const allSellerVouchers = dataAllSellerVoucher?.Data ? dataAllSellerVoucher.Data : []

  const handleSelectVoucher = voucher => {
		setSelectedVoucher(voucher);
		setIsVoucherDetailModalOpen(true);
	};

  const handleRefreshVoucher = () => mutateAllSellerVoucher();

  return (
    <div className={`fixed inset-0 z-[90] flex items-center justify-center ${!isOpen ? "hidden" : "block"}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl px-6 py-8 flex flex-col gap-y-4 items-center">
        {/* Header */}
        <button
          className='absolute top-[8px] right-[9px]'
          onClick={() => setIsOpen(false)}
        >
          <IconComponent
            classname={styles.icon_primary}
            src="/icons/silang.svg"
          />
        </button>
        <span className="font-bold text-[16px] leading-[19.2px]">
          {`Pilih Voucher ${sellerProfile?.name}`}
        </span>

        {/* Content */}
        <div className="flex flex-col gap-y-3 overflow-y-auto overflow-x-hidden pr-[11px] max-h-[412px]">
          {allSellerVouchers.length === 0 ? (
            <div className="p-8 text-center text-neutral-600">
              Tidak ada voucher tersedia
            </div>
          ) : (
            allSellerVouchers.map((item, key) => {
              const voucher = {
                ...item,
                // LBM - OLIVER - FIX PENGGUNAAN PROPERTY DARI API VOUCHER - MP - 020
                usageCount: Number(item.usageCount),
                usageQuota: item.usage_quota,
              }
              return (
                // 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0355
                <div className="w-[424px]" key={key}>
                  <VoucherCard
                    voucher={voucher}
                    onClickDetail={handleSelectVoucher}
                    onRefreshVoucher={handleRefreshVoucher}
                  />
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default VoucherModal;