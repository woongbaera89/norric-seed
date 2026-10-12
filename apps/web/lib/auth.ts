import { supabase } from "./supabase";

/** Magic link = sign-up and login in one flow (new emails get an account automatically). */
export async function sendMagicLink(email: string) {
  const { error } = await supabase().auth.signInWithOtp({
    email, options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/auth/callback` },
  });
  return error;
}
