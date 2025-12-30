export default function TermsAndConditions() {
  const terms = [
    "Dapatkan diskon 50% sampai dengan Rp100.000",
    "Voucher tidak berlaku untuk produk Flashsale Kasih Murah",
    "Berlaku di Toko: Official Store, Power Merchant, dan Power Merchant Pro",
    "Minimum belanja Rp200.000 di luar pemakaian GoPay Coins (tidak termasuk ongkos kirim)",
    "Pembayaran yang berlaku: GoPay",
    "1 voucher berlaku untuk 2 kali transaksi selama periode voucher",
    "Voucher tidak dapat digunakan untuk produk Muatparts",
    "Voucher berlaku di aplikasi Muatparts berbasis iOS dan/atau Android versi terbaru",
    "Voucher dapat digunakan bersamaan dengan kurir Bebas Ongkir dan/atau kurir GoTo Plus, kecuali diatur lain sebagaimana kebijakan Tokopedia",
    "Voucher dapat digunakan bersamaan dengan kurir Bebas Ongkir dan/atau kurir GoTo Plus, kecuali diatur lain sebagaimana kebijakan Muatparts",
    "Untuk menggunakan voucher ini, pengguna wajib sudah menghubungkan akun GoPay melalui halaman ini."
  ];

  return (
    <div className="flex flex-col mt-4 w-full h-[262px] gap-y-[15px]">
      <div className="flex-1 shrink gap-2 self-stretch w-full font-semibold text-[14px] leading-[16.8px] text-ellipsis">
        Syarat Dan Ketentuan
      </div>
      <div className="w-full">
        <ol className="list-decimal list-inside">
          {terms.map((term, index) => (
            <li className="text-[14px] leading-[16.8px]" key={index}>
              {index === terms.length - 1 ? (
                <>
                  Untuk menggunakan voucher ini, pengguna wajib sudah menghubungkan akun GoPay melalui
                  <a href="https://www.tokopedia.com/gopay" target="_blank" rel="noopener noreferrer" className="text-blue-600">
                    {" "}halaman ini
                  </a>
                  .
                </>
              ) : (
                term
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}