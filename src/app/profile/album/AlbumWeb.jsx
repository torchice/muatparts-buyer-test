"use client";

import { useState, useEffect, useMemo } from "react";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import style from "./Album.module.scss";
import ProductGrid from "@/components/ProductsSectionComponent/ProductGrid";
import Image from "next/image";
import { EllipsisVertical, Plus } from "lucide-react";
import Modal from "@/components/Modals/modal";
import { useRouter } from "next/navigation";
import { useCustomRouter } from "@/libs/CustomRoute";
import Input from "@/components/Input/Input";
import SWRHandler from "@/services/useSWRHook";
import Toast from "@/components/Toast/Toast";
import toast from "@/store/toast";
import useWishlist from "@/store/wishlist";
import DataNotFound from "@/components/DataNotFound/DataNotFound";

function NewAlbumCard({ setModalNewAlbum }) {
  return (
    <div className="flex flex-col flex-1 shrink self-stretch pb-12 text-sm font-semibold leading-tight text-center text-black basis-0">
      <button
        className="flex flex-col justify-center items-center bg-white rounded-xl border-primary-700 border-dashed border h-48 w-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Create new album"
        onClick={() => setModalNewAlbum(true)}
      >
        <Plus size={24} className="text-primary-700" />
        <div className="mt-2.5">Album Baru</div>
      </button>
    </div>
  );
}

