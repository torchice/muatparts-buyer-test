"use client";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Input from "@/components/Input/Input";
import Dropdown from "@/components/Dropdown/Dropdown";
import IconComponent from "@/components/IconComponent/IconComponent";
import ProductGrid from "@/components/ProductsSectionComponent/ProductGrid";
import Button from "@/components/Button/Button";
import useAlbumStore from "@/store/album";
import FilterChips from "@/components/FilterChips/FilterChips";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useCustomRouter } from "@/libs/CustomRoute";

function IdAlbumWeb({ id, albumItems }) {
  const router = useCustomRouter();

  const { filterAlbum, setFilterAlbum } = useAlbumStore();

  return (
    <>
      <BreadCrumb
        data={[
          { name: "Album", url: "/profile/album" },
          { name: "Detail Album", url: "/profile/album/" + id },
        ]}
        onclick={(val) => {
          router.push(val.url);
        }}
      />
      <PageTitle title="Semua Album" />
      {/* <pre>
        <code>{JSON.stringify(filterAlbum, null, 2)}</code>
      </pre> */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3">
          <Input
            icon={{
              left: (
                <IconComponent
                  src={
                    process.env.NEXT_PUBLIC_ASSET_REVERSE + "/icons/search.svg"
                  }
                />
              ),
            }}
            placeholder="Cari Nama Produk/SKU"
            width={{
              width: 238,
            }}
            value={filterAlbum.search}
            changeEvent={(e) => {
              setFilterAlbum({ ...filterAlbum, search: e.target.value });
            }}
          />
          <Dropdown
            options={[
              { name: "Terbaru", value: "terbaru" },
              { name: "Terlama", value: "terlama" },
              { name: "Termahal", value: "termahal" },
              { name: "Termurah", value: "termurah" },
            ]}
            classname={`!w-[128px] ${
              filterAlbum.sort[0].value !== "terbaru"
                ? "!text-primary-700 !border-primary-700"
                : ""
            }`}
            leftIconElement={
              <IconComponent
                src={
                  process.env.NEXT_PUBLIC_ASSET_REVERSE + "/icons/sorting.svg"
                }
                color={filterAlbum.sort[0].value !== "terbaru" ? "primary" : ""}
              />
            }
            arrowColor={
              filterAlbum.sort[0].value !== "terbaru" ? "primary" : ""
            }
            defaultValue={filterAlbum.sort}
            onSelected={(val) => {
              setFilterAlbum({ ...filterAlbum, sort: val });
            }}
          />
          <Dropdown placeholder="Filter" classname={"!w-[120px]"} />
        </div>
        <div className="flex gap-3 items-center">
          <div className="font-semibold">Total : 3 Produk</div>
          <Button Class="rounded-3xl !h-8">
            <div className="mt-0.5">Atur Massal</div>
          </Button>
        </div>
      </div>
      <FilterChips />
      <div className="">
        <ProductGrid
          totalProducts={albumItems}
        />
      </div>
    </>
  );
}

export default IdAlbumWeb;
