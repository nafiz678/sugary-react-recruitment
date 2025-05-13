
import { useEffect, useState, useCallback } from "react"
import { useInView } from "react-intersection-observer"
import { MaterialCard } from "./material-card"
import { Loader2 } from "lucide-react"
import axios from "axios"
import type { Material } from "@/lib/type"
import { Button } from "../ui/button"



export default function MaterialsList() {
    const [materials, setMaterials] = useState<Material[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(0)
    const limit = 20

    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: false,
    })

    // fetch materials
    const fetchMaterials = useCallback(async () => {
        try {
            setLoading(true)
            const filter = {
                Skip: page * limit,
                Limit: limit,
                Types: [1],
            }
            const response = await axios.get('https://sugarytestapi.azurewebsites.net/Materials/GetAll/', {
                params: {
                    filter: btoa(JSON.stringify(filter)),
                },
            });

        const data = response.data;
        
        setMaterials((prev) => [...prev, ...data.Materials]);
        setHasMore(data.RemainingCount > 0);
        setPage((prev) => prev + 1);
        } catch (err) {
            setError("Failed to load materials. Please try again later.")
            console.error("Error fetching materials:", err)
        } finally {
            setLoading(false)
        }
    }, [page])

    // Load more materials when the user scrolls to the bottom
    useEffect(() => {
        if (inView && hasMore && !loading) {
            fetchMaterials()
        }
    }, [inView, hasMore, loading, fetchMaterials])

    // Initial load
    useEffect(() => {
        fetchMaterials()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (error && materials.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <Button
                    onClick={() => {
                        setError(null)
                        setPage(0)
                        setMaterials([])
                        fetchMaterials()
                    }}
                    className="px-4 py-2 rounded-md transition-colors"
                >
                    Try Again
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {materials.map((material) => (
                    <MaterialCard key={`${material.Id}-${material.VariantId || ""}`} material={material} />
                ))}
            </div>

            {/* Loading indicator */}
            {hasMore && (
                <div ref={ref} className="flex justify-center items-center py-8">
                    {loading && (
                        <div className="flex flex-col items-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="mt-2 text-sm text-gray-500">Loading more items...</p>
                        </div>
                    )}
                </div>
            )}

            {!hasMore && materials.length > 0 && (
                <p className="text-center text-gray-500 py-8">You've reached the end of the list</p>
            )}
        </div>
    )
}
