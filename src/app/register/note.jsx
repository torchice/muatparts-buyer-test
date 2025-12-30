import React, { useEffect } from "react";
import { useHeader } from "@/common/ResponsiveContext";

function RegisterResponsive() {
  const {
    appBarType, //pilih salah satu : 'titleSecondary' || 'searchSecondary' || 'navbarMobileDefaultScreen' || 'search' || 'title'
    appBar, // muncul ini : {onBack:null,title:'',showBackButton:true,appBarType:'',appBar:null,header:null}
    renderAppBarMobile, // untuk render komponen header mobile dengan memasukkanya ke useEffect atau by trigger function / closer
    setAppBar, // tambahkan payload seperti ini setAppBar({onBack:()=>setScreen('namaScreen'),title:'Title header',appBarType:'type'})
    handleBack, // dipanggil di dalam button di luar header, guna untuk kembali ke screen sebelumnya
    clearScreen, // reset appBar
    setScreen, // set screen
    screen, // get screen,
    search, // {placeholder:'muatparts',value:'',type:'text'}
    setSearch, // tambahkan payload seperti ini {placeholder:'Pencarian',value:'',type:'text'}
  } = useHeader();

  useEffect(() => {
    if (screen === "example2") {
      setAppBar({
        title: "Example 2",
        appBarType: "search",
        onBack: () => {
          setScreen("example");
          setAppBar({
            title: "Example",
            appBarType: "title",
            onBack: () => clearScreen(),
          });
        },
      });
      setSearch({
        placeholder: "Pencarian Example 2",
      });
    }
    if (screen === "example3") {
      setAppBar({
        title: "Example 3",
        appBarType: "titleSecondary",
        onBack: () => setScreen("example2"),
      });
    }
    if (screen === "example4") {
      setAppBar({
        title: "Example 4",
        appBarType: "searchSecondary",
        onBack: () => setScreen("example3"),
      });
      setSearch({
        placeholder: "Pencarian Example 4",
      });
    }
  }, [screen]);

  if (screen === "example")
    return (
      <div className=" flex flex-col">
        <p>Example</p>
        <button
          className="bg-primary-600"
          onClick={() => {
            setScreen("example2");
          }}
        >
          Go to Example 2
        </button>
      </div>
    );
  if (screen === "example2")
    return (
      <div className=" flex flex-col">
        <p>Example 2</p>
        <button
          className="bg-primary-600"
          onClick={() => setScreen("example3")}
        >
          Go to Example 3
        </button>
      </div>
    );
  if (screen === "example3")
    return (
      <div className=" flex flex-col">
        <p>Example 3</p>
        <button
          className="bg-primary-600"
          onClick={() => setScreen("example4")}
        >
          Go to Example 4
        </button>
      </div>
    );
  if (screen === "example4")
    return (
      <div className=" flex flex-col">
        <p>Example 4</p>
      </div>
    );

  return (
    <div>
      <button
        className="bg-primary-600"
        onClick={() => {
          setScreen("example");
          setAppBar({
            title: "Example",
            appBarType: "title",
            onBack: () => clearScreen(),
          });
        }}
      >
        To example Screen
      </button>
      <p>register Responsive</p>
    </div>
  );
}

export default RegisterResponsive;
