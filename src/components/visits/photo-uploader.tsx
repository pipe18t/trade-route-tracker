"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Image as ImageIcon } from "lucide-react";

const PHOTO_TYPES = [
  { value: "fachada", label: "Fachada" },
  { value: "barra", label: "Barra" },
  { value: "carta", label: "Carta" },
  { value: "material_pop", label: "Material POP" },
  { value: "competencia", label: "Competencia" },
  { value: "salidas_cerveza", label: "Salidas" },
  { value: "otro", label: "Otro" },
];

interface PhotoFile {
  file: File;
  photoType: string;
  preview: string;
  id: string;
}

interface PhotoUploaderProps {
  photos: PhotoFile[];
  onAdd: (files: FileList | null) => void;
  onRemove: (id: string) => void;
  onTypeChange: (id: string, type: string | null) => void;
}

export function PhotoUploader({
  photos,
  onAdd,
  onRemove,
  onTypeChange,
}: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
      >
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          Haz clic o arrastra imágenes aquí
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Múltiples fotos permitidas
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onAdd(e.target.files)}
        />
      </div>

      {photos.length > 0 && (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative rounded-lg border overflow-hidden bg-white"
            >
              <img
                src={photo.preview}
                alt="Preview"
                className="w-full h-32 object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(photo.id)}
                className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="p-2">
                <Select
                  value={photo.photoType}
                  onValueChange={(v) => onTypeChange(photo.id, v ?? "otro")}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {PHOTO_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export type { PhotoFile };
export { PHOTO_TYPES };
