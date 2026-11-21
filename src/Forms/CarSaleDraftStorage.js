import { createDraftStorage } from './DraftStorage';

export const CAR_SALE_AUTOSAVE_KEY = 'xpeditze.car-sale-draft.v4';
const storage = createDraftStorage(CAR_SALE_AUTOSAVE_KEY, 4);

export const readCarSaleDraft = storage.read;

export const writeCarSaleDraft = storage.write;

export const clearCarSaleDraft = storage.clear;
