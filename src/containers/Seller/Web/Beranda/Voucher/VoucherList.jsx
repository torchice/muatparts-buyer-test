import VoucherSlider from "./VoucherSlider";

function VoucherList({ sellerVouchers, setSelectedVoucher, setIsVoucherDetailModalOpen, onRefreshVoucher }) {
  return (
    <div className="w-full mt-4">
      <VoucherSlider 
        sellerVouchers={sellerVouchers}
        setSelectedVoucher={setSelectedVoucher}
        setIsVoucherDetailModalOpen={setIsVoucherDetailModalOpen}
        onRefreshVoucher={onRefreshVoucher}
      />
    </div>
  );
}

export default VoucherList;