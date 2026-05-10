import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface GoogleMapsButtonProps {
  address?: string | null;
  name?: string;
  className?: string;
}

export function GoogleMapsButton({
  address,
  name,
  className,
}: GoogleMapsButtonProps) {
  const query = address
    ? encodeURIComponent(address)
    : name
    ? encodeURIComponent(name)
    : "";

  const url = query
    ? `https://www.google.com/maps/search/?api=1&query=${query}`
    : "#";

  if (!query) return null;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={className}
      >
        <MapPin className="h-4 w-4 mr-1" />
        Abrir en Google Maps
      </Button>
    </a>
  );
}
