export const CATEGORIES = ['top', 'bottom', 'dress', 'shoes', 'accessory', 'outerwear'];
export const OCCASIONS = ['casual', 'formal', 'party', 'work', 'date', 'travel'];
export const SEASONS = ['spring', 'summer', 'fall', 'winter', 'all'];

const neutralColors = ['black', 'white', 'gray', 'grey', 'cream', 'beige', 'navy', 'brown', 'denim'];
const warmColors = ['red', 'orange', 'yellow', 'gold', 'tan', 'coral', 'pink'];
const coolColors = ['blue', 'green', 'purple', 'teal', 'mint', 'silver'];
const complementary = {
  red: ['green', 'black', 'white', 'denim'],
  orange: ['blue', 'navy', 'cream'],
  yellow: ['purple', 'navy', 'white'],
  green: ['red', 'cream', 'brown', 'black'],
  blue: ['orange', 'white', 'gray', 'tan'],
  purple: ['yellow', 'black', 'cream'],
  pink: ['green', 'white', 'gray', 'denim'],
  gold: ['black', 'white', 'cream', 'navy']
};

const normalize = (value) => String(value || '').trim().toLowerCase();
const list = (value) => Array.isArray(value) ? value.map(normalize).filter(Boolean) : [];
const unique = (values) => [...new Set(values.filter(Boolean))];
const hasAllSeason = (item) => list(item.season).includes('all');

export function filterWardrobe(items, filters = {}) {
  const category = normalize(filters.category);
  const color = normalize(filters.color);
  const season = normalize(filters.season);
  const occasion = normalize(filters.occasion);

  return items.filter((item) => {
    const itemSeasons = list(item.season);
    const itemOccasions = list(item.occasion);
    const colorMatch = !color || colorCompatibility(item.color, color) >= 50;
    return (!category || item.category === category)
      && colorMatch
      && (!season || itemSeasons.includes(season) || itemSeasons.includes('all'))
      && (!occasion || itemOccasions.includes(occasion));
  });
}

export function colorCompatibility(a, b) {
  const left = normalize(a);
  const right = normalize(b);
  if (!left || !right) return 70;
  if (left === right) return 92;
  if (neutralColors.includes(left) || neutralColors.includes(right)) return 86;
  if ((complementary[left] || []).includes(right) || (complementary[right] || []).includes(left)) return 90;
  if (warmColors.includes(left) && warmColors.includes(right)) return 72;
  if (coolColors.includes(left) && coolColors.includes(right)) return 74;
  return 50;
}

function outfitColorScore(items) {
  const colors = unique(items.map((item) => normalize(item.color)));
  if (colors.length <= 1) return colors.length ? 88 : 70;
  const scores = [];
  for (let i = 0; i < colors.length; i += 1) {
    for (let j = i + 1; j < colors.length; j += 1) {
      scores.push(colorCompatibility(colors[i], colors[j]));
    }
  }
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function occasionScore(items, occasion) {
  const target = normalize(occasion);
  if (!target) return 70;
  const scores = items.map((item) => list(item.occasion).includes(target) ? 100 : 45);
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / Math.max(scores.length, 1));
}

function seasonScore(items, weatherOrSeason) {
  const target = weatherToSeason(weatherOrSeason);
  if (!target) return 76;
  const scores = items.map((item) => {
    const seasons = list(item.season);
    if (seasons.includes(target) || seasons.includes('all')) return 100;
    if (target === 'summer' && item.category === 'outerwear') return 24;
    return 48;
  });
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / Math.max(scores.length, 1));
}

function styleConsistencyScore(items, preferredStyles = []) {
  const preferred = list(preferredStyles);
  const tags = items.flatMap((item) => list(item.tags));
  if (!tags.length) return preferred.length ? 55 : 70;
  const shared = tags.filter((tag, index) => tags.indexOf(tag) !== index).length;
  const preferredHits = preferred.length ? tags.filter((tag) => preferred.includes(tag)).length : 0;
  return Math.min(100, Math.round(58 + shared * 8 + preferredHits * 12));
}

function weatherToSeason(weather) {
  const value = normalize(weather);
  if (SEASONS.includes(value)) return value;
  if (['hot', 'warm', 'sunny', 'humid'].includes(value)) return 'summer';
  if (['cold', 'snow', 'snowy', 'freezing'].includes(value)) return 'winter';
  if (['rain', 'rainy', 'cool', 'windy'].includes(value)) return 'fall';
  return '';
}

function chooseBest(candidates, scorer, lockedItem) {
  if (lockedItem) return lockedItem;
  return [...candidates].sort((a, b) => scorer(b) - scorer(a))[0] || null;
}

