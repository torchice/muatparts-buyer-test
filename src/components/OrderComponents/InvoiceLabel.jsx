import React from "react";

const InvoiceLabel = ({ invoice }) => {
  return (
    <div className="bg-primary-50 text-primary-700 px-2 py-1 rounded-md text-xs font-semibold">
      {invoice}
    </div>
  );
};

export default InvoiceLabel;
