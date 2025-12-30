import { useLanguage } from "@/context/LanguageContext";
import { useFormProps } from "./page";

export const BeritahuKamiWeb = () => {
  const {
    formDetails,
    handleDetailsChange,
    isSubmitted,
    handleSubmit,
    validateForm,
  } = useFormProps();

  const { t } = useLanguage();

  const handleTextareaChange = (e) => {
    let value = e.target.value;

    // Prevent leading spaces
    if (value.startsWith(" ")) {
      value = value.trimStart();
    }

    // Check if adding the character would exceed the limit
    if (value.length <= 1000) {
      handleDetailsChange("description", value);
    }
  };

  const onSubmit = () => {
    handleSubmit();
    console.log("Form Data:", {
      email: formDetails.email.value,
      description: formDetails.description.value,
    });
  };

  return (
    <div className="space-y-2 py-8 px-6">
      <h1 className="text-lg font-bold mb-4 mx-auto text-center">
        {t("AppManajemenGarasiMuatpartsDataKendaraan")}
      </h1>
      {/* Email Field */}
      <div className="space-y-2">
        <label className="text-neutral-600 text-xs font-medium flex gap-1">
          {t("AppManajemenGarasiMuatpartsEmailKamu")}
          {/* Email kamu <span className="font-normal italic">(Opsional)</span> */}
        </label>
        <input
          type="email"
          placeholder={t("AppManajemenGarasiMuatpartsHintTextEmailKamu")}
          value={formDetails.email.value}
          onChange={(e) => handleDetailsChange("email", e.target.value)}
          className={`!min-w-[423px] !max-w-[423px] !w-[423px] sm:!min-w-[auto] sm:!max-w-[auto] sm:!w-full p-3 border rounded-lg text-xs font-medium text-[#1b1b1b] placeholder-gray-500
            focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-500
            ${
              isSubmitted && formDetails.email.error
                ? "border-red-500"
                : "border-neutral-600"
            }`}
        />
        {isSubmitted && formDetails.email.error && (
          <p className="text-red-500 font-medium text-xs ">
            {formDetails.email.error}
          </p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <label className="text-neutral-600 text-xs font-medium">
          {t("AppManajemenGarasiMuatpartsDeskripsiKendaraan")}*
        </label>
        <textarea
          placeholder={t(
            "AppManajemenGarasiMuatpartsHintTextDeskripsiKendaraan"
          )}
          value={formDetails.description.value}
          onChange={handleTextareaChange}
          className={`!min-w-[423px] !max-w-[423px] !w-[423px] sm:!min-w-[auto] sm:!max-w-[auto] sm:!w-full p-3 min-h-[100px] border rounded-lg text-xs font-medium text-[#1b1b1b]
            placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-500
            ${
              isSubmitted && formDetails.description.error
                ? "border-red-500"
                : "border-neutral-600"
            }`}
        />

        <div
          className={`flex ${
            isSubmitted && formDetails.description.error
              ? "justify-between"
              : "justify-end"
          } font-medium text-xs !-mt-0`}
        >
          {isSubmitted && formDetails.description.error && (
            <p className="text-xs text-red-500">
              {formDetails.description.error}
            </p>
          )}
          <span
            className={`text-xs ${
              isSubmitted && formDetails.description.error
                ? "text-error-500"
                : "text-neutral-600"
            }`}
          >
            {formDetails.description.value.length}/1.000
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={onSubmit}
          className="w-[112px] px-4 py-2 bg-primary-700 text-white rounded-[24px] hover:bg-primary-800
            focus:outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-2
            disabled:bg-gray-400 text-sm font-semibold"
        >
          {t("AppManajemenGarasiMuatpartsKirim")}
        </button>
      </div>
    </div>
  );
};
