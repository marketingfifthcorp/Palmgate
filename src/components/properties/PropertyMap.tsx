"use client";

import dynamic from "next/dynamic";

const MapInner = dynamic(() => import("./PropertyMapInner"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gray-50 rounded-2xl">
      <div className="w-8 h-8 rounded-full border-2 border-pg-gold border-t-transparent animate-spin" />
    </div>
  ),
});

interface Props {
  lat: number;
  lng: number;
  title: string;
}

export default function PropertyMap({ lat, lng, title }: Props) {
  return (
    <div className="h-full min-h-80 rounded-2xl overflow-hidden border border-gray-100">
      <MapInner lat={lat} lng={lng} title={title} />
    </div>
  );
}
