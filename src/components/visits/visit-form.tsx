"use client";

import { useState } from "react";
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
import { createClient } from "@/lib/supabase/client";
import { PhotoUploader, PHOTO_TYPES, type PhotoFile } from "./photo-uploader";
import { uploadVisitPhotos } from "@/lib/actions/visits";

const CONTACT_ROLES = [
  "Administrador",
  "Garzón",
  "Jefe local",
  "Encargado barra",
  "Dueño",
  "Otro",
];

const NO_CONTACT_REASONS = [
  "administrador no disponible",
  "administradora en reunión",
  "pedir hora",
  "local cerrado",
  "encargado ocupado",
  "no corresponde visitar en ese horario",
  "otro",
];

const MENU_EXECUTION = [
  { value: "correcto", label: "Correcto" },
  { value: "incorrecto", label: "Incorrecto" },
  { value: "no aparece", label: "No aparece" },
  { value: "pendiente revisar", label: "Pendiente revisar" },
];

const POP_MATERIALS = [
  "ojo de buey",
  "latón",
  "portaplacas",
  "vasos Kross",
  "carta / menú",
  "sticker",
  "refrigerador",
  "toldo / sombrilla",
  "posavasos",
  "ningún material visible",
  "otro",
];

const OPPORTUNITIES = [
  "falta material POP",
  "mejorar visibilidad en barra",
  "mejorar presencia en carta",
  "oportunidad de capacitación",
  "oportunidad de activación",
  "oportunidad de cambio de mix",
  "local solicita material",
  "local solicita visita comercial",
  "seguimiento con administrador",
  "otro",
];

const FINAL_STATUSES = [
  { value: "visitado", label: "Visitado" },
  { value: "seguimiento", label: "Seguimiento" },
  { value: "no_atendido", label: "No atendido" },
  { value: "coordinar_hora", label: "Coordinar hora" },
  { value: "administrador_no_disponible", label: "Adm. no disponible" },
];

interface VisitFormProps {
  clientId: string;
  clientName: string;
}