function ImageGrid({ images }) {
  if (!images || images.length === 0) {
    return (
      <div className="w-[268px] h-[204px] rounded-[12px] flex justify-center border-solid border-[1px] border-[#c4c4c4]">
        <DataNotFound 
                  classname="w-[93px]"
                  title="Album kamu kosong"
                  type="data"
        >
        </DataNotFound>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="w-full h-48 relative rounded-xl overflow-hidden border border-neutral-400">
        <Image
          src={images[0]}
          fill
          alt="album-cover-1"
          className="object-cover"
        />
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-1 h-48">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative rounded-xl overflow-hidden border border-neutral-400 ${
              index === 0 ? "rounded-r-none" : "rounded-l-none"
            }`}
          >
            <Image
              src={image}
              alt="album-cover-2"
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className="grid grid-cols-2 gap-1 h-48">
        <div className="relative rounded-xl overflow-hidden rounded-r-none border border-neutral-400">
          <Image
            src={images[0]}
            alt="album-cover-3"
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-rows-2 gap-1">
          {images.slice(1).map((image, index) => (
            <div
              key={index}
              className={`relative rounded-xl rounded-l-none overflow-hidden border border-neutral-400 ${
                index === 0 ? "rounded-b-none" : "rounded-t-none"
              }`}
            >
              <Image
                src={image}
                alt="album-cover-3"
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 4) {
    const getRoundStyle = (index) => {
      switch (index) {
        case 0:
          return "rounded-tl-xl";
        case 1:
          return "rounded-tr-xl";
        case 2:
          return "rounded-bl-xl";
        case 3:
          return "rounded-br-xl";
      }
    };

    return (
      <div className="grid grid-cols-2 gap-1 h-48">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative overflow-hidden border border-neutral-400 ${getRoundStyle(
              index
            )}`}
          >
            <Image
              src={image}
              alt={`album-cover-4-${index}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function AlbumCard({ id,name,itemCount,type,thumbnails }) {
  const router = useCustomRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const { useSWRMutateHook } = SWRHandler();
  const { setShowToast, setDataToast } = toast();
  const [idDelete,setIdDelete] = useState("");
  const [modalDelete,setModalDelete] = useState(false);
  const { setValueEditWishlist,setModalEditAlbum } = useWishlist();
  
  const menuContainerClass = `menu-container-${name.replace(
    /\s+/g,
    "-"
  )}-${itemCount}`;

  const handleClickOutside = (event) => {
    if (menuOpen && !event.target.closest(`.${menuContainerClass}`)) {
      setMenuOpen(false);
    }
  };

  const { data: dataDeleteMainGarasi,trigger: triggerDeleteAlbum } =
    useSWRMutateHook(
      `${process.env.NEXT_PUBLIC_GLOBAL_API}v1/muatparts/garasi/delete/${idDelete}`,
      "DELETE"
    );

  const deleteALbum = (id) => {
      setIdDelete(id)
      setModalDelete(true);
  }

  const onSaveDelete = (name) => {
    triggerDeleteAlbum();
    setShowToast(true);
    setModalDelete(false);
    setDataToast({
      type: "success",
      message: `Berhasil menghapus album ${name}`,
    });
  }

  const ubahAlbum = (id,name) => {
    setValueEditWishlist({ id, name });
    setModalEditAlbum(true);
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <>
      <Modal
          isOpen={modalDelete}
          setIsOpen={setModalDelete}
          closeArea={false}
          closeBtn={true}
          desc={`Apakah kamu yakin ingin menghapus data ini?`}
          action1={{
            action: () => setModalDelete(false),
            text: "Batal",
            style: "outline",
            color: "#176CF7",
                customStyle: {
                    width: "112px",
            },
          }}
          action2={{
              action:() => onSaveDelete(name),
              text: "Ya",
              style: "full",
              color: "#176CF7",
              customStyle: {
                  width: "112px",
                  color: "#ffffff",
              },
          }}
          >
      </Modal>
      
      <div className="flex flex-col self-stretch my-auto">
        <div
          className="cursor-pointer"
          onClick={() => router.push("/profile/album/" + id)}
        >
          <ImageGrid images={thumbnails} />
        </div>
        <div className="flex flex-col mt-3 w-full leading-tight">
          <div className="flex justify-between text-base ">
            <div className="font-bold text-black">{name}</div>
            {type !== "General" && (
              <div className={`relative ${menuContainerClass}`}>
                <EllipsisVertical
                  size={18}
                  className="text-neutral-700 cursor-pointer"
                  onClick={() => setMenuOpen(!menuOpen)}
                />
                {menuOpen && (
                  <div className="absolute top-5 right-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10 text-xs">
                    <button onClick={() => ubahAlbum(id,name)} className="w-full text-left px-3 py-2 rounded-t-md text-neutral-900 hover:bg-gray-100">
                      Ubah nama Album
                    </button>
                    <button onClick={() => deleteALbum(id)} className="w-full text-left px-3 py-2 rounded-b-md text-error-400 hover:bg-error-50">
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="mt-2 text-xs font-medium text-neutral-600">
            {itemCount} Barang
          </div>
        </div>
      </div>
    </>
  );
}

function AlbumGrid({ albumItems, setModalNewAlbum }) {
  
  return (
    <div className="flex flex-col justify-center p-6 bg-white rounded-xl shadow-muatmuat">
      <div className="grid grid-cols-3 gap-6">
        {albumItems.map((album) => (
          <AlbumCard
            key={album.id}
            {...album}
          />
        ))}
        <NewAlbumCard setModalNewAlbum={setModalNewAlbum} />
      </div>
    </div>
  );
}

function AlbumWeb({
  albumItems,
  lastVisited,
  modalNewAlbum,
}) {
  const {setModalNewAlbum} = useWishlist();
  console.log(albumItems)
  return (
    <>
      <div className="flex gap-[30px]">
        <div className="w-[900px] space-y-6">
          <div className="flex gap-3">
            <h1 className="text-xl font-bold">Album</h1>
          </div>
          {albumItems.length === 0 ? (
            <DataEmpty
              title="Albummu kamu kosong"
              subtitle="Isi Album-mu dengan klik ikon hati saat kamu ketemu barang yang kamu suka!"
              buttonText="Cari Barang yang Disukai"
              onButtonClick={() => setModalNewAlbum(true)}
            />
          ) : (
            <AlbumGrid
              albumItems={albumItems}
              setModalNewAlbum={setModalNewAlbum}
            />
          )}
          <div className="">
            <ProductGrid
              title="Terakhir Kamu Lihat"
              totalProducts={lastVisited}
            />
          </div>
        </div>
      </div>

      
    </>
  );
}

export default AlbumWeb;
