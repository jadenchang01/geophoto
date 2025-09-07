"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Search } from "lucide-react"

interface Pin {
  id: string
  country: string
  city: string
  lat: number
  lng: number
  year: number
  imageCount: number
}

interface MapContainerProps {
  pins: Pin[]
  selectedYear: number
  mode: "view" | "create"
  onMapClick: (lat: number, lng: number, country: string) => void
  onPinSelect: (pin: Pin) => void
  searchQuery: string
}

export function MapContainer({ pins, selectedYear, mode, onMapClick, onPinSelect, searchQuery }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [leaflet, setLeaflet] = useState<any>(null)
  const markersRef = useRef<any[]>([])
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const initMap = async () => {
      if (typeof window === "undefined") return

      try {
        const L = await import("leaflet")
        setLeaflet(L.default)

        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)

        if (mapRef.current && !map) {
          const mapInstance = L.default.map(mapRef.current).setView([20, 0], 2)

          L.default
            .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: "© OpenStreetMap contributors",
            })
            .addTo(mapInstance)

          setMap(mapInstance)
        }
      } catch (error) {
        console.error("Failed to load Leaflet:", error)
      }
    }

    initMap()
  }, [map, mode, onMapClick, searchQuery])

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery && searchQuery.length > 2 && mode === "create") {
        setIsSearching(true)
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
          )
          const data = await response.json()

          const results = data.map((item: any) => ({
            name: item.display_name,
            country: item.display_name.split(",").pop()?.trim() || "Unknown",
            lat: Number.parseFloat(item.lat),
            lng: Number.parseFloat(item.lon),
          }))

          setSearchResults(results)
          setIsSearching(false)
        } catch (err) {
          console.error("Geocoding failed:", err)
          setSearchResults([])
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
        setIsSearching(false)
      }
    }

    fetchResults()
  }, [searchQuery, mode, map])

  const handleCitySelection = (result: any) => {
    if (map && leaflet) {
      map.setView([result.lat, result.lng], 11)

      const tempPinIcon = leaflet.divIcon({
        html: `
          <div style="position: relative; z-index: 1000;">
            <div style="
              width: 32px; 
              height: 32px; 
              background-color: #F97316; 
              border-radius: 50%; 
              border: 4px solid white; 
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              display: flex; 
              align-items: center; 
              justify-content: center;
              transform: translate(-50%, -50%);
              cursor: pointer;
            ">
              <div style="
                width: 12px; 
                height: 12px; 
                background-color: white; 
                border-radius: 50%;
              "></div>
            </div>
            <div style="
              position: absolute; 
              top: 32px; 
              left: 50%; 
              transform: translateX(-50%);
              width: 0; 
              height: 0; 
              border-left: 8px solid transparent;
              border-right: 8px solid transparent;
              border-top: 12px solid #F97316;
            "></div>
          </div>
        `,
        className: "custom-pin-marker",
        iconSize: [32, 44],
        iconAnchor: [16, 44],
      })

      markersRef.current.forEach((marker) => {
        if (marker.options.isTemp) {
          map.removeLayer(marker)
        }
      })
      markersRef.current = markersRef.current.filter((marker) => !marker.options.isTemp)

      const tempMarker = leaflet
        .marker([result.lat, result.lng], { icon: tempPinIcon, isTemp: true })
        .addTo(map)
        .on("click", () => {
          onMapClick(result.lat, result.lng, result.country)
        })

      markersRef.current.push(tempMarker)

      setSearchResults([])
    }
  }

  useEffect(() => {
    if (!map || !leaflet) return

    markersRef.current.forEach((marker) => map.removeLayer(marker))
    markersRef.current = []

    const filteredPins = pins.filter((pin) => pin.year === selectedYear)

    filteredPins.forEach((pin) => {
      const pinColor = mode === "view" ? "#3B82F6" : "#F97316"
      const pinIcon = leaflet.divIcon({
        html: `
          <div style="position: relative; z-index: 1000;">
            <div style="
              width: 32px; 
              height: 32px; 
              background-color: ${pinColor}; 
              border-radius: 50%; 
              border: 4px solid white; 
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              display: flex; 
              align-items: center; 
              justify-content: center;
              transform: translate(-50%, -50%);
              cursor: pointer;
            ">
              <div style="
                width: 12px; 
                height: 12px; 
                background-color: white; 
                border-radius: 50%;
              "></div>
            </div>
            <div style="
              position: absolute; 
              top: 32px; 
              left: 50%; 
              transform: translateX(-50%);
              width: 0; 
              height: 0; 
              border-left: 8px solid transparent;
              border-right: 8px solid transparent;
              border-top: 12px solid ${pinColor};
            "></div>
          </div>
        `,
        className: "custom-pin-marker",
        iconSize: [32, 44],
        iconAnchor: [16, 44],
      })

      const marker = leaflet
        .marker([pin.lat, pin.lng], { icon: pinIcon })
        .addTo(map)
        .bindPopup(`
          <div style="padding: 16px; min-width: 220px; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            <h3 style="font-weight: bold; font-size: 18px; margin-bottom: 8px; color: #1F2937;">${pin.city}</h3>
            <p style="font-size: 14px; color: #6B7280; margin-bottom: 12px;">${pin.country}</p>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 14px;">
              <span style="background-color: ${mode === "view" ? "#DBEAFE" : "#FED7AA"}; color: ${mode === "view" ? "#1E40AF" : "#C2410C"}; padding: 4px 12px; border-radius: 20px; font-weight: 500;">${pin.year}</span>
              <span style="color: #6B7280; font-weight: 500;">${pin.imageCount} photos</span>
            </div>
          </div>
        `)
        .on("click", () => onPinSelect(pin))

      markersRef.current.push(marker)
    })
  }, [pins, selectedYear, map, leaflet, onPinSelect, mode])

  return (
    <div className="relative h-full">
      <div ref={mapRef} className="h-full w-full rounded-lg shadow-inner" />

      {mode === "create" && searchResults.length > 0 && (
        <div className="absolute top-4 right-4 z-[1001] w-72">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
            <h4 className="font-bold text-base mb-3 flex items-center gap-2 text-gray-800">
              <div className="p-1.5 bg-gray-800 rounded-md">
                <Search className="h-4 w-4 text-white" />
              </div>
              Search Results
            </h4>
            <div className="space-y-2">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleCitySelection(result)}
                  className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md"
                >
                  <div className="font-semibold text-sm text-gray-800">{result.name}</div>
                  <div className="text-xs text-gray-600 font-medium">{result.country}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {!map && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-lg">
          <div className="text-center space-y-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full w-fit mx-auto shadow-lg">
              <MapPin className="h-10 w-10 text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>
            <p className="text-base font-medium text-gray-700 dark:text-gray-300">Loading interactive map...</p>
          </div>
        </div>
      )}

      {isSearching && mode === "create" && (
        <div className="absolute top-4 right-4 z-[1001]">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Searching locations...</span>
          </div>
        </div>
      )}
    </div>
  )
}
