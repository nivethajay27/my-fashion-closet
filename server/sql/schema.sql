CREATE TABLE IF NOT EXISTS clothing_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('top','bottom','shoes','accessory')),
  color TEXT,
  season TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS outfits (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS outfit_items (
  outfit_id INT REFERENCES outfits(id) ON DELETE CASCADE,
  clothing_item_id INT REFERENCES clothing_items(id) ON DELETE CASCADE,
  PRIMARY KEY (outfit_id, clothing_item_id)
);
