import { supabase } from './supabase.js';

// Calls the identify-cards Edge Function. Throws on failure — caller should
// fall back to manual card selection rather than guessing.
export async function identifyCardsFromImage(imageBase64) {
  const { data, error } = await supabase.functions.invoke('identify-cards', {
    body: { image: imageBase64 },
  });
  if (error) throw error;
  return data;
}

// Reuses WizardHat_GameIdea's "deck" Edge Function (same Supabase project,
// same wh_cards table — card_no here matches its card `id`) to get signed
// image URLs for specific cards, instead of duplicating the 50 image files
// into this app. Signed URLs expire after 1hr; fine for a single session.
export async function getCardImages(cardNos) {
  const { data, error } = await supabase.functions.invoke('deck', {
    body: { action: 'byIds', ids: cardNos.map(Number) },
  });
  if (error) throw error;
  const byId = {};
  for (const c of data?.cards ?? []) {
    byId[String(c.id)] = c.imgUrl;
  }
  return byId;
}
