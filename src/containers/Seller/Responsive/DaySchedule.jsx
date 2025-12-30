import { useLanguage } from "@/context/LanguageContext";

export function DaySchedule({ className, day, type, openTime, closeTime }) {
  const { t } = useLanguage();
    const days = [
      t("labelMonday"),
      t("labelTuesday"),
      t("labelWednesday"),
      t("labelThursday"),
      t("labelFriday"),
      t("labelSaturday"),
      t("labelSunday")
    ]
  return (
    <div className={`flex flex-col w-full ${className}`}>
      <div className="flex flex-col justify-center w-full">
        <div className="flex gap-3 items-start w-full font-medium text-[14px] leading-[15.4px]">
          <div className="w-20">{days[Number(day)-1]}</div>
          <div>
            {type === "closed" ? t("labelClosed") : null}
            {type === "24h" ? t("labelOpen24") : null}
            {type === "custom" ? `${openTime} - ${closeTime} WIB` : null}
          </div>
        </div>
      </div>
    </div>
  );
}