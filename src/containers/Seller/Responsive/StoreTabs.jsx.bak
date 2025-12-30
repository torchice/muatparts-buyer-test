import { Fragment } from "react";

export default function StoreTabs({ 
    tabs,
    activeTab,
    onTabChange
}) {

    return (
        <div className={`flex overflow-hidden overflow-x-auto flex-col w-full text-sm font-semibold leading-none text-center whitespace-nowrap bg-white min-h-[48px] text-neutral-600`}>
            <div className="flex overflow-hidden flex-col w-full bg-white">
                <div className="flex overflow-hidden flex-col justify-center pt-4 w-full bg-white">
                    <div className="flex gap-1 w-full min-h-[32px]">
                        {tabs.map((tab, index) => (
                            <Fragment key={index}>
                                <button
                                    onClick={() => onTabChange(index)}
                                    className={`flex-1 shrink gap-2.5 self-stretch px-4 py-[11.5px] h-full text-[14px] leading-[15.4px] ${
                                        index === activeTab
                                        ? "font-bold text-[#C22716] border-b-2 border-solid border-b-[#C22716]"
                                        : "font-semibold"
                                    }`}
                                >
                                    {tab}
                                </button>
                                {index < tabs.length - 1 && (
                                    <div className="shrink-0 my-auto w-0 h-5 border border-solid bg-neutral-400 border-neutral-400" />
                                )}
                            </Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}