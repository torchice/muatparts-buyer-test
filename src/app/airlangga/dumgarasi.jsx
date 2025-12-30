"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import Button from "@/components/Button/Button";

const vehicleData = {
  Mobil: {
    brands: {
      Toyota: {
        years: {
          2024: {
            models: {
              Avanza: {
                types: ["1.3 G", "1.5 G", "1.5 Veloz"],
              },
              Innova: {
                types: ["2.0 G", "2.4 V Diesel", "2.4 Venturer"],
              },
              Fortuner: {
                types: ["2.4 G 4x2", "2.7 SRZ 4x2", "2.8 VRZ 4x4"],
              },
            },
          },
          2023: {
            models: {
              Avanza: {
                types: ["1.3 E", "1.3 G", "1.5 G"],
              },
              Innova: {
                types: ["2.0 G", "2.4 G Diesel", "2.4 V"],
              },
            },
          },
        },
      },
      Honda: {
        years: {
          2024: {
            models: {
              Brio: {
                types: ["Satya E", "Satya S", "RS"],
              },
              "HR-V": {
                types: ["1.5 S", "1.5 E", "1.5 Turbo RS"],
              },
              "CR-V": {
                types: ["2.0 i-VTEC", "1.5 Turbo", "Hybrid e:HEV"],
              },
            },
          },
          2023: {
            models: {
              Brio: {
                types: ["Satya S", "RS"],
              },
              "HR-V": {
                types: ["1.5 S", "1.5 Turbo RS"],
              },
            },
          },
        },
      },
    },
  },
  Motor: {
    brands: {
      Honda: {
        years: {
          2024: {
            models: {
              BeAT: {
                types: ["CBS", "CBS-ISS", "Deluxe"],
              },
              PCX: {
                types: ["CBS", "ABS", "e:HEV"],
              },
              CB150R: {
                types: ["Streetfire", "Streetfire SE", "Streetfire Raptor"],
              },
            },
          },
          2023: {
            models: {
              BeAT: {
                types: ["CBS", "CBS-ISS"],
              },
              PCX: {
                types: ["CBS", "ABS"],
              },
            },
          },
        },
      },
      Yamaha: {
        years: {
          2024: {
            models: {
              NMAX: {
                types: ["Connected", "Connected ABS", "Connected ABS Deluxe"],
              },
              "XSR 155": {
                types: ["Standard", "Sport", "Cafe Racer"],
              },
              R15: {
                types: ["Standard", "M", "Connected-ABS"],
              },
            },
          },
          2023: {
            models: {
              NMAX: {
                types: ["Standard", "Connected ABS"],
              },
              R15: {
                types: ["Standard", "M"],
              },
            },
          },
        },
      },
    },
  },
  Truk: {
    brands: {
      Hino: {
        years: {
          2024: {
            models: {
              "Dutro Cargo": {
                types: ["110 SDL", "110 SDL Long", "130 MDL"],
              },
              "Ranger Cargo": {
                types: ["FM 260 JD", "FM 260 JM", "FL 235 JW"],
              },
              "Profia Cargo": {
                types: ["FW 350 TH", "FS 285 PJ", "SH 350"],
              },
            },
          },
          2023: {
            models: {
              "Dutro Cargo": {
                types: ["110 SDL", "110 SDL Long"],
              },
              "Ranger Cargo": {
                types: ["FM 260 JD", "FM 260 JM"],
              },
            },
          },
        },
      },
      Mitsubishi: {
        years: {
          2024: {
            models: {
              Canter: {
                types: ["FE 71", "FE 73", "FE 84"],
              },
              Fuso: {
                types: ["FM 517 HL", "FN 527 ML", "FJ 2523"],
              },
              Fighter: {
                types: ["FN 61 FL", "FN 62 F", "FN 62 FL"],
              },
            },
          },
          2023: {
            models: {
              Canter: {
                types: ["FE 71", "FE 73"],
              },
              Fuso: {
                types: ["FM 517 HL", "FN 527 ML"],
              },
            },
          },
        },
      },
    },
  },
  Bus: {
    brands: {
      "Mercedes-Benz": {
        years: {
          2024: {
            models: {
              "OH 1626": {
                types: ["Standard", "Long Chassis"],
              },
              "OH 1836": {
                types: ["Standard", "Air Suspension"],
              },
            },
          },
          2023: {
            models: {
              "OH 1626": {
                types: ["Standard"],
              },
            },
          },
        },
      },
      Scania: {
        years: {
          2024: {
            models: {
              K360: {
                types: ["IB 4x2", "IB 6x2"],
              },
              K410: {
                types: ["IB 4x2", "IB 6x2", "EB 6x2"],
              },
            },
          },
          2023: {
            models: {
              K360: {
                types: ["IB 4x2"],
              },
              K410: {
                types: ["IB 4x2", "IB 6x2"],
              },
            },
          },
        },
      },
    },
  },
};

