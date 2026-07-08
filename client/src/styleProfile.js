export const defaultStyleProfile = {
  preferredStyles: ['minimal'],
  dislikedColors: [],
  bodyType: '',
  fashionGoals: ['wear my clothes more'],
  lifestyle: ['casual days'],
  dressCode: 'creative casual',
  location: '',
  confidenceNotes: ''
};

const PROFILE_KEY = 'styleProfile';
const PLANNED_KEY = 'plannedOutfits';

export function loadStyleProfile() {
  try {
    return { ...defaultStyleProfile, ...JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}') };
  } catch (_e) {
    return defaultStyleProfile;
  }
}

export function saveStyleProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadPlannedOutfits() {
  try {
    return JSON.parse(localStorage.getItem(PLANNED_KEY) || '[]');
  } catch (_e) {
    return [];
  }
}

export function savePlannedOutfits(plans) {
  localStorage.setItem(PLANNED_KEY, JSON.stringify(plans));
}

export function upsertPlannedOutfit(plan) {
  const plans = loadPlannedOutfits();
  const next = [plan, ...plans.filter((item) => item.date !== plan.date)];
  savePlannedOutfits(next);
  return next;
}

export function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}
