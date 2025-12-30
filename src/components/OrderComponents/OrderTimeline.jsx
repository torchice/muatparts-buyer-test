import * as React from "react";
import TimelineItem from "./TimelineItem.jsx";

export default function OrderTimeline({ trackingHistory }) {
  return (
    <div className="flex flex-col w-full bg-white rounded-xl">
      <div className="flex flex-col w-full space-y-5">
        {trackingHistory?.map((item, index) => (
          <TimelineItem
            key={index}
            status={item.status}
            timestamp={item.timestamp}
            description={item.description}
            proofUrl={item.proofUrl}
            isActive={index === 0}
            isLast={index === trackingHistory.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
