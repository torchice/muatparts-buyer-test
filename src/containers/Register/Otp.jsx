import { useState, useEffect } from 'react';
import Image from "next/image";
import OtpInput from "./OtpInput";
import UpdateEmailModal from "./UpdateEmailModal";
import Button from "@/components/Button/Button";
import SWRHandler from '@/services/useSWRHook';
import { useRouter } from 'next/navigation';
import styles from "./Otp.module.scss"
import registerForm from '@/store/registerForm';
import IconComponent from '@/components/IconComponent/IconComponent';
import { useCustomRouter } from '@/libs/CustomRoute';
// import headerZustand from "@/store/zustand/header" // nanti kalo di rdp

const Otp = ({ remainingTime }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [notification, setNotification] = useState(null)

  const {
    formData,
  } = registerForm();

  const router = useCustomRouter()
  // const { setHeader } = headerZustand() // nanti kalo di rdp

  const { useSWRMutateHook } = SWRHandler();
  const { trigger: verifyOtp, error: errorVerifyOtp } = useSWRMutateHook(
    process.env.NEXT_PUBLIC_API_HASYIM + 'v1/register/verify_otp',
  'POST'
  );

  const { data: dataResendOtp, trigger: resendOtp } = useSWRMutateHook(
    process.env.NEXT_PUBLIC_API_HASYIM + 'v1/register/resend_otp',
  'POST'
  );

  const expiresIn = dataResendOtp?.data.Data.expiresIn

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
// nanti kalo di rdp
  // useEffect(() => {
  //   setHeader("")
  // }, [])

  // set error
  useEffect(() => {
    if (errorVerifyOtp) {
      const message = errorVerifyOtp.response.data.Data.Message
      const status = "error"
      setNotification({ message, status })
    }
  }, [JSON.stringify(errorVerifyOtp)])

  useEffect(() => {
    if (remainingTime) {
      setTimeLeft(remainingTime)
      setIsTimerActive(true)
    }
  }, [remainingTime])

  useEffect(() => {
    if (expiresIn) {
      console.log("expires",expiresIn)
      setTimeLeft(expiresIn)
      setIsTimerActive(true)
      setNotification({ type: "success", message: "Berhasil mengirim ulang OTP" })
    }
  }, [expiresIn])

  // Start countdown timer
  useEffect(() => {
    let timerId;
    if (isTimerActive && timeLeft > 0) {
      timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isTimerActive && timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timeLeft, isTimerActive]);

  // Handle OTP completion
  useEffect(() => {
    const handleVerifyOtp = async () => {
      await verifyOtp({ 
        Email: formData[0].email,
        Otp: otp.join(""),
        // Role: 5,
        // SuperMenuID: 6 
      })
        .then(() => {
          // nanti ganti dashboard
          // setHeader(false) nanti di rdp
          router.push("/")
        })
    };

    if (otp.length === 6 && !otp.includes("")) {
      handleVerifyOtp();
    }
  }, [otp, formData[0].email]);

  const handleResendCode = async () => {
    await resendOtp({ Email: formData[0].email })
      .then(() => {
        setOtp(new Array(6).fill(""))
      })
  };

  return (
    <div className="flex min-h-screen bg-primary-700 mt-[-24px]">
      {/* Left meteor */}
      <div className="fixed left-0 top-0">
        <Image
          src="/img/meteor1.png"
          alt="meteor1"
          width={162}
          height={162}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex justify-center items-center">
        <div className="flex flex-col items-center max-w-[444px] w-full gap-y-5">
          {/* Section 1: Logo and Tagline */}
          <div className="flex flex-col items-center w-full text-center text-white">
            <div className="w-[200px] relative">
              <Image
                src="/img/muatmuat.png"
                alt="Brand banner"
                width={200}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-[6px] text-[12px] leading-[14.4px] font-bold">
              Jalan Mudah Bersama
            </div>
          </div>

          {/* Section 2: Verification Image */}
          <div className="w-[92px] relative">
            <Image
              src="/img/verification.png"
              alt="Verification illustration"
              width={92}
              height={92}
              className="object-contain"
              priority
            />
          </div>

          {/* ERROR OR SUCCESS MESSAGE */}
          {notification ? (
            <div className={`
              border py-[15px] px-3 justify-center flex flex-row gap-x-2.5 rounded-md w-[440px]
              ${notification.status === "error" ? "bg-[#FFE5E5] border-[#F71717]" : "bg-[#F1FFEB] border-[#3ECD00]"}
            `}
            >
              <IconComponent
                classname={notification.status === "error" ? styles.icon_error : ""}
                src={notification.status === "error" ? "/icons/info.svg" : "/icons/success-toast.svg"}
              />
              <span className="font-semibold text-[12px] leading-[14.4px]">{notification.message}</span>
            </div>
          ) : null}

          {/* Section 3: Main Form Content */}
          <div className="flex flex-col items-center w-full">
            {/* Email verification message */}
            <div className="text-[16px] leading-[19.2px] font-medium text-center text-white">
              Mohon cek pesan di email Anda
              <br />
              untuk melanjutkan pendaftaran
            </div>

            {/* OTP input section */}
            <div className="flex flex-col items-center mt-6 w-full">
              <div className="flex gap-6 items-center justify-center w-full flex-wrap">
                <div className="flex gap-3 items-center">
                  <div className="text-[14px] leading-[16.8px] font-bold text-white">
                    Kode OTP dikirim ke email
                  </div>
                  <div className="text-[14px] leading-[16.8px] font-semibold text-gray-200 truncate max-w-[112px]">
                    {formData[0].email}
                  </div>
                </div>
                <Button 
                  Class={`!px-3 h-5 min-w-[unset] text-[10px] leading-[12px] font-semibold rounded-xl
                    ${isTimerActive ? "" : "!text-primary-700 !bg-neutral-50"}
                  `}
                  onClick={() => setIsEmailModalOpen(true)}
                  disabled={isTimerActive}
                >
                  Ganti
                </Button>
              </div>

              <div className="flex gap-3 items-center mt-3 justify-center">
                <label className="text-[14px] leading-[16.8px] font-bold text-white w-[102px]">
                  Masukkan OTP
                </label>
                <OtpInput otp={otp} setOtp={setOtp} />
              </div>
            </div>

            {/* Warning message */}
            <div className="px-4 py-3 mt-6 text-[12px] leading-[14.4px] font-medium text-center text-black bg-orange-200 rounded-md max-w-[319px]">
              Jika pesan OTP tidak ditemukan mohon periksa
              <br />
              folder <span className="font-bold">spam</span>,{" "}
              <span className="font-bold">sosial</span>, atau{" "}
              <span className="font-bold">promosi</span> pada email Anda.
            </div>

            {/* Timer message */}
            <div className="mt-6 text-[16px] leading-[19.2px] font-medium text-center text-white">
              Kode OTP aktivasi akan berakhir dalam{" "}
              <span className="font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Resend button */}
          <Button
            name="resend"
            color={isTimerActive ? 'primary_secondary' : 'warning'}
            onClick={handleResendCode}
            disabled={isTimerActive}
            Class="mt-[10px] w-full max-w-[319px]"
          >
            Kirim Ulang
          </Button>
        </div>
      </div>

      {/* Right meteor */}
      <div className="fixed right-0 bottom-0">
        <Image
          src="/img/meteor2.png"
          alt="meteor2"
          width={162}
          height={162}
        />
      </div>

      {/* Email Update Modal */}
      <UpdateEmailModal 
        isOpen={isEmailModalOpen}
        setIsOpen={setIsEmailModalOpen}
        setNotification={setNotification}
        setOtp={setOtp}
      />
    </div>
  );
};
  
export default Otp;