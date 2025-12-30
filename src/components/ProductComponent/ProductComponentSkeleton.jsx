// Improvement fix wording Pak Brian
export default function ProductComponentSkeleton({className}){
    return (
      <div className={`animate-pulse bg-white rounded-lg shadow-md relative max-w-[168px] w-full md:max-w-none ${className}`}>
        <div className="bg-gray-300 rounded-t-lg w-full h-48" />
        <div className="p-2 space-y-3">
          <di className="flex flex-col gap-1">
            <div className="bg-gray-300 h-4 w-3/4 rounded" />
            <div className="bg-gray-300 h-4 w-1/2 rounded" />
          </di>
          <div className="flex flex-col gap-1 ">
            <div className="bg-gray-300 h-4 w-full rounded" />
            <div className="bg-gray-300 h-4 w-full rounded" />
          </div>
        </div>
        <div className="p-2 space-y-2">
          <div className="bg-gray-300 h-3 w-1/3 rounded" />
          <div className="bg-gray-300 h-3 w-1/4 rounded" />
        </div>
      </div>
    )
  }