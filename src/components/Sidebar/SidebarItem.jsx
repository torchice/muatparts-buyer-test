import { useRouter, usePathname } from "next/navigation";
import IconComponent from "../IconComponent/IconComponent";
import { useCustomRouter } from "@/libs/CustomRoute";

const activePaths = {
  "/album": "/album",
  "/voucher": "/voucher",
  // Add more paths here as needed
};


// 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0217
function normalizePath(path) {
  return path.startsWith("/muatparts") ? path.replace("/muatparts", "") : path;
}

function isActivePath(pathname, url) {
  const normalizedPathname = normalizePath(pathname);
  return (
    normalizedPathname === url ||
    (activePaths[url] && normalizedPathname.startsWith(activePaths[url]))
  );
}

export function SidebarItem({ icon, label, url }) {
  const router = useCustomRouter();
  const pathname = usePathname();
  const isActive = isActivePath(pathname, url);

  return (
    <div
      className={`flex gap-2 items-center p-3 w-full bg-white relative hover:bg-gray-100 cursor-pointer rounded-lg ${
        isActive ? "text-muat-parts-non-800" : ""
      }`}
      onClick={() => router.push(url)}
    >
      <IconComponent
        src={icon}
        classname={"w-4 h-4"}
        size={16}
        color={isActive ? "active" : ""}
        width={16}
      />
      <div className="flex-1 shrink self-stretch my-auto basis-0 text-xs font-semibold leading-tight">
        {label}
      </div>
      {isActive && (
        <div className="flex absolute bottom-0 left-0 z-0 shrink-0 self-start w-1 h-10 bg-muat-parts-non-800 rounded-r-sm" />
      )}
    </div>
  );
}
