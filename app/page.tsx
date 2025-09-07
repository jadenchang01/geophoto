"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, Plus, Calendar, ImageIcon, FolderOpen, Globe } from "lucide-react"
import { MapContainer } from "@/components/map-container"
import { ImageGallery } from "@/components/image-gallery"
import { PinDashboard } from "@/components/pin-dashboard"

type Mode = "view" | "create"

interface Pin {
  id: string
  country: string
  city: string
  lat: number
  lng: number
  year: number
  imageCount: number
}

interface Image {
  id: string
  name: string
  url: string
  year: number
  location: string
}

export default function PhotoMapOrganizer() {
  const [mode, setMode] = useState<Mode>("view")
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null)
  const [pins, setPins] = useState<Pin[]>([])
  const [images, setImages] = useState<Image[]>([])
  const [isDashboardOpen, setIsDashboardOpen] = useState(false)

  // Available years for the year selector
  const availableYears = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i)

  // Handle pin creation in create mode
  const handleMapClick = (lat: number, lng: number, country: string) => {
    if (mode === "create") {
      const newPin: Pin = {
        id: `pin-${Date.now()}`,
        country,
        city: searchQuery || "Unknown City",
        lat,
        lng,
        year: selectedYear,
        imageCount: 0,
      }

      // Backend integration - creates new container/folder in desktop for users to drop images
      // Input: country (string), city (string), year (number)
      // Output: boolean success status
      // Function: Creates organized folder structure for photo storage
      // makeFolder(newPin.country, newPin.city, newPin.year)

      setPins([...pins, newPin])
      setSelectedPin(newPin)
      setIsDashboardOpen(true)
    }
  }

  // Handle pin selection in view mode
  const handlePinSelect = (pin: Pin) => {
    if (mode === "view") {
      setSelectedPin(pin)

      // Backend integration - accesses the filtered destination folder
      // Input: country (string), city (string), year (number)
      // Output: array of image objects with metadata
      // Function: Retrieves all images from specified location and year folder
      // const folderImages = viewFolder(pin.country, pin.city, pin.year)
      // setImages(folderImages)

      // Mock data for now
      setImages([
        { id: "1", name: "photo1.jpg", url: "/vibrant-street-market.png", year: pin.year, location: pin.city },
        { id: "2", name: "photo2.jpg", url: "/vast-mountain-valley.png", year: pin.year, location: pin.city },
      ])
    } else if (mode === "create") {
      setSelectedPin(pin)
      setIsDashboardOpen(true)
    }
  }

  // Handle image drag and drop
  const handleImageDrop = (imageId: string, pinId: string) => {
    // Backend integration - moves image file from downloads to organized folder
    // Input: imageId (string), pinId (string) - identifies source image and destination pin
    // Output: boolean success status
    // Function: Physically moves image file from downloads folder to organized location folder
    // clickandDrag(imageId, pinId)

    console.log(`Moving image ${imageId} to pin ${pinId}`)

    // Update pin image count
    setPins(pins.map((pin) => (pin.id === pinId ? { ...pin, imageCount: pin.imageCount + 1 } : pin)))
  }

  // Handle year change and auto-sort
  const handleYearChange = (year: number) => {
    setSelectedYear(year)

    if (mode === "view") {
      // Backend integration - automatically sorts images by date within the year
      // Input: year (number)
      // Output: void (modifies folder structure)
      // Function: Reorganizes images chronologically within year-based folders
      // sortDate(year)

      // Filter pins by year
      const yearPins = pins.filter((pin) => pin.year === year)
      console.log(`Filtering pins for year ${year}:`, yearPins)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      <header className="border-b bg-white dark:bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-black rounded-xl">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className="text-black dark:text-white">Photo Map Organizer</span>
            </h1>

            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMode("view")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  mode === "view"
                    ? "border-2 border-gray-800 dark:border-gray-200 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <Eye className="h-4 w-4" />
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMode("create")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  mode === "create"
                    ? "border-2 border-gray-800 dark:border-gray-200 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <Plus className="h-4 w-4" />
                Create
              </Button>
            </div>

            {mode === "view" && (
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600">
                <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                Viewing photos for {selectedYear}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-xl px-4 py-2 border border-gray-300 dark:border-gray-600">
              <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(Number(e.target.value))}
                className="bg-transparent border-none outline-none text-sm font-semibold text-gray-800 dark:text-gray-200 cursor-pointer"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {mode === "create" && (
              <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-xl px-4 py-2 border border-gray-300 dark:border-gray-600 focus-within:border-gray-500 transition-all">
                <Search className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <Input
                  placeholder="Search country or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        <div className="flex-1 relative">
          <MapContainer
            pins={pins}
            selectedYear={selectedYear}
            mode={mode}
            onMapClick={handleMapClick}
            onPinSelect={handlePinSelect}
            searchQuery={searchQuery}
          />
        </div>

        <div className="w-96 border-l border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 flex flex-col">
          {mode === "view" && selectedPin && (
            <div className="flex-1">
              <div className="p-4 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <h3 className="font-bold flex items-center gap-2 text-lg text-gray-800 dark:text-gray-200">
                  <div className="p-2 bg-gray-800 dark:bg-gray-200 rounded-lg">
                    <FolderOpen className="h-4 w-4 text-white dark:text-gray-800" />
                  </div>
                  {selectedPin.city}, {selectedPin.country}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                  {selectedPin.year} • {selectedPin.imageCount} photos
                </p>
              </div>
              <ImageGallery
                images={images}
                mode="view"
                onImageSelect={(image) => console.log("Selected image:", image)}
              />
            </div>
          )}

          {mode === "create" && (
            <div className="flex-1">
              <div className="p-4 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <h3 className="font-bold flex items-center gap-2 text-lg text-gray-800 dark:text-gray-200">
                  <div className="p-2 bg-gray-800 dark:bg-gray-200 rounded-lg">
                    <ImageIcon className="h-4 w-4 text-white dark:text-gray-800" />
                  </div>
                  Photo Library
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                  Drag photos to pins on the map
                </p>
              </div>
              <ImageGallery images={images} mode="create" onImageDrag={handleImageDrop} />
            </div>
          )}

          {!selectedPin && mode === "view" && (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div className="space-y-4">
                <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-2xl w-fit mx-auto">
                  <Eye className="h-16 w-16 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-bold mb-2 text-xl text-gray-800 dark:text-gray-200">Select a Pin</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Click on a pin to view photos from that location
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pin Dashboard Modal */}
      {isDashboardOpen && selectedPin && mode === "create" && (
        <PinDashboard
          pin={selectedPin}
          isOpen={isDashboardOpen}
          onClose={() => setIsDashboardOpen(false)}
          onImageDrop={handleImageDrop}
        />
      )}
    </div>
  )
}