function itemBaseScore(item, preferences, context) {
  const dislikedColors = list(preferences.dislikedColors);
  const preferredStyles = list(preferences.preferredStyles);
  const tags = list(item.tags);
  const occasions = list(item.occasion);
  const seasons = list(item.season);
  let score = 40;

  if (context.occasion && occasions.includes(normalize(context.occasion))) score += 22;
  if (context.weather && (seasons.includes(weatherToSeason(context.weather)) || hasAllSeason(item))) score += 18;
  if (preferredStyles.some((style) => tags.includes(style))) score += 18;
  if (dislikedColors.includes(normalize(item.color))) score -= 50;
  if (preferences.fashionGoals?.includes('look taller') && ['monochrome', 'minimal'].some((tag) => tags.includes(tag))) score += 8;
  if (preferences.fashionGoals?.includes('formal') && occasions.includes('formal')) score += 12;
  if (preferences.fashionGoals?.includes('casual') && occasions.includes('casual')) score += 12;
  return score;
}

function validForContext(item, preferences, context, forced = false) {
  if (!item) return false;
  if (list(preferences.dislikedColors).includes(normalize(item.color))) return false;
  if (forced) return true;
  const season = weatherToSeason(context.weather);
  if (season && !hasAllSeason(item) && !list(item.season).includes(season)) {
    if (season === 'summer' && item.category === 'outerwear') return false;
  }
  return true;
}

export function scoreOutfit(items, preferences = {}, context = {}) {
  const outfit = items.filter(Boolean);
  const breakdown = {
    colorHarmony: outfitColorScore(outfit),
    occasionMatch: occasionScore(outfit, context.occasion),
    seasonMatch: seasonScore(outfit, context.weather),
    styleConsistency: styleConsistencyScore(outfit, preferences.preferredStyles)
  };
  const rating = Math.round(
    breakdown.colorHarmony * 0.28
    + breakdown.occasionMatch * 0.3
    + breakdown.seasonMatch * 0.22
    + breakdown.styleConsistency * 0.2
  );
  return { breakdown, rating };
}

export function generateStyledOutfit(userPreferences = {}, wardrobeItems = [], context = {}, lockedItems = []) {
  const forcedByCategory = Object.fromEntries(lockedItems.map((item) => [item.category, item]));
  const usable = wardrobeItems.filter((item) => validForContext(item, userPreferences, context, Boolean(forcedByCategory[item.category])));
  const byCategory = (category) => usable.filter((item) => item.category === category);
  const scorer = (item) => itemBaseScore(item, userPreferences, context);

  const dress = chooseBest(byCategory('dress'), scorer, forcedByCategory.dress);
  const top = chooseBest(byCategory('top'), scorer, forcedByCategory.top);
  const bottom = chooseBest(byCategory('bottom'), scorer, forcedByCategory.bottom);
  const shoes = chooseBest(byCategory('shoes'), scorer, forcedByCategory.shoes);

  let foundation = [];
  const dressScore = dress ? scorer(dress) + 12 : -Infinity;
  const separatesScore = top && bottom ? scorer(top) + scorer(bottom) : -Infinity;
  if (dressScore >= separatesScore && dress) {
    foundation = [dress];
  } else if (top && bottom) {
    foundation = [top, bottom];
  } else if (dress) {
    foundation = [dress];
  } else {
    foundation = [top, bottom].filter(Boolean);
  }

  const selected = [
    ...foundation,
    shoes,
    chooseBest(byCategory('outerwear'), scorer, forcedByCategory.outerwear),
    chooseBest(byCategory('accessory'), scorer, forcedByCategory.accessory)
  ].filter(Boolean);

  const outfit = uniqueById(selected);
  const { breakdown, rating } = scoreOutfit(outfit, userPreferences, context);
  const explanation = buildExplanation(outfit, breakdown, userPreferences, context);

  return {
    outfit,
    scoreBreakdown: breakdown,
    rating,
    explanation
  };
}

function uniqueById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function buildExplanation(items, breakdown, preferences, context) {
  const names = items.map((item) => item.name).join(', ');
  const tags = unique(items.flatMap((item) => list(item.tags))).slice(0, 3);
  const occasion = context.occasion ? ` for ${context.occasion}` : '';
  const weather = context.weather ? ` in ${context.weather} weather` : '';
  const style = tags.length ? ` The shared ${tags.join(', ')} styling keeps it cohesive.` : '';
  const color = breakdown.colorHarmony >= 80
    ? ' The palette is harmonious with neutral or complementary colors.'
    : ' The palette has some contrast, so the score favors the strongest compatible pieces.';
  const preference = list(preferences.preferredStyles).length
    ? ` It also leans into your ${list(preferences.preferredStyles).join(', ')} preferences.`
    : '';
  return `Selected ${names}${occasion}${weather}.${color}${style}${preference}`;
}

export function cycleCategory(currentOutfit, wardrobeItems, category, direction = 1) {
  const alternatives = wardrobeItems.filter((item) => item.category === category);
  if (!alternatives.length) return currentOutfit;
  const current = currentOutfit.find((item) => item.category === category);
  const index = Math.max(0, alternatives.findIndex((item) => item.id === current?.id));
  const next = alternatives[(index + direction + alternatives.length) % alternatives.length];
  return uniqueById([...currentOutfit.filter((item) => item.category !== category), next]);
}
