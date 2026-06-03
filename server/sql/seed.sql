TRUNCATE outfit_items, outfits, clothing_items RESTART IDENTITY;

INSERT INTO clothing_items (name, category, color, material, season, occasion, tags, image_url) VALUES
('White Tee', 'top', 'white', 'cotton', ARRAY['summer','spring'], ARRAY['casual','work'], ARRAY['basic','minimal'], '/img/white-tee.jpg'),
('Blue Jeans', 'bottom', 'blue', 'denim', ARRAY['all'], ARRAY['casual','work'], ARRAY['denim','streetwear'], '/img/blue-jeans.jpg'),
('Jean Shorts', 'bottom', 'blue', 'denim', ARRAY['summer','spring'], ARRAY['casual','party'], ARRAY['denim','streetwear'], '/img/jean-short.jpg'),
('Sneakers', 'shoes', 'white', 'leather', ARRAY['all'], ARRAY['casual','work'], ARRAY['streetwear','minimal'], '/img/white-sneakers.jpg'),
('Gold Hoops', 'accessory', 'gold', 'metal', ARRAY['all'], ARRAY['casual','party','formal'], ARRAY['minimal'], '/img/gold-hoops.jpg');

INSERT INTO outfits (name) VALUES ('Casual Minimal');
INSERT INTO outfit_items (outfit_id, clothing_item_id) VALUES (1,1),(1,2),(1,3),(1,4);
