"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "auth-failed") {
      toast.error("Error al iniciar sesión. Intenta de nuevo.");
    } else if (error === "no-code") {
      toast.error("Enlace inválido. Solicita uno nuevo.");
    } else if (error === "oauth_callback_failed") {
      toast.error("Error al iniciar sesión con OAuth. Intenta de nuevo.");
    }
  }, [searchParams]);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading("magiclink");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(null);

    if (error) {
      toast.error(error.message);
      return;
    }

    setSent(true);
    toast.success("Revisa tu correo para el enlace mágico");
  }

  async function handleOAuth(provider: "google" | "github") {
    setLoading(provider);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setLoading(null);
      toast.error(error.message);
    }
  }

  if (sent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Trade Route Tracker</CardTitle>
          <CardDescription>Seguimiento de rutas y ejecución en terreno</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-medium mb-2">Enlace enviado</p>
          <p className="text-sm text-muted-foreground">
            Revisa <strong>{email}</strong> y haz clic en el enlace para iniciar sesión.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Trade Route Tracker</CardTitle>
        <CardDescription className="text-center">
          Seguimiento de rutas y ejecución en terreno
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* OAuth buttons */}
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOAuth("google")}
            disabled={loading !== null}
          >
            {loading === "google" ? (
              "Conectando..."
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Iniciar sesión con Google
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOAuth("github")}
            disabled={loading !== null}
          >
            {loading === "github" ? (
              "Conectando..."
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                Iniciar sesión con GitHub
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">o con correo</span>
          <Separator className="flex-1" />
        </div>

        {/* Magic link */}
        <form onSubmit={handleMagicLink} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            disabled={loading !== null}
          >
            {loading === "magiclink" ? "Enviando..." : "Enviar enlace mágico"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