export function VisitForm({ clientId, clientName }: VisitFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<PhotoFile[]>([]);

  const [couldTalk, setCouldTalk] = useState<boolean | null>(null);
  const [selectPopMaterial, setSelectPopMaterial] = useState<string[]>([]);
  const [selectOpportunities, setSelectOpportunities] = useState<string[]>([]);

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

    // Append array values
    selectPopMaterial.forEach((v) => formData.append("pop_material", v));
    selectOpportunities.forEach((v) => formData.append("opportunity_type", v));

    if (couldTalk !== null) formData.set("could_talk", String(couldTalk));

    // Insert visit first
    const { error } = await supabase.from("visits").insert({
      client_id: clientId,
      visit_date: formData.get("visit_date") as string,
      visit_time: (formData.get("visit_time") as string) || null,
      contact_name: (formData.get("contact_name") as string) || null,
      contact_role: (formData.get("contact_role") as string) || null,
      could_talk: couldTalk,
      no_contact_reason: (formData.get("no_contact_reason") as string) || null,
      total_taps: formData.get("total_taps")
        ? parseInt(formData.get("total_taps") as string)
        : null,
      kross_taps: formData.get("kross_taps")
        ? parseInt(formData.get("kross_taps") as string)
        : null,
      best_selling_brand: (formData.get("best_selling_brand") as string) || null,
      kross_price: formData.get("kross_price")
        ? parseInt(formData.get("kross_price") as string)
        : null,
      competitor_price: formData.get("competitor_price")
        ? parseInt(formData.get("competitor_price") as string)
        : null,
      kross_on_menu: (formData.get("kross_on_menu") as string) || null,
      menu_execution: (formData.get("menu_execution") as string) || null,
      pop_material: selectPopMaterial.length > 0 ? selectPopMaterial : null,
      competitors: null,
      most_visible_competitor: (formData.get("most_visible_competitor") as string) || null,
      recommended_brand_by_staff: (formData.get("recommended_brand_by_staff") as string) || null,
      competitor_notes: (formData.get("competitor_notes") as string) || null,
      opportunity_type: selectOpportunities.length > 0 ? selectOpportunities : null,
      next_action: (formData.get("next_action") as string) || null,
      follow_up_date: (formData.get("follow_up_date") as string) || null,
      follow_up_priority: (formData.get("follow_up_priority") as string) || null,
      general_notes: (formData.get("general_notes") as string) || null,
      final_status: (formData.get("final_status") as string) || null,
    })
      .select("id")
      .single();

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    const visitId = error ? null : (formData as unknown as { id?: string }).id || "";

    // Get the actual inserted visit
    const { data: visitData, error: visitErr } = await supabase
      .from("visits")
      .select("id")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (visitErr || !visitData) {
      toast.error("Error obteniendo visita");
      setLoading(false);
      return;
    }

    // Upload photos
    if (photos.length > 0) {
      const photoFiles = photos.map((p) => ({
        file: p.file,
        photoType: p.photoType,
      }));
      await uploadVisitPhotos(visitData.id, clientId, photoFiles);
    }

    setLoading(false);
    toast.success("Visita registrada exitosamente");
    router.push(`/clientes/${clientId}`);
    router.refresh();
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Sección 1: Datos básicos */}
      <Card>
        <CardHeader>
          <CardTitle>Datos básicos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="visit_date">Fecha de visita *</Label>
              <Input
                id="visit_date"
                name="visit_date"
                type="date"
                defaultValue={today}
                required
              />
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
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
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
                <input
                  type="radio"
                  name="could_talk"
                  checked={couldTalk === true}
                  onChange={() => setCouldTalk(true)}
                  className="h-4 w-4"
                />
                <span className="text-sm">Sí</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="could_talk"
                  checked={couldTalk === false}
                  onChange={() => setCouldTalk(false)}
                  className="h-4 w-4"
                />
                <span className="text-sm">No</span>
              </label>
            </div>
          </div>

          {couldTalk === false && (
            <div className="space-y-2">
              <Label>Motivo</Label>
              <Select name="no_contact_reason">
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar motivo" />
                </SelectTrigger>
                <SelectContent>
                  {NO_CONTACT_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sección 2: Posicionamiento */}
      <Card>
        <CardHeader>
          <CardTitle>Posicionamiento de marca</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="total_taps">Salidas totales</Label>
              <Input
                id="total_taps"
                name="total_taps"
                type="number"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kross_taps">Salidas Kross</Label>
              <Input
                id="kross_taps"
                name="kross_taps"
                type="number"
                min="0"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="best_selling_brand">Marca más vendida</Label>
              <Input id="best_selling_brand" name="best_selling_brand" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kross_price">Precio schop Kross ($)</Label>
              <Input
                id="kross_price"
                name="kross_price"
                type="number"
                min="0"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="competitor_price">
                Precio marca más vendida ($)
              </Label>
              <Input
                id="competitor_price"
                name="competitor_price"
                type="number"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label>¿Kross está en carta?</Label>
              <Select name="kross_on_menu">
                <SelectTrigger>
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
            <Label>Ejecución en carta</Label>
            <Select name="menu_execution">
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {MENU_EXECUTION.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sección 3: Visibilidad */}
      <Card>
        <CardHeader>
          <CardTitle>Ejecución y visibilidad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
            {POP_MATERIALS.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectPopMaterial.includes(item)}
                  onChange={() => togglePopMaterial(item)}
                  className="h-4 w-4 rounded"
                />
                {item}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sección 4: Competencia */}
      <Card>
        <CardHeader>
          <CardTitle>Competencia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="most_visible_competitor">
                Marca con mayor visibilidad
              </Label>
              <Input
                id="most_visible_competitor"
                name="most_visible_competitor"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recommended_brand_by_staff">
                Marca recomendada por garzones
              </Label>
              <Input
                id="recommended_brand_by_staff"
                name="recommended_brand_by_staff"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="competitor_notes">Observaciones</Label>
            <textarea
              id="competitor_notes"
              name="competitor_notes"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sección 5: Oportunidades */}
      <Card>
        <CardHeader>
          <CardTitle>Oportunidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
            {OPPORTUNITIES.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectOpportunities.includes(item)}
                  onChange={() => toggleOpportunity(item)}
                  className="h-4 w-4 rounded"
                />
                {item}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sección 6: Fotos */}
      <Card>
        <CardHeader>
          <CardTitle>Fotos</CardTitle>
        </CardHeader>
        <CardContent>
          <PhotoUploader
            photos={photos}
            onAdd={handlePhotoAdd}
            onRemove={handlePhotoRemove}
            onTypeChange={handlePhotoTypeChange}
          />
        </CardContent>
      </Card>

      {/* Sección 7: Próximo paso y estado */}
      <Card>
        <CardHeader>
          <CardTitle>Próximo paso y estado final</CardTitle>
        </CardHeader>
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
              <Label>Prioridad seguimiento</Label>
              <Select name="follow_up_priority">
                <SelectTrigger>
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
            <textarea
              id="general_notes"
              name="general_notes"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
            />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Estado final del local *</Label>
            <Select name="final_status" required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {FINAL_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
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
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          size="lg"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
