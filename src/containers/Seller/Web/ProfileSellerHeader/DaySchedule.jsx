import { useLanguage } from "@/context/LanguageContext";

const DaySchedule = ({ day, type, openTime, closeTime }) => {
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
    <div className="flex justify-between items-center h-10 w-[290px] font-medium text-[12px] leading-[14.4px]">
      <span>
        {days[Number(day)-1]}
      </span>
      <span>
        {type === "closed" ? t("labelClosed") : null}
        {type === "24h" ? t("labelOpen24") : null}
        {type === "custom" ? `${openTime} - ${closeTime} WIB` : null}
      </span>
    </div>
  );
}

export default DaySchedule