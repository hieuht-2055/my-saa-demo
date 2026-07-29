import { createClient } from "@/lib/supabase/server";
import { rowsToPosts, type KudosRow } from "./kudos-db-mapper";
import type { KudosPost } from "./kudos-data";

/** Row plus its hearts. RLS already limits reads to signed-in Sunners. */
const KUDOS_SELECT = "*, kudos_likes(user_id)";

export interface KudosFeed {
  posts: KudosPost[];
  /** The authenticated account, or null — decides heart state on each card. */
  viewerId: string | null;
}

/**
 * Reads the whole board from Postgres, newest first. Called from the `/kudos`
 * Server Component, so a reload rebuilds the feed and its hearts from the
 * database rather than from client state that reloading throws away.
 *
 * Failures degrade to an empty feed rather than a broken page: the board still
 * renders its other (mock) sections, and the empty state is already designed.
 */
export async function getKudosFeed(): Promise<KudosFeed> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const viewerId = user?.id ?? null;

  const { data, error } = await supabase
    .from("kudos")
    .select(KUDOS_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[kudos] feed read failed:", error.message);
    return { posts: [], viewerId };
  }

  return { posts: rowsToPosts((data ?? []) as KudosRow[], viewerId), viewerId };
}
