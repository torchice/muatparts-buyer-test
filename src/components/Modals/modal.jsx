import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  useClose,
} from "@headlessui/react";
import styles from "./modal.module.scss";
import Image from "next/image";
import modalClose from "./assets/modalClose.svg";
import closeRed from "./assets/closeRed.svg";

export default function Modal({
  isOpen,
  setIsOpen,
  isBig = false,
  closeArea = true,
  closeBtn = true,
  title = "",
  desc = "",
  action1 = {
    action: () => {},
    text: "",
    style: "full" || "outline",
    color: "",
    customStyle: {},
    class: "",
  },
  action2 = {
    action: () => {},
    text: "",
    style: "full" || "outline",
    color: "",
    customStyle: {},
    class: "",
  },
  children,
}) {
  let close = useClose();

  const closeModal = () => {
    close();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={closeArea ? setIsOpen : () => {}}
      transition
      className="z-[999] fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0"
    >
      <div
        className="fixed inset-0 flex w-screen items-center justify-center p-4"
        onClick={closeModal}
      >
        <DialogPanel
          className={`max-w-lg relative ${
            isBig ? styles["modal-apps-az-big"] : styles["modal-apps-az-small"]
          }`}
        >
          <div
            className={`${styles["modal-apps-az-header"]} ${
              isBig
                ? styles["modal-apps-az-header-big"]
                : styles["modal-apps-az-header-small"]
            } p-[8px] justify-end items-start rounded-t-[10px]`}
          >
            {closeBtn && (
              <button
                className="w-[20px] h-[20px] bg-[#FFFFFF] rounded-[50px] p-[6px]"
                onClick={() => setIsOpen(false)}
              >
                <Image src={closeRed} alt={"modal close header"} />
              </button>
            )}
          </div>
          <div
            className={`${styles["modal-apps-az"]} ${
              isBig
                ? styles["modal-apps-az-big"]
                : styles["modal-apps-az-small"]
            }`}
          >
            {closeBtn && (
              <>
                <div
                  className={`absolute right-[8px] top-[8px] ${styles["modal-apps-az-mobile"]}`}
                >
                  <button
                    className="w-[24px] h-[24px]"
                    onClick={() => setIsOpen(false)}
                  >
                    <Image src={modalClose} alt={"modal close"} />
                  </button>
                </div>
              </>
            )}
            {children}
            <div
              className={`flex justify-center flex-col items-center ${styles["modal-apps-az-contentGap"]}`}
            >
              {title && (
                <span
                  className={
                    "font-[700] text-[16px] leading-[19.2px] text-[#000000] text-center"
                  }
                >
                  {title}
                </span>
              )}
              {desc && (
                <span
                  className={
                    "font-[500] text-[14px] leading-[16.8px] text-[#000000] text-center"
                  }
                >
                  {desc}
                </span>
              )}
              <div className={"flex gap-[8px] justify-center"}>
                {action1.text && (
                  <button
                    className={
                      action1.style === "full"
                        ? `${styles["modal-apps-az-btn-full"]} ${action1.class}`
                        : `${styles["modal-apps-az-btn-outline"]} ${action1.class}`
                    }
                    style={
                      action1.style === "full"
                        ? {
                            backgroundColor: action1.color,
                            ...action1.customStyle,
                          }
                        : {
                            color: action1.color,
                            border: `1px solid ${action1.color}`,
                            ...action1.customStyle,
                          }
                    }
                    onClick={action1.action}
                  >
                    {action1.text}
                  </button>
                )}
                {action2.text && (
                  <button
                    className={
                      action2.style === "full"
                        ? `${styles["modal-apps-az-btn-full"]} ${action2.class}`
                        : `${styles["modal-apps-az-btn-outline"]} ${action2.class}`
                    }
                    style={
                      action2.style === "full"
                        ? {
                            backgroundColor: action2.color,
                            ...action2.customStyle,
                          }
                        : {
                            color: action2.color,
                            border: `1px solid ${action2.color}`,
                            ...action2.customStyle,
                          }
                    }
                    onClick={action2.action}
                  >
                    {action2.text}
                  </button>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
