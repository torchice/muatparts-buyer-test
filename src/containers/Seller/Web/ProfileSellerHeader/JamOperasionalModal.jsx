import { Fragment } from "react";
import DaySchedule from "./DaySchedule";
import IconComponent from "@/components/IconComponent/IconComponent";
import styles from "./JamOperasionalModal.module.scss"

const JamOperasionalModal = ({ isOpen, setIsOpen, schedules }) => {
  const defaultSchedules = [
    { day: "1", type: "24h" },
    { day: "2", type: "24h" },
    { day: "3", type: "24h" },
    { day: "4", type: "24h" },
    { day: "5", type: "24h" },
    { day: "6", type: "24h" },
    { day: "7", type: "24h" }
  ]
  const displaySchedules = !schedules || schedules.length === 0 ? defaultSchedules : schedules
  return (
    <div className={`fixed inset-0 z-[90] flex items-center justify-center ${!isOpen ? "hidden" : "block"}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
      />
      {/* Modal */}
      <div className="relative bg-white rounded-xl py-6 w-[386px] flex flex-col shadow-muat gap-y-4 items-center">
        {/* Header */}
        <button
            className="absolute top-[8px] right-[9px]"
            onClick={() => setIsOpen(false)}
        >
            <IconComponent
            classname={styles.icon_primary}
            src="/icons/silang.svg"
            />
        </button>
        <div className="flex flex-col rounded-xl items-center">
          <div className="font-bold text-[16px] leading-[19.2px]">
              Jam Operasional
          </div>
          <div className="flex flex-col justify-center py-3 px-6 mt-3 w-full rounded-xl border border-neutral-400">
              <div className="flex flex-col w-full">
              {displaySchedules.map((schedule, key) => (
                  <Fragment key={key}>
                      <DaySchedule
                        {...schedule}
                      />
                  </Fragment>
              ))}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JamOperasionalModal;