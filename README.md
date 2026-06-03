# Fashion Closet

Fashion Closet is a full-stack virtual wardrobe app with an intelligent outfit stylist, a simulated try-on preview, and saved outfit views. The interface is built around a modern editorial fashion aesthetic with soft pink, lavender, charcoal, and periwinkle styling.

## Screenshots

### Home / Virtual Closet

![Fashion Closet home page](./client/public/screenshots/home.jpg)

### AI Stylist / Try-On Preview

![Fashion Closet stylist page](./client/public/screenshots/stylist.jpg)

### Saved Outfits

![Fashion Closet saved outfits page](./client/public/screenshots/outfits.jpg)

## Features

- Virtual closet with rich clothing metadata: category, color, material, season, occasion, image URL, and tags.
- Closet filtering by category, occasion, season/weather, and color compatibility.
- Rule-based outfit generation that creates valid outfit combinations:
  - one top plus one bottom, or one dress
  - one pair of shoes
  - optional outerwear and accessory
  - no duplicate core categories
  - season-aware matching
- Outfit scoring for color harmony, occasion match, season match, and style consistency.
- AI stylist logic through `generateStyledOutfit(userPreferences, wardrobeItems, context)`.
- Simulated virtual try-on with layered clothing images over an avatar or uploaded user image.
- Swap, regenerate, lock item, and save outfit controls.
- Saved outfits page with outfit collage previews and modal details.
- Demo wardrobe fallback when the backend API is not available.

## Tech Stack

- Frontend: React, React Router, CSS
- Backend: Node.js, Express
- Database: PostgreSQL
- Data access: `pg`

## Project Structure

```text
client/
  public/screenshots/       App screenshots used by this README
  src/components/           Closet, stylist, try-on, and outfit components
  src/pages/                Items, Stylist, and Saved Outfits pages
  src/stylingEngine.js      Outfit generation and scoring logic
server/
  sql/schema.sql            PostgreSQL schema
  sql/seed.sql              Seed wardrobe data
  src/routes/               Items and outfits API routes
```

## Getting Started

Install dependencies:

```bash
cd client
npm install

cd ../server
npm install
```

Create a server environment file with your PostgreSQL URL:

```bash
DATABASE_URL=postgres://user:password@localhost:5432/fashion_closet
PORT=4000
```

Set up the database:

```bash
psql "$DATABASE_URL" -f server/sql/schema.sql
psql "$DATABASE_URL" -f server/sql/seed.sql
```

Run the backend:

```bash
cd server
npm start
```

Run the frontend:

```bash
cd client
npm start
```

The app opens at:

```text
http://localhost:3000
```

## Frontend Scripts

```bash
npm start
npm run build
npm test -- --watchAll=false
```

## API Overview

```text
GET    /api/health
GET    /api/items
POST   /api/items
PUT    /api/items/:id
DELETE /api/items/:id
GET    /api/outfits
POST   /api/outfits
DELETE /api/outfits/:id
```

## Notes

The frontend includes a local demo wardrobe fallback, so the closet and stylist pages remain usable even if the API or database is not running. Saved outfits are persisted to the backend when available, and fall back to browser local storage during demo mode.
