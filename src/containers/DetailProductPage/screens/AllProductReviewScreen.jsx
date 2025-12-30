// FIX BUG Pengecekan Ronda Muatparts LB-0089
import IconComponent from "@/components/IconComponent/IconComponent"
import ReviewCardResponsive from "../ReviewCardResponsive"
import { useLanguage } from "@/context/LanguageContext";
import Bottomsheet from "@/components/Bottomsheet/Bottomsheet";
import toast from "@/store/toast";
import { useHeader } from "@/common/ResponsiveContext";
import RadioButton from "@/components/Radio/RadioButton";

const AllProductReviewScreen = ({
    reviews,
    filter,
    setFilter,
    setTempRating
}) => {
    const { t } = useLanguage();
    const {
        setShowBottomsheet,
        setTitleBottomsheet,
        setDataBottomsheet,
        titleBottomsheet
    } = toast();
    const { setAppBar, setScreen } = useHeader();

    const handleSortSelect = (value) => () => {
        setFilter(prevState => ({ ...prevState, sort: value }))
        renderSortBottomsheet(value)
    }

    const renderSortBottomsheet = (currentSort) => {
        setDataBottomsheet(
            <div className="flex flex-col gap-y-3">
                <span className="font-bold text-[14px] leading-[15.4px]">
                    {t("buttonReviews")}
                </span>
                <RadioButton
                    label={t("labelNewest")}
                    name="newest"
                    checked={currentSort === "newest"}
                    onClick={handleSortSelect("newest")}
                />
                <RadioButton
                    label={t("labelOldest")}
                    name="oldest"
                    checked={currentSort === "oldest"}
                    onClick={handleSortSelect("oldest")}
                />
                <RadioButton
                    label={t("labelHighest")}
                    name="highest"
                    checked={currentSort === "highest"}
                    onClick={handleSortSelect("highest")}
                />
                <RadioButton
                    label={t("labelLowest")}
                    name="lowest"
                    checked={currentSort === "lowest"}
                    onClick={handleSortSelect("lowest")}
                />
            </div>
        )
    }

    const handleOpenBottomsheet = () => {
        setShowBottomsheet(true)
        setTitleBottomsheet(t("labelSort"))
        renderSortBottomsheet(filter.sort)
    }

    const handleOpenFilter = () => {
        setTempRating(filter.rating)
        setScreen('filter')
    }
    return (
        <>
            <div className="flex flex-col gap-y-2 bg-neutral-200 text-neutral-900">
                <div className="bg-neutral-50 p-4 flex flex-col gap-y-4">
                    <div className="pl-3 flex items-center gap-x-3">
                        <IconComponent
                            src="/icons/star.svg"
                            size="large"
                        />
                        <div className="flex items-center">
                            <div className="flex flex-col gap-y-2 pr-[44.5px] border-r border-r-neutral-400">
                                <span className="font-bold text-[16px] leading-[17.6px]">
                                    4,9<span className="font-medium text-[12px] leading-[13.2px] text-neutral-600">/5</span>
                                </span>
                                <span className="font-medium text-[12px] leading-[13.2px]">
                                    Penilaian Toko
                                </span>
                            </div>
                            <div className="flex flex-col gap-y-2 pl-[44.5px]">
                                <span className="font-bold text-[16px] leading-[17.6px]">
                                    3,000
                                </span>
                                <span className="font-medium text-[12px] leading-[13.2px]">
                                    Ulasan Diberikan
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-x-1 items-center text-neutral-900">
                        <button
                            className={`flex gap-x-2 items-center px-3 h-[30px] rounded-3xl border border-solid w-fit
                                ${filter.rating.length > 0 ? "text-primary-700 border-primary-700 bg-primary-50" : "bg-neutral-200 border-neutral-200 text-neutral-900"}
                            `}
                            onClick={handleOpenFilter}
                        >
                            <div className="font-medium text-[14px] leading-[15.4px]">
                                {t("labelFilterInternal")}
                            </div>
                            <IconComponent
                                classname={filter.rating.length > 0 ? "icon-blue" : "icon-black"}
                                src="/icons/filter.svg"
                                height={14}
                                width={14}
                            />
                        </button>
                        <button
                            className={`flex gap-2 items-center px-3 h-[30px] rounded-3xl border border-solid w-fit
                                ${filter.sort ? "text-primary-700 border-primary-700 bg-primary-50" : "bg-neutral-200 border-neutral-200 text-neutral-900"}
                            `}
                            onClick={handleOpenBottomsheet}
                        >
                            <div className="font-medium text-[14px] leading-[15.4px]">
                                {t("labelSort")}
                            </div>
                            <IconComponent
                                classname={filter.sort ? "icon-blue" : "icon-black"}
                                src="/icons/sorting.svg"
                                height={14}
                                width={14}
                            />
                        </button>
                        <button
                            className={`flex items-center px-3 h-[30px] rounded-3xl border 
                                border-solid border-neutral-200 w-fit
                                ${filter.withMedia ? "text-primary-700 border-primary-700 bg-primary-50" : "bg-neutral-200 border-neutral-200 text-neutral-900"}
                            `}
                            onClick={() => setFilter(prevState => ({ ...prevState, withMedia: !prevState.withMedia }))}
                        >
                            <div className="font-medium text-[14px] leading-[15.4px]">
                                {t("labelImages")}
                            </div>
                        </button>
                    </div>
                </div>
                {reviews.map((review, key) => (
                    <div className="px-6 py-4 bg-neutral-50" key={key}>
                        <ReviewCardResponsive {...review} />
                    </div>
                ))}
            </div>
            {titleBottomsheet === t("labelSort") ? <Bottomsheet withReset onClickReset={handleSortSelect(null)}/> : null}
        </>
    )
}

export default AllProductReviewScreen