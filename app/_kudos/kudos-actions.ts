"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { MAX_HASHTAGS } from "./kudos-compose-types";

/**
 * Server actions behind the Kudos board. Both re-validate `/kudos` on success, so
 * the Server Component re-reads the feed and the browser shows database truth
 * instead of optimistic client state.
 *
 * Every rule enforced here is ALSO a database constraint or an RLS policy — this
 * layer exists to return a usable error, not to be the only guard.
 */

export interface CreateKudosInput {
  recipientId: string;
  title: string;
  /** Rich-text HTML from the compose editor. */
  content: string;
  hashtags: string[];
  anonymous: boolean;
  anonymousName: string;
}

export interface ActionResult {
  ok: boolean;
  /** An i18n key under the `kudos` namespace, never a raw database message. */
  errorKey?: string;
}

export async function createKudos(input: CreateKudosInput): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, errorKey: "action.signedOut" };

  const title = input.title.trim();
  const content = input.content.trim();
  const hashtags = [...new Set(input.hashtags.map((tag) => tag.trim()).filter(Boolean))];

  if (!input.recipientId || !title || !content || hashtags.length === 0) {
    return { ok: false, errorKey: "action.invalid" };
  }
  if (hashtags.length > MAX_HASHTAGS) return { ok: false, errorKey: "action.tooManyHashtags" };

  const anonymousName = input.anonymousName.trim();

  const { error } = await supabase.from("kudos").insert({
    sender_user_id: user.id,
    // No auth-linked profiles exist yet, so the *displayed* sender stays the
    // board's viewer row while `sender_user_id` above carries the real identity.
    // `sunners.user_id` is where these two collapse once profiles land.
    sender_sunner_id: "s1",
    receiver_sunner_id: input.recipientId,
    title,
    content,
    hashtags,
    // Attachments are not persisted yet: the compose previews are `blob:` URLs,
    // which mean nothing to another browser. They need a Storage upload first.
    images: [],
    anonymous: input.anonymous,
    anonymous_name: input.anonymous && anonymousName ? anonymousName : null,
  });

  if (error) {
    console.error("[kudos] insert failed:", error.message);
    // The self-kudos CHECK is the one a user can actually trip.
    if (error.message.includes("kudos_not_self")) {
      return { ok: false, errorKey: "action.selfKudos" };
    }
    return { ok: false, errorKey: "action.createFailed" };
  }

  revalidatePath("/kudos");
  return { ok: true };
}

/**
 * Spec C.4.1 — one heart per user per kudos, and never on your own. Toggling is a
 * delete-or-insert: the `(kudos_id, user_id)` primary key makes a double heart
 * impossible even if two clicks race.
 */
export async function toggleKudosLike(kudosId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, errorKey: "action.signedOut" };

  const { data: existing, error: readError } = await supabase
    .from("kudos_likes")
    .select("kudos_id")
    .eq("kudos_id", kudosId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (readError) {
    console.error("[kudos] like read failed:", readError.message);
    return { ok: false, errorKey: "action.likeFailed" };
  }

  const { error } = existing
    ? await supabase
        .from("kudos_likes")
        .delete()
        .eq("kudos_id", kudosId)
        .eq("user_id", user.id)
    : await supabase.from("kudos_likes").insert({ kudos_id: kudosId, user_id: user.id });

  if (error) {
    console.error("[kudos] like write failed:", error.message);
    // The insert policy refuses a heart on your own kudos, which surfaces as a
    // row-level-security violation rather than a friendly message.
    return { ok: false, errorKey: "action.likeFailed" };
  }

  revalidatePath("/kudos");
  return { ok: true };
}
