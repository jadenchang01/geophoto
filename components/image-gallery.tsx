"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Calendar, MapPin } from "lucide-react"

interface Image {
  id: string
  name: string
  url: string
  year: number
  location: string
}

interface ImageGalleryProps {
  images: Image[]
  mode: "view" | "create"
  onImageSelect?: (image: Image) => void
  onImageDrag?: (imageId: string, pinId: string) => void
}

export function ImageGallery({ images, mode, onImageSelect, onImageDrag }: ImageGalleryProps) {
  const [draggedImage, setDraggedImage] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, imageId: string) => {
    if (mode === "create") {
      setDraggedImage(imageId)
      e.dataTransfer.setData("text/plain", imageId)
    }
  }

  const handleDragEnd = () => {
    setDraggedImage(null)
  }

  // Mock images for create mode
  const mockImages: Image[] =
    mode === "create"
      ? [
          { id: "mock1", name: "IMG_001.jpg", url: "/happy-family-beach-vacation.png", year: 2024, location: "Downloads" },
          { id: "mock2", name: "IMG_002.jpg", url: "/vibrant-cityscape.png", year: 2024, location: "Downloads" },
          { id: "mock3", name: "IMG_003.jpg", url: "/serene-forest-path.png", year: 2024, location: "Downloads" },
          { id: "mock4", name: "IMG_004.jpg", url: "/delicious-meal.png", year: 2024, location: "Downloads" },
          { id: "mock5", name: "IMG_005.jpg", url: "/modern-glass-facade.png", year: 2024, location: "Downloads" },
          { id: "mock6", name: "IMG_006.jpg", url: "/vibrant-sunset.png", year: 2024, location: "Downloads" },
        ]
      : images

  if (mockImages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-8">
        <div>
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">No Photos</h3>
          <p className="text-sm text-muted-foreground">
            {mode === "view" ? "No photos found for this location and year" : "Your photo library will appear here"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="grid grid-cols-2 gap-3">
        {mockImages.map((image) => (
          <Card
            key={image.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              draggedImage === image.id ? "opacity-50 scale-95" : ""
            } ${mode === "create" ? "hover:scale-105" : ""}`}
            draggable={mode === "create"}
            onDragStart={(e) => handleDragStart(e, image.id)}
            onDragEnd={handleDragEnd}
            onClick={() => onImageSelect?.(image)}
          >
            <CardContent className="p-2">
              <div className="aspect-square relative mb-2 rounded-md overflow-hidden bg-muted">
                <img src={image.url || "/placeholder.svg"} alt={image.name} className="w-full h-full object-cover" />
                {mode === "create" && (
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="opacity-0 hover:opacity-100 transition-opacity">
                      <Badge variant="secondary" className="text-xs">
                        Drag to pin
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium truncate">{image.name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {image.year}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {image.location}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
