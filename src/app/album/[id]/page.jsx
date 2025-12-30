import Toast from "@/components/Toast/Toast";
import IdAlbum from "./IdAlbum";

async function Page({ params }) {
  const id = (await params).id;

  return (
    <div className="w-full">
      <Toast />
      <IdAlbum id={id} />
    </div>
  );
}

export default Page;
