
import { useState } from "react"
import { motion } from "motion/react"
import { ShoppingBag, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Material {
    Id: number
    Title: string
    SubTitle?: string
    BrandName: string
    CoverPhoto: string
    SalesPrice: number
    SalesPriceInUsd: number
    VariantTitle?: string
    VariantId?: number
}

interface MaterialCardProps {
    material: Material
}

export function MaterialCard({ material }: MaterialCardProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [isHovered, setIsHovered] = useState(false)

    const formatPrice = (price: number) => {
        return price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }

    return (
        <motion.div
            className="group relative bg-white dark:bg-black border rounded-xl shadow-sm hover:shadow-md overflow-hidden transition-all "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.3 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image container with aspect ratio */}
            <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 ${isLoading ? "animate-pulse" : "hidden"}`} />
                <img
                    loading="lazy"
                    src={
                        material.CoverPhoto.includes("/")
                            ? material.CoverPhoto
                            : `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(material.Title)}`
                        }
                    alt={material.Title}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className={`object-cover transition-all duration-500 ${isHovered ? "scale-110" : "scale-100"} ${isLoading ? "opacity-0" : "opacity-100"}`}
                    onLoad={() => setIsLoading(false)}
                />

                {/* Quick action buttons */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800"
                    >
                        <Heart className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        <span className="sr-only">Add to wishlist</span>
                    </Button>
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800"
                    >
                        <Eye className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        <span className="sr-only">Quick view</span>
                    </Button>
                </div>

                {/* Brand badge */}
                <Badge
                    variant="secondary"
                    className="absolute top-2 left-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-xs font-medium"
                >
                    {material.BrandName}
                </Badge>
            </div>

            {/* Product details */}
            <div className="p-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{material.Title}</h3>

                {material.VariantTitle && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{material.VariantTitle}</p>
                )}

                <div className="mt-2 flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">৳{formatPrice(material.SalesPrice)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">${material.SalesPriceInUsd.toFixed(2)} USD</p>
                    </div>

                    <Button size="sm" variant="outline" className="gap-1 h-8">
                        <ShoppingBag className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only sm:inline-block">Add</span>
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
