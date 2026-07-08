const LOCAL_WARDROBE_KEY = 'localWardrobeItems';
const WISHLIST_KEY = 'wishlistItems';

const colorWords = ['black', 'white', 'blue', 'pink', 'red', 'green', 'yellow', 'gold', 'silver', 'brown', 'navy', 'cream', 'beige', 'gray', 'grey', 'purple', 'orange'];
const categoryWords = {
  top: ['tee', 'shirt', 'blouse', 'sweater', 'tank', 'top'],
  bottom: ['jean', 'pants', 'trouser', 'skirt', 'shorts'],
  dress: ['dress', 'gown'],
  shoes: ['shoe', 'sneaker', 'boot', 'heel', 'loafer', 'sandal'],
  accessory: ['bag', 'hat', 'belt', 'necklace', 'earring', 'hoop', 'scarf'],
  outerwear: ['jacket', 'coat', 'blazer', 'cardigan']
};

const tagWords = ['minimal', 'streetwear', 'vintage', 'classic', 'romantic', 'denim', 'polished', 'soft glam', 'casual', 'formal'];

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (_e) {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeName(value) {
  return String(value || '').replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
}

export function loadLocalWardrobe() {
  return readJson(LOCAL_WARDROBE_KEY, []);
}

export function saveLocalWardrobe(items) {
  writeJson(LOCAL_WARDROBE_KEY, items);
}

export function addLocalWardrobeItem(item) {
  const items = loadLocalWardrobe();
  const next = [{ ...item, id: item.id || Date.now(), source: 'local-upload' }, ...items];
  saveLocalWardrobe(next);
  return next;
}

export function removeLocalWardrobeItem(id) {
  const next = loadLocalWardrobe().filter((item) => String(item.id) !== String(id));
  saveLocalWardrobe(next);
  return next;
}

export function mergeWardrobe(baseItems) {
  const localItems = loadLocalWardrobe();
  const ids = new Set(baseItems.map((item) => String(item.id)));
  return [...localItems.filter((item) => !ids.has(String(item.id))), ...baseItems];
}

export function inferMetadataFromUpload(fileName = '') {
  const text = normalizeName(fileName).toLowerCase();
  const category = Object.entries(categoryWords).find(([_category, words]) => words.some((word) => text.includes(word)))?.[0] || 'top';
  const color = colorWords.find((word) => text.includes(word)) || '';
  const tags = tagWords.filter((word) => text.includes(word));
  const occasion = text.includes('work') || text.includes('office') || text.includes('blazer')
    ? ['work']
    : text.includes('party') || text.includes('date')
      ? ['party', 'date']
      : ['casual'];
  const season = text.includes('coat') || text.includes('sweater') || text.includes('boot')
    ? ['fall', 'winter']
    : text.includes('short') || text.includes('tank') || text.includes('sandal')
      ? ['spring', 'summer']
      : ['all'];

  return {
    name: normalizeName(fileName) || 'Uploaded piece',
    category,
    color,
    material: '',
    season,
    occasion,
    tags: tags.length ? tags : ['new'],
    imageUrl: ''
  };
}

export function loadWishlist() {
  return readJson(WISHLIST_KEY, []);
}

export function saveWishlist(items) {
  writeJson(WISHLIST_KEY, items);
}

export function addWishlistItem(item) {
  const items = loadWishlist();
  const next = [{ ...item, id: item.id || Date.now() }, ...items];
  saveWishlist(next);
  return next;
}

export function removeWishlistItem(id) {
  const next = loadWishlist().filter((item) => String(item.id) !== String(id));
  saveWishlist(next);
  return next;
}
