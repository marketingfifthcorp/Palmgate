"use client";

import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";

interface Props {
  lat: number;
  lng: number;
  title: string;
}

export default function PropertyMapInner({ lat, lng, title }: Props) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-2xl text-pg-muted text-sm">
        Map unavailable — add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local
      </div>
    );
  }

  return (
    <Map
      initialViewState={{ longitude: lng, latitude: lat, zoom: 14 }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={token}
    >
      <NavigationControl position="top-right" />
      <Marker longitude={lng} latitude={lat} anchor="bottom">
        <div className="flex flex-col items-center">
          <div className="bg-pg-gold text-pg-dark text-xs font-semibold px-2.5 py-1 rounded-lg shadow-md whitespace-nowrap max-w-[160px] truncate mb-1">
            {title}
          </div>
          <MapPin size={28} className="text-pg-gold drop-shadow" fill="#C3B590" />
        </div>
      </Marker>
    </Map>
  );
}
