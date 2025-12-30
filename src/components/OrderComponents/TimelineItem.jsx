import { formatDate } from "@/libs/DateFormat";
import * as React from "react";

export default function TimelineItem({
  status,
  timestamp,
  description,
  isActive,
  proofUrl,
  isLast,
}) {
  return (
    <div className="flex gap-3 items-start w-full relative">
      {!isLast && (
        <div
          className="absolute border-dashed border border-neutral-400"
          style={{
            height: "calc(100% + 4px)",
            top: "16px",
            left: "7px",
          }}
        />
      )}
      <div className="flex flex-col items-center">
        <div
          className={`flex overflow-hidden flex-col justify-center items-center px-1 w-4 h-4 ${
            isActive ? "bg-muat-parts-non-800" : "bg-neutral-600"
          } rounded-[90px]`}
        >
          <div className="flex shrink-0 w-1.5 h-1.5 bg-neutral-50 rounded-[90px]" />
        </div>
      </div>
      <div className="flex flex-col flex-1 shrink justify-center items-start text-xs font-medium leading-tight basis-0 min-w-[240px] space-y-1">
        <div
          className={`font-semibold text-center ${
            isActive ? "text-blue-600" : "text-black"
          }`}
        >
          {status}
        </div>
        {/* 24. THP 2 - MOD001 - MP - 035 - QC Plan - Web - MuatParts - General - Daftar Pesanan LB - 0033 */}
        <div className={`text-center text-neutral-600`}>{formatDate(timestamp)}</div>
        {description && (
          <div
            className={`${
              proofUrl ? "text-blue-600 cursor-pointer" : "text-neutral-600"
            } self-stretch`}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );
}
