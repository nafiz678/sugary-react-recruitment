import { Skeleton } from "@/components/ui/skeleton"

export function LoadingMaterials() {
  const loadingItems = Array.from({ length: 8 }, (_, i) => i)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {loadingItems.map((item) => (
        <div key={item} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <Skeleton className="aspect-square w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
