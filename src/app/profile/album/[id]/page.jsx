import IdAlbum from "./IdAlbum";

async function Page({ params }) {
  const id = (await params).id;

  return (
    <div className="w-full">
      <IdAlbum id={id} />
    </div>
  );
}

export default Page;
