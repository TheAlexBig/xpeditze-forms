import { writeMarriageDraft } from '../Forms/MarriageDraftStorage';
import { writeMutualDraft } from '../Forms/MutualDraftStorage';

export const prepareHistoryDraft = (
  historyItem,
  storage,
  loadCarSaleDraft,
  savedAt = new Date().toISOString()
) => {
  if (historyItem.type === 'marriage') {
    writeMarriageDraft(storage, historyItem.draft, savedAt);
    return '/matrimonio';
  }
  if (historyItem.type === 'mutual') {
    writeMutualDraft(storage, historyItem.draft, savedAt);
    return '/mutuo';
  }
  loadCarSaleDraft(historyItem);
  return '/compra-venta';
};
