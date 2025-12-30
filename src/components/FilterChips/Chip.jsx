import { X } from "lucide-react";
import * as React from "react";

function Chip({ label, onRemove }) {
  return (
    <div className="flex gap-1 items-center self-stretch px-3 py-[6px] my-auto bg-white rounded-2xl border border-blue-600 w-fit whitespace-nowrap h-7">
      <div className="flex-1 shrink self-stretch my-auto basis-0 text-ellipsis">
        {label}
      </div>
      <button
        onClick={onRemove}
        className="focus:outline-none"
        aria-label={`Remove ${label} filter`}
      >
        <X width={14} />
      </button>
    </div>
  );
}

export default Chip;
