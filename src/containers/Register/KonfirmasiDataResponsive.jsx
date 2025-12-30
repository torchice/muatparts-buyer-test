import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import registerForm from "@/store/registerForm";
import { PencilLine } from "lucide-react";
import { DivParticleRegister } from "./InformasiTokoAkun";
import MiniMap from "../MapContainer/MiniMap";
import ModalComponent from "@/components/Modals/ModalComponent";
import MapContainer from "../MapContainer/MapContainer";
import IconComponent from "@/components/IconComponent/IconComponent";

const KonfirmasiDataResponsive = () => {
  const { formData, formIsFilled, setFormIsFilled, setCurrentStep } =
    registerForm();
  const router = useRouter();
  const [isOpenMap, setOpenMap] = useState(false);

  const renderFieldValue = (field) => {
    const { title, value, desc } = field;

    switch (title) {
      case "Logo Toko":
        return (
          <img
            src={value || "/img/chopper.png"}
            className="size-[72px] rounded-full border border-[#868686]"
            alt="Logo Toko"
          />
        );
      case "Titik Lokasi":
        return (
          <div className="w-full">
            <MiniMap
              lat={Number(value?.lat) || -7.250445}
              lng={Number(value?.long) || 112.768845}
              onClick={() => setOpenMap(true)}
              titleButton="Lihat Lokasi"
            />
            <ModalComponent
              isOpen={isOpenMap}
              setClose={() => setOpenMap(false)}
              hideHeader
            >
              <div className="flex item-start gap-4 pt-[14px] px-3">
                <MapContainer
                  width={600}
                  height={390}
                  lat={Number(value?.lat) || -7.250445}
                  lng={Number(value?.long) || 112.768845}
                  // onPosition={(val) => {
                  //   if (type === "store") {
                  //     updateStoreField("latitude", Number(value.lat));
                  //     updateStoreField("longitude", Number(value.lng));
                  //   } else {
                  //     updateCompanyField("latitude", Number(value.lat));
                  //     updateCompanyField("longitude", Number(value.lng));
                  //   }
                  // }}
                />
                <div className="flex flex-col gap-[22px]">
                  <span className="text-base font-semibold text-neutral-900">
                    Lihat Lokasi
                  </span>
                  <div className="relative">
                    <IconComponent
                      classname="absolute"
                      size="medium"
                      src={"/icons/marker.svg"}
                    />
                    <span className="flex items-center gap-2 w-[237px] font-medium text-[#868686] text-xs pl-[25px]">
                      {value?.location}
                    </span>
                  </div>
                </div>
              </div>
            </ModalComponent>
          </div>
        );
      case "KTP Pendaftar":
        const fileUrl = typeof value === "object" ? value.url : value;
        return (
          <div className="flex items-center gap-2">
            {fileUrl ? (
              <>
                {/* <span className="text-primary-700">{fileUrl}</span> */}
                <span className="text-success-600 text-xs font-medium">
                  {desc}
                </span>
              </>
            ) : (
              <span className="font-medium text-xs text-neutral-900">-</span>
            )}
          </div>
        );
      case "Nama Bank":
        // Handle rekening data
        return (
          <span className="font-medium text-xs text-neutral-900">
            {formData[0]?.rekening?.[0]?.bankName || "-"}
          </span>
        );
      case "Nama Pemilik Rekening":
        return (
          <span className="font-medium text-xs text-neutral-900">
            {formData[0]?.rekening?.[0]?.namaPemilik || "-"}
          </span>
        );
      case "No. Rekening":
        return (
          <span className="font-medium text-xs text-neutral-900">
            {formData[0]?.rekening?.[0]?.rekeningNumber || "-"}
          </span>
        );
      case "No. KTP Pendaftar":
        return (
          <span className="font-medium text-xs text-neutral-900">
            {formData[0]?.legality?.[0]?.ktpNo || "-"}
          </span>
        );
      case "Nama KTP Pendaftar":
        return (
          <span className="font-medium text-xs text-neutral-900">
            {formData[0]?.legality?.[0]?.namaKtpPendaftar || "-"}
          </span>
        );
      default:
        return (
          <span className="font-medium text-xs text-neutral-900">
            {value || "-"}
          </span>
        );
    }
  };

  const sections = [
    {
      title: "Informasi Toko",
      fields: [
        {
          title: "Tipe Toko",
          value: formData[0].tipeToko === 0 ? "Individu" : "Perusahaan",
        },
        ...(formData[0].tipeToko === 1
          ? [
              { title: "Nama Perusahaan", value: formData[0].companyName },
              { title: "Badan Usaha", value: formData[0].businessEntityID },
            ]
          : []),
        { title: "Nama Toko", value: formData[0].storeName },
        { title: "Logo Toko", value: formData[0].logo },
        { title: "Alamat", value: formData[0].addressDetail },
        { title: "Lokasi", value: formData[0].location },
        { title: "Kecamatan", value: formData[0].districtDescription },
        { title: "Kota", value: formData[0].cityDescription },
        { title: "Provinsi", value: formData[0].provinceDescription },
        { title: "Kode Pos", value: formData[0].postalCode },
        {
          title: "Titik Lokasi",
          value: {
            lat: formData[0].latitude,
            long: formData[0].longitude,
            location: formData[0].location,
          },
        },
        { title: "Email", value: formData[0].email },
      ],
    },
    {
      title: "Data Pendaftar",
      fields: [
        {
          title: "KTP Pendaftar",
          value: formData[0]?.legalityFile?.find(
            (file) => file.fieldName === "ktp_pendaftar"
          )?.file,
          desc: "File.png",
        },
        {
          title: "No. KTP Pendaftar",
          value: formData[0]?.legality?.[0]?.ktpNo,
        },
        {
          title: "Nama KTP Pendaftar",
          value: formData[0]?.legality?.[0]?.namaKtpPendaftar,
        },
      ],
    },
    {
      title: "Informasi Rekening",
      fields:
        !formData[1].haveActiveRekening && formData[1]?.rekening?.length !== 0
          ? [] // Kosongkan fields jika kondisi terpenuhi
          : [
              {
                title: "Nama Bank",
                value: formData[0]?.rekening?.[0]?.bankName,
              },
              {
                title: "Nama Pemilik Rekening",
                value: formData[0]?.rekening?.[0]?.namaPemilik,
              },
              {
                title: "No. Rekening",
                value: formData[0]?.rekening?.[0]?.rekeningNumber,
              },
            ],
      showMessage:
        !formData[1].haveActiveRekening && formData[1]?.rekening?.length !== 0,
    },
  ];

  const handleEdit = (section) => {
    // Arahkan ke step yang sesuai berdasarkan section
    switch (section.title) {
      case "Informasi Toko":
        setCurrentStep(0);
        break;
      case "Data Pendaftar":
        setCurrentStep(1);
        break;
      case "Informasi Rekening":
        setCurrentStep(1);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setFormIsFilled(true);
  }, []);

  return (
    <div className="space-y-6 pt-8 px-4 pb-24 bg-white min-h-screen">
      {sections.map((section, idx) => (
        <div key={idx} className={`bg-white`}>
          <div className="flex justify-between items-center">
            <span className="text-neutral-900 font-semibold text-sm block">
              {section.title}
            </span>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleEdit(section)}
            >
              <PencilLine size={16} className="text-primary-700" />
              <span className="text-xs font-medium text-primary-700">Ubah</span>
            </div>
          </div>

          <div className="flex flex-col space-y-4 mt-5">
            {section.showMessage ? (
              <span className="text-xs text-neutral-900">
                Anda dapat melengkapi nanti pada menu <b>Informasi Rekening</b>{" "}
                atau memilih untuk melengkapi sekarang.
              </span>
            ) : (
              section.fields.map((field, fieldIdx) => (
                <DivParticleRegister
                  key={fieldIdx}
                  title={field.title}
                  mustFill={false}
                  classLabel="!text-neutral-600"
                  classname={
                    field.title === "Logo Toko"
                      ? "!items-center"
                      : "!items-start"
                  }
                >
                  {renderFieldValue(field)}
                </DivParticleRegister>
              ))
            )}
          </div>
          {sections.length - 1 !== idx && (
            <hr className="border-neutral-500 my-4" />
          )}
        </div>
      ))}
      <div className="bg-[#D3EBFF] py-2 rounded-[5px] font-medium text-xs text-center shadow-muat">
        Baca <span className="!text-primary-700">Syarat dan Ketentuan</span>{" "}
        Muatparts Mart.
      </div>
    </div>
  );
};

export default KonfirmasiDataResponsive;
