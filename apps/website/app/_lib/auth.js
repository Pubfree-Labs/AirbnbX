import { createClient } from "./supabase/server";

export async function auth() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: guest } = await supabase
    .from("guests")
    .select("*")
    .eq("userId", user.id)
    .maybeSingle();

  return {
    user: {
      id: user.id,
      email: user.email,
      name:
        guest?.fullName ||
        user.user_metadata?.fullName ||
        user.email?.split("@").at(0),
      image: user.user_metadata?.avatar || "",
      guestId: guest?.id ?? null,
    },
  };
}
