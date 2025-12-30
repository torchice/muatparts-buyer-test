import Toast from "@/components/Toast/Toast";
import IdPesanan from "./IdPesanan";

async function Page({ params }) {
  const id = (await params).id;

  return (
    <div className="w-full">
      <IdPesanan id={id} />
      <Toast />
    </div>
  );
}

export default Page;
