import "server-only";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cache } from "react";

export const verifySession = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Auto-create profile if missing (trigger failed or user predates migration)
  if (!profile) {
    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert({ id: user.id, email: user.email, role: "practicante" })
      .select("*")
      .single();

    if (insertError || !newProfile) {
      // Fallback: return a minimal profile so the app doesn't crash
      return {
        user,
        profile: {
          id: user.id,
          email: user.email,
          full_name: null,
          role: "practicante",
          created_at: new Date().toISOString(),
        },
      };
    }
    profile = newProfile;
  }

  return {
    user,
    profile,
  };
});

export async function getAuthenticatedClient() {
  return await createClient();
}
