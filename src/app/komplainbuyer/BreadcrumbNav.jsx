import React from "react";

export const BreadcrumbNav = () => {
  return (
    <nav className="flex min-h-4 w-full items-center gap-[5px] text-xs text-black font-medium">
      <div className="self-stretch flex min-w-60 w-[662px] items-center gap-[5px] flex-wrap my-auto">
        <span className="AvenirNormal12px Color7B7B7B self-stretch my-auto">Daftar Pesanan</span>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/aa96d47395c849d89aef11b76aadbd1487b01b986404063ae4c17a86d291a247?placeholderIfAbsent=true"
          className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
          alt=""
        />
        <span className="AvenirNormal12px Color7B7B7B self-stretch my-auto">Pesanan Tiba</span>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/60cdcdaf919148d9b5b739827a6f5b2a/aa96d47395c849d89aef11b76aadbd1487b01b986404063ae4c17a86d291a247?placeholderIfAbsent=true"
          className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
          alt=""
        />
        <span className="AvenirDemi12px Color176CF7 font-semibold self-stretch my-auto">
          Pengajuan Komplain
        </span>
      </div>
    </nav>
  );
};