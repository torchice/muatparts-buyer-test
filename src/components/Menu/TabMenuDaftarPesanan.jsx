import { Fragment, useRef } from "react";
import { useCustomRouter } from "@/libs/CustomRoute";
import { useSearchParams } from "next/navigation";
const TabMenu = ({ menu,isLoading }) => {
  const router = useCustomRouter();
  const tab = useSearchParams().get("tab") || 1;
  const tabRef = useRef(null);

  const handleSelected = (e, key) => {
    e.preventDefault();
    router.push(`/daftarpesanan?tab=${key.id}`);
  };

  return (
    <div className="w-full flex bg-white" ref={tabRef}>
      {menu.map((key, index) => {
        return (
          <Fragment key={key.id}>
            {index > 0 && <div className="border-l border-l-neutral-400"></div>}
            <div
              className={`flex-grow flex-shrink-0 px-6 sm:px-0 py-1 text-base cursor-pointer mx-1 sm:mx-0 sm:text-sm sm:max-w-[50%] sm:text-center ${
                tab == key.id
                  ? `${isLoading && `!bg-neutral-500 !animate-pulse` } font-bold border-b-primary-700 text-primary-700 border-b-2`
                  : `${isLoading && `!bg-neutral-500 !animate-pulse` } font-semibold text-neutral-900`
              }`}
              onClick={(e) => handleSelected(e, key)}
            >
              {`${isLoading ? "" : `${key.name}  (${key.notif >= 100 ? "99+" : key.notif})`} `}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default TabMenu;
