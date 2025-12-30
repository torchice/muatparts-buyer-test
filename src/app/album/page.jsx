import AlbumWishlist from "@/components/AlbumWishist/AlbumWishlist";
import Album from "./Album";
import Toast from "@/components/Toast/Toast";

function Page() {
  return (
    <div className="w-full">
      <Toast />
      <Album />
    </div>
  );
}

export default Page;
