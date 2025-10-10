TRUNCATE outfit_items, outfits, clothing_items RESTART IDENTITY;

INSERT INTO clothing_items (name, category, color, season, tags, image_url) VALUES
('White Tee', 'top', 'white', ARRAY['summer','spring'], ARRAY['basic','casual'], '/img/white-tee.jpg'),
('Blue Jeans', 'bottom', 'blue', ARRAY['all'], ARRAY['denim'], '/img/blue-jeans.jpg'),
('Jean Shorts', 'bottom', 'blue', ARRAY['all'], ARRAY['denim'], '/img/jean-short.jpg'),
('Sneakers', 'shoes', 'white', ARRAY['all'], ARRAY['streetwear'], '/img/white-sneakers.jpg'),
('Gold Hoops', 'accessory', 'gold', ARRAY['all'], ARRAY['minimal'], '/img/gold-hoops.jpg');

INSERT INTO outfits (name) VALUES ('Casual Minimal');
INSERT INTO outfit_items (outfit_id, clothing_item_id) VALUES (1,1),(1,2),(1,3),(1,4);
