import { getZones, createZone, updateZone, deleteZone } from "@/lib/actions/zones";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ZonesPage() {
  const zones = await getZones();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Zonas</h1>
          <p className="text-muted-foreground">
            Gestiona las zonas de ruta por región
          </p>
        </div>
        <Dialog>
          <DialogTrigger>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva zona
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva zona</DialogTitle>
            </DialogHeader>
            <form action={createZone} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la zona</Label>
                <Input id="name" name="name" placeholder="Ej: Providencia / Manuel Montt" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Región</Label>
                <select
                  id="region"
                  name="region"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                  required
                >
                  <option value="">Seleccionar región</option>
                  <option value="RM">RM</option>
                  <option value="V">V</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Input id="description" name="description" placeholder="Opcional" />
              </div>
              <Button type="submit" className="w-full">
                Guardar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {["RM", "V"].map((region) => (
          <Card key={region}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Región {region === "RM" ? "Metropolitana" : "Quinta Región"}</span>
                <Badge variant="secondary">
                  {zones.filter((z) => z.region === region).length} zonas
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {zones
                .filter((z) => z.region === region)
                .map((zone) => (
                  <div
                    key={zone.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-white"
                  >
                    <div>
                      <p className="font-medium">{zone.name}</p>
                      {zone.description && (
                        <p className="text-sm text-muted-foreground">
                          {zone.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Dialog>
                        <DialogTrigger>
                          <Button variant="ghost" size="icon-sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar zona</DialogTitle>
                          </DialogHeader>
                          <form
                            action={updateZone.bind(null, zone.id)}
                            className="space-y-4"
                          >
                            <div className="space-y-2">
                              <Label htmlFor={`name-${zone.id}`}>Nombre</Label>
                              <Input
                                id={`name-${zone.id}`}
                                name="name"
                                defaultValue={zone.name}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`region-${zone.id}`}>Región</Label>
                              <select
                                id={`region-${zone.id}`}
                                name="region"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                                defaultValue={zone.region}
                                required
                              >
                                <option value="RM">RM</option>
                                <option value="V">V</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`description-${zone.id}`}>Descripción</Label>
                              <Input
                                id={`description-${zone.id}`}
                                name="description"
                                defaultValue={zone.description || ""}
                              />
                            </div>
                            <Button type="submit" className="w-full">
                              Actualizar
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <form action={deleteZone.bind(null, zone.id)}>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          type="submit"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
