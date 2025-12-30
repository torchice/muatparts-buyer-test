// Improvement fix wording Pak Brian 
export function MenungguUlasanSkeleton() {
  return (
    <div className="flex flex-col rounded-[10px] border border-neutral-600">
      <div className="py-5 px-8 border-b border-b-neutral-600 flex flex-col gap-y-5">
        <div className="flex w-full items-center justify-between">
          <div className="h-4 bg-gray-300 skeleton animate-skeleton w-40" />
          <div className="h-4 bg-gray-300 skeleton animate-skeleton w-48" />
        </div>
        <div className="flex  justify-between">
          <div className="flex gap-5">
            <div className="size-12 aspect-square rounded-[100%] bg-gray-300 skeleton animate-skeleton" />
            <div className="h-4 bg-gray-300 skeleton animate-skeleton w-48" />
          </div>
          <div className="">
            <p className="text-xs">Ulasan</p>
            <div className="mt-2 h-4 bg-gray-300 skeleton animate-skeleton w-60" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-[18px] pb-5 px-8">
        <div className="flex items-center gap-5">
          <div className="size-10 aspect-square rounded-[100%] bg-gray-300 skeleton animate-skeleton" />
          <div className="h-4 bg-gray-300 skeleton animate-skeleton w-48" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-8 rounded-full bg-gray-300 skeleton animate-skeleton w-28" />
          <div className="h-8 rounded-full bg-gray-300 skeleton animate-skeleton w-28" />
        </div>
      </div>
    </div>
  );
}

export function UlasanCardSkeleton() {
  return (
    <div className="flex flex-col rounded-[10px] border border-neutral-600">
      <div className="py-5 px-8 border-b border-b-neutral-600 flex flex-col gap-y-5">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-300 skeleton animate-skeleton w-40" />
          <div className="h-4 bg-gray-300 skeleton animate-skeleton w-48" />
        </div>
        <div className="flex gap-x-5">
          <div className="size-12 aspect-square rounded-[100%] bg-gray-300 skeleton animate-skeleton" />
          <div className="flex flex-col gap-y-5">
            <div className="h-4 bg-gray-300 skeleton animate-skeleton w-48" />
            <div className="h-4 bg-gray-300 skeleton animate-skeleton w-48" />
            <div className="flex flex-col gap-y-4">
              <div className="flex  gap-x-1">
                <div className="size-8 aspect-square rounded-[100%] bg-gray-300 skeleton animate-skeleton" />
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <div className="h-3 bg-gray-300 skeleton animate-skeleton w-20" />
                    <div className="h-3 bg-gray-300 skeleton animate-skeleton w-48" />
                  </div>
                  <div className="h-3 bg-gray-300 skeleton animate-skeleton w-20" />
                  <div className="flex gap-1 items-center">
                    {Array(3)
                      .fill("")
                      .map(() => (
                        <div className="!aspect-square !size-8 rounded-md bg-gray-300 skeleton animate-skeleton w-20" />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-[18px] pb-5 px-8">
        <div className="flex items-center gap-5">
          <div className="size-10 aspect-square rounded-[100%] bg-gray-300 skeleton animate-skeleton" />
          <div className="h-4 bg-gray-300 skeleton animate-skeleton w-48" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-8 rounded-full bg-gray-300 skeleton animate-skeleton w-28" />
          <div className="h-8 rounded-full bg-gray-300 skeleton animate-skeleton w-28" />
        </div>
      </div>
    </div>
  );
}