const Garasi = () => {
  const [formState, setFormState] = useState({
    vehicle: { value: "", error: "" },
    brand: { value: "", error: "" },
    year: { value: "", error: "" },
    model: { value: "", error: "" },
    type: { value: "", error: "" },
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const dropdownsConfig = [
    {
      key: "vehicle",
      label: "Pilih Kendaraan",
      options: Object.keys(vehicleData),
      disabled: false,
    },
    {
      key: "brand",
      label: "Pilih Brand",
      options: formState.vehicle.value
        ? Object.keys(vehicleData[formState.vehicle.value].brands)
        : [],
      disabled: !formState.vehicle.value,
    },
    {
      key: "year",
      label: "Pilih Tahun",
      options: formState.brand.value
        ? Object.keys(
            vehicleData[formState.vehicle.value].brands[formState.brand.value]
              .years
          )
        : [],
      disabled: !formState.brand.value,
    },
    {
      key: "model",
      label: "Pilih Model",
      options: formState.year.value
        ? Object.keys(
            vehicleData[formState.vehicle.value].brands[formState.brand.value]
              .years[formState.year.value].models
          )
        : [],
      disabled: !formState.year.value,
    },
    {
      key: "type",
      label: "Pilih Tipe",
      options: formState.model.value
        ? vehicleData[formState.vehicle.value].brands[formState.brand.value]
            .years[formState.year.value].models[formState.model.value].types
        : [],
      disabled: !formState.model.value,
    },
  ];

  const handleChange = (key, value) => {
    const updatedState = { ...formState };
    const keys = Object.keys(formState);
    const currentIndex = keys.indexOf(key);

    // Update current field and reset subsequent fields
    keys.forEach((k, index) => {
      if (index === currentIndex) {
        updatedState[k] = { value, error: "" };
      } else if (index > currentIndex) {
        updatedState[k] = { value: "", error: "" };
      }
    });

    setFormState(updatedState);
    setIsSubmitted(false);
  };

  const validateForm = () => {
    const updatedState = { ...formState };
    let isValid = true;

    dropdownsConfig.forEach((config) => {
      if (!formState[config.key].value) {
        updatedState[config.key] = {
          ...updatedState[config.key],
          error: `${config.label} harus diisi`,
        };
        isValid = false;
      }
    });

    setFormState(updatedState);
    return isValid;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (validateForm()) {
      // Handle successful submission
      const values = Object.entries(formState).reduce((acc, [key, field]) => {
        acc[key] = field.value;
        return acc;
      }, {});

      alert(
        "Data berhasil disubmit: \n" +
          Object.entries(values)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n")
      );
    }
  };

  return (
    <div className="py-6 px-10 space-y-6 w-full">
      <span className="capitalize font-bold text-xl ">garasi saya</span>
      <Card classname="flex flex-col p-6">
        <span className="capitalize font-bold text-lg">
          data kendaraan saya
        </span>
        <span className="font-semibold text-xs mt-4">
          Tambahkan informasi kendaraan kamu untuk menemukan suku cadang dan
          aksesori yang sesuai secara tepat
        </span>
        <div className="flex mt-6 gap-3 h-8 items-baseline">
          {dropdownsConfig.map((config) => (
            <Dropdown
              key={config.key}
              label={config.label}
              value={formState[config.key].value}
              onChange={(value) => handleChange(config.key, value)}
              options={config.options}
              disabled={config.disabled}
              error={isSubmitted ? formState[config.key].error : null}
            />
          ))}

          <Button Class="!min-w-[112px]" onClick={handleSubmit}>
            Tambah
          </Button>
        </div>
        <span
          className={`font-semibold text-xs ${
            isSubmitted ? "mt-8" : "mt-6"
          } text-neutral-600`}
        >
          Tidak menemukan kendaraan kamu di sini?{" "}
          <span className="!text-primary-700">Beritahu kami</span>
        </span>
      </Card>
    </div>
  );
};

export default Garasi;

export const Card = ({ children, classname }) => {
  return (
    <div
      className={`w-full h-fit bg-white border rounded-md border-neutral-600 text-neutral-900 ${classname}`}
    >
      {children}
    </div>
  );
};

export const Dropdown = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  error = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative mb-4" ref={dropdownRef}>
      {/* Main dropdown button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-[166px] h-8 p-2.5 bg-white flex items-center justify-between border rounded-lg !font-medium !text-xs
          ${disabled ? "bg-gray-50 cursor-not-allowed" : "cursor-pointer"}
          ${error ? "border-red-500" : "border-gray-300"}
          ${isOpen ? "ring-2 ring-blue-500 border-blue-500" : ""}`}
        type="button"
        disabled={disabled}
      >
        <span className={`${!value && "text-gray-500"}`}>{value || label}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg !font-medium !text-xs">
          {/* Search box */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Cari Kendaraan"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => (
              <button
                key={option}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-4 py-2 text-gray-500 text-center">
                Tidak ada hasil
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};


