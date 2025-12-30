import { useEffect, useState } from 'react';
import Modal from '@/components/Modals/modal';
import Input from '@/components/Input/Input';
import IconComponent from '@/components/IconComponent/IconComponent';
import style from "./UpdateEmailModal.module.scss"
import SWRHandler from '@/services/useSWRHook';
import registerForm from '@/store/registerForm';
// import { useSWRConfig } from 'swr';

const UpdateEmailModal = ({ 
  isOpen, 
  setIsOpen,
  setNotification,
  setOtp
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const {
    formData,
    setFormData
  } = registerForm();

  // const { mutate } = useSWRConfig()
  const { useSWRMutateHook } = SWRHandler();
  const { data: dataChangeEmail, trigger: changeEmail, error: errorChangeEmail } = useSWRMutateHook(
    `${process.env.NEXT_PUBLIC_API_HASYIM}v1/register/change_email`,
    "POST"
  );

  useEffect(() => {
    if (dataChangeEmail) {
      console.log("useeffectchangeemail")
      setFormData([{ ...formData[0], email: dataChangeEmail.data.Data.newEmail }, formData[1]])
      setNotification({ type: "success", message: "Berhasil mengubah email" })
      setEmail("")
      setIsOpen(false)
    }
  }, [JSON.stringify(dataChangeEmail)])

  useEffect(() => {
    if (errorChangeEmail) {
      const message = errorChangeEmail.response.data.Data?.Message
      setError(message)
    }
  }, [JSON.stringify(errorChangeEmail)])

  const handleEmailChange = (newEmail) => {
    setEmail(newEmail)
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async() => {
    // Reset error
    setError('');

    // Validate empty email
    if (!email.trim()) {
      setError('Email belum diisi.');
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setError('Penulisan email salah');
      return;
    }

    // Validate if same as current email
    if (email === formData[0].email) {
      setError('Email tidak boleh sama dengan sebelumya');
      return;
    }

    await changeEmail({ OldEmail: formData[0].email, NewEmail: email })
      .then(() => {
        setOtp(new Array(6).fill(""))
      })
      .catch((err) => {
        console.log('err',err)
      })
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setIsOpen(false);
  };

  return (
    <Modal
      isBig
      isOpen={isOpen}
      setIsOpen={handleClose}
      title=""
      action1={{
        text: 'Simpan',
        style: 'full',
        color: '#176CF7',
        action: handleSave,
        customStyle: { marginTop: '24px' }
      }}
    >
      <div className="flex flex-col gap-y-6">
        <span className="font-bold text-[14px] leading-[16.8px] text-center">Ubah Email</span>
        {error ? (
          <div className="rounded-md bg-[#FFE5E5] border-[#F71717] border py-[15px] flex flex-row items-center gap-x-2.5 justify-center">
            <IconComponent
              classname={style.icon_error}
              src="/icons/info.svg"
            />
            <span className="font-semibold text-[12px] leading-[14.4px]">{error}</span>
          </div>
        ) : null}
        <Input
          type="email"
          placeholder="Masukkan email"
          value={email}
          changeEvent={(e) => handleEmailChange(e.target.value)}
          classname={error ? style.input_error : ""}
          icon={{
            left: '/icons/check-yellow.svg'
          }}
        />
      </div>
    </Modal>
  );
};

export default UpdateEmailModal;