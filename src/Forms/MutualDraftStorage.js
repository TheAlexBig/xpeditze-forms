import { createDraftStorage } from './DraftStorage';

export const MUTUAL_AUTOSAVE_KEY = 'central-docs.mutual-draft.v3';
const storage = createDraftStorage(MUTUAL_AUTOSAVE_KEY, 3);

export const readMutualDraft = storage.read;

export const writeMutualDraft = storage.write;

export const clearMutualDraft = storage.clear;
