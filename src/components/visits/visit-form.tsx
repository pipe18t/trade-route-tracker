"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { createVisit, uploadVisitPhotos } from "@/lib/actions/visits";
import { PhotoUploader, type PhotoFile } from "./photo-uploader";
import {
  CONTACT_ROLES,
  NO_CONTACT_REASONS,
  MENU_EXECUTION_OPTIONS,
  POP_MATERIALS,
  OPPORTUNITIES,
  FINAL_STATUS_OPTIONS,
} from "@/lib/constants";

interface VisitFormProps {
  clientId: string;
  clientName: string;
}

export function VisitForm({ clientId, clientName }: VisitFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [couldTalk, setCouldTalk] = useState<boolean | null>(null);
  const [selectPopMaterial, setSelectPopMaterial] = useState<string[]>([]);
  const [selectOpportunities, setSelectOpportunities] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  function togglePopMaterial(item: string) {
    setSelectPopMaterial((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }

  function toggleOpportunity(item: string) {
    setSelectOpportunities((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }

  function handlePhotoAdd(files: FileList | null) {
    if (!files) return;
    const newPhotos: PhotoFile[] = Array.from(files).map((file) => ({
      file,
      photoType: "otro",
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).slice(2),
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  }

  function handlePhotoRemove(id: string) {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.preview);
      return prev.filter((p) => p.id !== id);
    });
  }

  function handlePhotoTypeChange(id: string, photoType: string | null) {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, photoType: photoType ?? "otro" } : p))
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("client_id", clientId);
    if (couldTalk !== null) formData.set("could_talk", String(couldTalk));
    selectPopMaterial.forEach((v) => formData.append("pop_material", v));
    selectOpportunities.forEach((v) => formData.append("opportunity_type", v));

    // Call Server Action with Zod validation + user_id injection
    const result = await createVisit(formData);

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    if (!result.visitId) {
      toast.error("No se pudo crear la visita");
      setLoading(false);
      return;
    }

    // Upload photos
    if (photos.length > 0 && result.visitId) {
      try {
        await uploadVisitPhotos(
          result.visitId,
          clientId,
          photos.map((p) => ({ file: p.file, photoType: p.photoType }))
        );
      } catch {
        toast.error("Error al subir fotos");
      }
    }

    setLoading(false);
    toast.success("Visita registrada exitosamente");
    router.push(`/clientes/${clientId}`);
    router.refresh();
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Sección 1: Datos básicos */}
      <Card>
        <CardHeader>
          <CardTitle>Datos básicos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="visit_date">Fecha de visita *</Label>
              <Input id="visit_date" name="visit_date" type="date" defaultValue={today} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visit_time">Hora</Label>
              <Input id="visit_time" name="visit_time" type="time" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact_name">Persona contactada</Label>
              <Input id="contact_name" name="contact_name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_role">Cargo</Label>
              <Select name="contact_role">
                <SelectTrigger id="contact_role">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>¿Se pudo conversar?</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="could_talk" value="true"
                  checked={couldTalk === true} onChange={() => setCouldTalk(true)}
                  className="h-4 w-4" />
                <span className="text-sm">Sí</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="could_talk" value="false"
                  checked={couldTalk === false} onChange={() => setCouldTalk(false)}
                  className="h-4 w-4" />
                <span className="text-sm">No</span>
              </label>
            </div>
          </div>

          {couldTalk === false && (
            <div className="space-y-2">
              <Label htmlFor="no_contact_reason">Motivo</Label>
              <Select name="no_contact_reason">
                <SelectTrigger id="no_contact_reason">
                  <SelectValue placeholder="Seleccionar motivo" />
                </SelectTrigger>
                <SelectContent>
                  {NO_CONTACT_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sección 2: Posicionamiento */}
      <Card>
        <CardHeader><CardTitle>Posicionamiento de marca</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="total_taps">Salidas totales</Label>
              <Input id="total_taps" name="total_taps" type="number" min="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kross_taps">Salidas Kross</Label>
              <Input id="kross_taps" name="kross_taps" type="number" min="0" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="best_selling_brand">Marca más vendida</Label>
              <Input id="best_selling_brand" name="best_selling_brand" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kross_price">Precio schop Kross ($)</Label>
              <Input id="kross_price" name="kross_price" type="number" min="0" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="competitor_price">Precio marca más vendida ($)</Label>
              <Input id="competitor_price" name="competitor_price" type="number" min="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kross_on_menu">¿Kross está en carta?</Label>
              <Select name="kross_on_menu">
                <SelectTrigger id="kross_on_menu">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Sí</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="menu_execution">Ejecución en carta</Label>
            <Select name="menu_execution">
              <SelectTrigger id="menu_execution">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {MENU_EXECUTION_OPTIONS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sección 3: Visibilidad */}
      <Card>
        <CardHeader><CardTitle>Ejecución y visibilidad</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
            {POP_MATERIALS.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={selectPopMaterial.includes(item)}
                  onChange={() => togglePopMaterial(item)} className="h-4 w-4 rounded" />
                {item}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sección 4: Competencia */}
      <Card>
        <CardHeader><CardTitle>Competencia</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="most_visible_competitor">Marca con mayor visibilidad</Label>
              <Input id="most_visible_competitor" name="most_visible_competitor" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recommended_brand_by_staff">Marca recomendada por garzones</Label>
              <Input id="recommended_brand_by_staff" name="recommended_brand_by_staff" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="competitor_notes">Observaciones</Label>
            <textarea id="competitor_notes" name="competitor_notes" rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
          </div>
        </CardContent>
      </Card>

      {/* Sección 5: Oportunidades */}
      <Card>
        <CardHeader><CardTitle>Oportunidades</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
            {OPPORTUNITIES.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={selectOpportunities.includes(item)}
                  onChange={() => toggleOpportunity(item)} className="h-4 w-4 rounded" />
                {item}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sección 6: Fotos */}
      <Card>
        <CardHeader><CardTitle>Fotos</CardTitle></CardHeader>
        <CardContent>
          <PhotoUploader photos={photos} onAdd={handlePhotoAdd}
            onRemove={handlePhotoRemove} onTypeChange={handlePhotoTypeChange} />
        </CardContent>
      </Card>

      {/* Sección 7: Próximo paso y estado */}
      <Card>
        <CardHeader><CardTitle>Próximo paso y estado final</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="next_action">Próxima acción</Label>
            <Input id="next_action" name="next_action" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="follow_up_date">Fecha sugerida seguimiento</Label>
              <Input id="follow_up_date" name="follow_up_date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="follow_up_priority">Prioridad seguimiento</Label>
              <Select name="follow_up_priority">
                <SelectTrigger id="follow_up_priority">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="general_notes">Notas generales</Label>
            <textarea id="general_notes" name="general_notes" rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="final_status">Estado final del local</Label>
            <Select name="final_status">
              <SelectTrigger id="final_status">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {FINAL_STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 pb-4 md:pb-0">
        <Button type="submit" disabled={loading} size="lg">
          {loading ? "Guardando..." : "Registrar visita"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} size="lg">
          Cancelar
        </Button>
      </div>
    </form>
  );
}
