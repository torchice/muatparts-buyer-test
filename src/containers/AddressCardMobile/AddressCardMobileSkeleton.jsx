'use client';
// Improvement fix wording Pak Brian
function AddressCardMobileSkeleton({ classname }) {
  return (
    <div
      className={`py-3 px-4 w-full flex flex-col gap-3 text-neutral-900 bg-neutral-50 ${classname} animate-pulse`}
    >
      {/* Label alamat */}
      <div className="h-4 w-1/2 bg-gray-300 rounded"></div>

      {/* Nama & nomor */}
      <div className="h-4 w-3/4 bg-gray-300 rounded"></div>

      {/* Alamat */}
      <div className="h-4 w-full bg-gray-300 rounded"></div>

      {/* Detail alamat */}
      <div className="h-4 w-5/6 bg-gray-300 rounded"></div>

      {/* Buttons */}
      <div className="flex items-center justify-between gap-3">
        <div className="h-7 w-[160px] bg-gray-300 rounded"></div>
        <div className="h-7 w-[160px] bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

export default AddressCardMobileSkeleton;
