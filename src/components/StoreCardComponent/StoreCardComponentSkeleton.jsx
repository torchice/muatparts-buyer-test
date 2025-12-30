// Improvement fix wording Pak Brian
export default function StoreCardComponentSkeleton() {
  return (
    <div className="w-full h-[280px] border border-neutral-400 flex flex-col gap-2 rounded-md max-w-[441px] py-4 px-3">
      <div className="flex items-center gap-3">
        <div className="rounded-[100%] size-10 bg-gray-300" />
        <div className="flex flex-col gap-4">
          <div className="w-32 h-3 bg-gray-300 animate-pulse rounded-md" />
          <div className="w-32 h-3 bg-gray-300 animate-pulse rounded-md" />
        </div>
      </div>
      <div className="flex gap-3">
        {Array(3)
          .fill("")
          .map((_, index) => (
            <div
              key={index}
              className="rounded-md overflow-hidden flex flex-col border border-neutral-400 bg-neutral-50 w-[100px]"
            >
              <div className="w-full h-[100px] bg-gray-300 animate-pulse">
                
              </div>
              <div className="py-3 px-2 text-[10px] font-medium">
                <div className="h-3 bg-gray-300 animate-pulse rounded-md"/>
              </div>
            </div>
          ))}
      </div>
      <div className="flex gap-3">
        {Array(3).fill("").map((_, index)=>(
            <div key={`skeleton-${index}`} className="h-3 bg-gray-300 w-28 rounded-md"/>
        ))}
      </div>
    </div>
  );
}
