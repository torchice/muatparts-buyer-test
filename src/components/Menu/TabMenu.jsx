import { Fragment, useRef, useEffect } from "react";
import menuZus from "@/store/menu";
import { useCustomRouter } from "@/libs/CustomRoute";
import { viewport } from "@/store/viewport";

/**
 * TabMenu component renders a tabbed menu interface with auto-selection of first tab.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.menu - An array of menu items, each containing an id, name, and optional notif.
 * @param {Function} props.onclick - A callback function to be called when a tab is clicked.
 *
 * @returns {JSX.Element} The rendered TabMenu component.
 */
const TabMenu = ({ menu, onclick, type }) => {
  const router = useCustomRouter();
  const { setMenuZ, menuZ } = menuZus();
  const tabRef = useRef(null);

  useEffect(() => {
    if (menu.length > 0 && !menuZ?.value) {
      setMenuZ({ id: menu[0].id, value: menu[0].name });
      onclick();
    }
  }, [menu, menuZ?.value, setMenuZ, onclick]);

  const handleSelected = (e, key) => {
    e.preventDefault();
    setMenuZ({ id: key.id, value: key.name });
    // tabRef.current.scrollIntoView({ behavior: "smooth" });
    // router.push(`?tab=${key.id}`);
    onclick();
  };

  const { isMobile } = viewport();

  return (
    <div className={`${isMobile ? "w-full" : "w-[386px]"} flex bg-white`} ref={tabRef}>
      {menu.map((key, index) => {
        return (
          <Fragment key={key.id}>
            {index > 0 && <div className="border-l border-l-neutral-400"></div>}
            <div
              className={`flex-grow flex-shrink-0 px-6 sm:px-0 py-1 text-base cursor-pointer mx-1 sm:mx-0 sm:text-sm sm:max-w-[50%] sm:text-center ${
                menuZ?.value === key.name
                  ? `font-bold ${
                      type === "buyer"
                        ? "border-b-[#176CF7] text-[#176CF7]"
                        : "border-b-primary-700 text-primary-700"
                    } border-b-2`
                  : "font-semibold text-neutral-900"
              }`}
              onClick={(e) => handleSelected(e, key)}
            >
              {`${key.name} (${key.notif >= 100 ? "99+" : key.notif})`}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default TabMenu;
