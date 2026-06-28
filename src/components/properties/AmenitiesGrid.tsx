import { CheckCircle2 } from "lucide-react";

export default function AmenitiesGrid({ amenities }: { amenities: string[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {amenities.map((amenity) => (
        <div key={amenity} className="flex items-center gap-2.5">
          <CheckCircle2 size={15} className="text-pg-gold shrink-0" />
          <span className="text-sm text-pg-body">{amenity}</span>
        </div>
      ))}
    </div>
  );
}
