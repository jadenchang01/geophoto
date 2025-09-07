"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, FolderOpen, ImageIcon, Images, Check, X } from "lucide-react"

interface Pin {
  id: string
  country: string
  city: string
  lat: number
  lng: number
  year: number
  imageCount: number
}

interface PinDashboardProps {
  pin: Pin
  isOpen: boolean
  onClose: () => void
  onImageDrop: (imageId: string, pinId: string) => void
}

export function PinDashboard({ pin, isOpen, onClose, onImageDrop }: PinDashboardProps) {
  const [showImportGallery, setShowImportGallery] = useState(false)
  const [showFolderGallery, setShowFolderGallery] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const originalFolderImages = [
    { id: "1", name: "vibrant-street-market.png", src: "/vibrant-street-market.png" },
    { id: "2", name: "vast-mountain-valley.png", src: "/vast-mountain-valley.png" },
    { id: "3", name: "happy-family-beach-vacation.png", src: "/happy-family-beach-vacation.png" },
    { id: "4", name: "vibrant-cityscape.png", src: "/vibrant-cityscape.png" },
    { id: "5", name: "serene-forest-path.png", src: "/serene-forest-path.png" },
    { id: "6", name: "delicious-meal.png", src: "/delicious-meal.png" },
  ]

  const currentFolderImages = originalFolderImages.slice(0, 3) // Mock some images already in folder

  const handleImageSelect = (imageId: string) => {
    setSelectedImages((prev) => (prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]))
  }

  const handleMoveSelectedImages = () => {
    selectedImages.forEach((imageId) => {
      // Backend integration - moves image file from original folder to organized folder
      // Input: imageId (string), country (string), city (string), year (number)
      // Output: void (physically moves file from downloads/original to organized folder)
      // Function: Transfers the actual image file to the destination folder structure
      // clickandDrag(imageId, pin.country, pin.city, pin.year)
      console.log(`Moving image ${imageId} to ${pin.country}/${pin.city}/${pin.year}/`)
    })

    setSelectedImages([])
    setShowImportGallery(false)
    // Update pin image count (this would be handled by backend in real implementation)
  }

  const ImportGallery = () => (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-[1003] flex flex-col">
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <h2 className="text-xl font-bold text-black">Import Images - Original Folder</h2>
        <Button
          onClick={() => setShowImportGallery(false)}
          variant="outline"
          className="border-2 border-black text-black bg-white hover:bg-gray-100"
        >
          <X className="h-4 w-4 mr-2" />
          Close
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {originalFolderImages.map((image) => (
            <div
              key={image.id}
              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                selectedImages.includes(image.id) ? "border-white shadow-lg" : "border-gray-400 hover:border-white"
              }`}
              onClick={() => handleImageSelect(image.id)}
            >
              <img src={image.src || "/placeholder.svg"} alt={image.name} className="w-full h-48 object-cover" />
              {selectedImages.includes(image.id) && (
                <div className="absolute inset-0 bg-white bg-opacity-20 flex items-center justify-center">
                  <Check className="h-8 w-8 text-white" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-sm p-2">
                {image.name}
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedImages.length > 0 && (
        <div className="p-4 bg-white border-t">
          <Button
            onClick={handleMoveSelectedImages}
            className="w-full border-2 border-black text-black bg-white hover:bg-gray-100 font-semibold"
          >
            <Check className="h-4 w-4 mr-2" />
            Move {selectedImages.length} Photo{selectedImages.length > 1 ? "s" : ""} to {pin.city}
          </Button>
        </div>
      )}
    </div>
  )

  const FolderGallery = () => (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-[1003] flex flex-col">
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <h2 className="text-xl font-bold text-black">
          {pin.city}, {pin.country} - {pin.year}
        </h2>
        <Button
          onClick={() => setShowFolderGallery(false)}
          variant="outline"
          className="border-2 border-black text-black bg-white hover:bg-gray-100"
        >
          <X className="h-4 w-4 mr-2" />
          Close
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {currentFolderImages.map((image) => (
            <div key={image.id} className="relative rounded-lg overflow-hidden border-2 border-gray-400">
              <img src={image.src || "/placeholder.svg"} alt={image.name} className="w-full h-48 object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-sm p-2">
                {image.name}
              </div>
            </div>
          ))}
        </div>
        {currentFolderImages.length === 0 && (
          <div className="text-center py-16">
            <Images className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-white text-lg">No photos in this folder yet</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto z-[1002] bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-200">
              <div className="p-2 bg-gray-800 rounded-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              Pin Dashboard - {pin.city}, {pin.country}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Pin Information */}
            <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-md">
              <CardHeader className="bg-gray-50 dark:bg-gray-700">
                <CardTitle className="text-lg flex items-center gap-2 text-gray-800 dark:text-gray-200">
                  <div className="p-1.5 bg-gray-600 rounded-md">
                    <FolderOpen className="h-4 w-4 text-white" />
                  </div>
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Country</p>
                    <p className="font-bold text-gray-800 dark:text-gray-200">{pin.country}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">City</p>
                    <p className="font-bold text-gray-800 dark:text-gray-200">{pin.city}</p>
                  </div>
                  <div className="p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Year</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <p className="font-bold text-gray-800 dark:text-gray-200">{pin.year}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Photos</p>
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <p className="font-bold text-gray-800 dark:text-gray-200">{pin.imageCount}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Coordinates</p>
                  <p className="text-sm font-mono font-bold text-gray-800 dark:text-gray-200">
                    {pin.lat.toFixed(6)}, {pin.lng.toFixed(6)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-md">
              <CardHeader className="bg-gray-50 dark:bg-gray-700">
                <CardTitle className="text-lg flex items-center justify-between text-gray-800 dark:text-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gray-600 rounded-md">
                      <Images className="h-4 w-4 text-white" />
                    </div>
                    Photos
                  </div>
                  <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
                    /{pin.country}/{pin.city}/{pin.year}/
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {currentFolderImages.slice(0, 6).map((image) => (
                    <div key={image.id} className="relative rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={image.src || "/placeholder.svg"}
                        alt={image.name}
                        className="w-full h-20 object-cover"
                      />
                    </div>
                  ))}
                  {currentFolderImages.length === 0 && (
                    <div className="col-span-3 text-center py-8">
                      <Images className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">No photos yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-2 border-black text-black bg-white hover:bg-gray-100 font-semibold"
              >
                Close Dashboard
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowImportGallery(true)}
                  className="border-2 border-black text-black bg-white hover:bg-gray-100 font-semibold"
                >
                  <Images className="h-4 w-4 mr-2" />
                  Import Images
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFolderGallery(true)}
                  className="border-2 border-black text-black bg-white hover:bg-gray-100 font-semibold"
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Open Folder
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showImportGallery && <ImportGallery />}
      {showFolderGallery && <FolderGallery />}
    </>
  )
}
