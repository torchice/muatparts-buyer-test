import propTypes from "prop-types";
import Button from "@/components/Button/Button";

const NavSelectedMobile = ({ classname, label, children, onclick }) => {
  return (
    <div
    // box shadow: 0px -3px 55px 0px #00000029
      className={`w-full h-fit py-3 px-4 bg-white fixed bottom-0 shadow-muat rounded-t-[10px] z-10 ${classname}`}
    >
      {children ?? (
        <Button Class="w-full min-w-full" onClick={onclick}>
          {label ?? "Selanjutnya"}
        </Button>
      )}
    </div>
  );
};

NavSelectedMobile.propTypes = {
  classname: propTypes.string,
  label: propTypes.string,
  onclick: propTypes.func,
};

export default NavSelectedMobile;
