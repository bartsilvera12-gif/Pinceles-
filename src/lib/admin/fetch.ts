import { createClient } from "@/lib/supabase/server";
import { COLLECTIONS, SINGLETONS } from "@/lib/admin/collections";

type Row = Record<string, unknown> & { id: string };

export async function getCollectionRows(collectionKey: string): Promise<Row[]> {
  const config = COLLECTIONS[collectionKey];
  if (!config) return [];
  const supabase = await createClient();
  let query = supabase.schema("pinceles").from(config.table).select("*");
  query = config.orderable ? query.order("sort_order") : query.order("created_at");
  const { data } = await query;
  return (data as Row[] | null) ?? [];
}

export async function getSingletonRow(singletonKey: string): Promise<Record<string, unknown> | null> {
  const config = SINGLETONS[singletonKey];
  if (!config) return null;
  const supabase = await createClient();
  const { data } = await supabase.schema("pinceles").from(config.table).select("*").limit(1).maybeSingle();
  return (data as Record<string, unknown> | null) ?? null;
}
