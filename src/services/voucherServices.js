// 25.11 Ronda Live Mei LB - 0081

import axios from "axios"
import { authZustand } from "@/store/auth/authZustand";

class VoucherServices {
    async claimVoucher(kode) {
        try {
            const url = `${process.env.NEXT_PUBLIC_GLOBAL_API}v1/muatparts/voucher/claim-voucher`
            const response = await axios.post(url, {kode}, {
                headers: {
                    "Authorization":'Bearer '+authZustand.getState()?.accessToken,
                    "refreshToken":authZustand.getState()?.refreshToken,
                    "Content-Type": "application/json",
                },
            });

            return response.data.Message
        } catch (error) {
            return {Text: error?.response?.data?.Data?.Message ?? "Gagal klaim voucher", Code: 500};
        }
    }
}

const voucherServices = new VoucherServices();

export default voucherServices